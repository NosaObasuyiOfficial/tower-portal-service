import { Request, Response } from "express";
import dotenv from "dotenv";
import paystack from "../utils/paystackService";
import { randomUUID } from "crypto";
import Admission, { Uploads, UploadedFile } from "../model/admissionRecords";
// import { uploadFileToStorage } from "../storage/uploadFileToStorage"; // your S3 / disk helper — see note below

import { UniqueConstraintError } from "sequelize";
import RegistrationPayments from "../model/registrationTransactions";
import { sendAdmissionNotification } from "../utils/notification";

dotenv.config();
const { REGISTRAION_FEE, PAYSTACK_CALLBACK_URL }: any = process.env;

export const initializePayment = async (req: Request, res: Response) => {
  try {
    const { email, fullName } = req.body;
    const applicationId = randomUUID();

    const amount = parseInt(REGISTRAION_FEE); // in kobo

    const response = await paystack.post("/transaction/initialize", {
      email,
      amount,
      callback_url: PAYSTACK_CALLBACK_URL!,
      metadata: {
        applicationId,
        fullName,
      },
    });

    if (response.data.status) {

      const paymentSuccess = await RegistrationPayments.create({
        id: applicationId,
        title: "REGISTRATION FEE",
        fullName,
        email,
        paymentReference: "",
        paymentStatus: "PENDING",
        paymentAmount: amount / 100,
        paidAt: new Date().toISOString(),
      });

      if (paymentSuccess) {
        return res.status(200).json({...response.data.data, amount});
      } else {
        return res.status(400).json({
          success: false,
          message: "Payment not registered",
        });
      }
    }
  } catch (error: any) {
    if (error instanceof UniqueConstraintError) {
      return res.status(400).json({
        success: false,
        message: "Payment already initialized",
      });
    }
    return res.status(500).json({
      message: error.response?.data || error.message,
    });
  }
};


/* =============================================================================
   POST /api/admissions
   The form on the frontend sends multipart/form-data:
     - a "payload" field containing the JSON-stringified formData
     - up to 4 files: birthCertificate, passport, immunization, academicRecords
     - a "signatureFile" if signatureMode === "draw" (the canvas PNG blob)
   Use multer (or busboy) upstream to parse this into req.body / req.files.
   ============================================================================= */
export async function createAdmissionRecord(req: Request, res: Response) {
  try {
    const payload = req.body.payload;

    // const files = req.files as Record<string, Express.Multer.File[]>;
    const files = "";

    // ---- 1. Re-validate on the server. Never trust the client-side Zod-style
    // checks alone — they're UX, not security/data-integrity.
    const errors = validateAdmissionPayload(payload);
    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ errors });
    }

    // ---- 2. Upload each provided file to storage and collect { name, url, size, mimeType }.
    // Postgres should never hold raw file bytes for something this size-variable.
    // const uploads: Uploads = {
    //   birthCertificate: await persistUpload(files?.birthCertificate?.[0]),
    //   passport: await persistUpload(files?.passport?.[0]),
    //   immunization: await persistUpload(files?.immunization?.[0]),
    //   academicRecords: await persistUpload(files?.academicRecords?.[0]),
    // };
    const uploads: Uploads = {
      birthCertificate: null,
      passport: null,
      immunization: null,
      academicRecords: null,
    };

    // ---- 3. Signature: either a typed name (plain text, store directly) or a
    // drawn signature (uploaded as its own small PNG, store the URL — a base64
    // canvas string is *much* too heavy to keep as a text column at scale).
    let signatureImageUrl: string | null = null;
    if (payload.consent.signatureMode === "draw") {
      // const signatureFile = files?.signatureFile?.[0];
      // const persisted = await persistUpload(signatureFile);
      const persisted:any = null;
      signatureImageUrl = persisted?.url ?? null;
    }

    // ---- 4. Track-conditional fields: only carry Montessori answers through
    // when the applicant actually chose that track. Guardian 2 "None" collapses
    // to nulls rather than storing the literal string everywhere.
    const isMontessori = payload.program.track === "montessori";
    const g2 = payload.guardian2;
    const g2IsNone = !g2?.relation || g2.relation === "None";

    const applicationId = randomUUID();

    const admission = await Admission.create({
      id: applicationId,

      academicYear: payload.program.academicYear,
      admissionType: payload.program.admissionType,
      track: payload.program.track,
      grade: payload.program.grade,

      studentFirstName: payload.student.firstName,
      studentMiddleName: payload.student.middleName || null,
      studentLastName: payload.student.lastName,
      studentDob: payload.student.dob,
      gender: payload.student.gender,
      address: payload.student.address,
      previousSchool: payload.student.previousSchool || null,

      guardian1Relation: payload.guardian1.relation,
      guardian1Name: payload.guardian1.name,
      guardian1Phone: payload.guardian1.phone,
      guardian1Email: payload.guardian1.email,
      guardian1Occupation: payload.guardian1.occupation,

      guardian2Relation: g2IsNone ? null : g2.relation,
      guardian2Name: g2IsNone ? null : g2.name,
      guardian2Phone: g2IsNone ? null : g2.phone,
      guardian2Email: g2IsNone ? null : g2.email,
      guardian2Occupation: g2IsNone ? null : g2.occupation,

      emergencyRelation: payload.medical.emergencyRelation,
      emergencyPhone: payload.medical.emergencyPhone,
      allergies: payload.medical.allergies || null,
      medicalConditions: payload.medical.conditions || null,

      montessoriAttendedBefore: isMontessori ? payload.montessori.attendedBefore : null,
      montessoriInterest: isMontessori ? payload.montessori.interest : null,
      montessoriStrengths: isMontessori ? payload.montessori.strengths : null,

      uploads,

      tuitionAgreement: payload.consent.tuitionAgreement,
      mediaRelease: payload.consent.mediaRelease,
      signatureMode: payload.consent.signatureMode,
      signatureTypedName: payload.consent.signatureMode === "type" ? payload.consent.signatureTypedName : null,
      signatureImageUrl,
      signatureDate: payload.consent.signatureDate,

      status: "submitted",
    });

    await sendAdmissionNotification({data:payload, applicationId, submittedAt: new Date() })
    return res.status(201).json({ id: admission.get("id") });
  } catch (err) {
    console.error("createAdmissionRecord failed:", err);
    return res.status(500).json({ error: "Could not save the application. Please try again." });
  }
}

/* Uploads a single multer file (if present) and returns the UploadedFile record. */
// async function persistUpload(file?: Express.Multer.File): Promise<UploadedFile | null> {
//   if (!file) return null;
//   // const url = await uploadFileToStorage(file); // implement against S3 / GCS / disk
//   const url = {
//     street:"",
//   city:"",
//   state:"",
//   postalCode:"", 
//   }
//   return { name: file.originalname, url, size: file.size, mimeType: file.mimetype };
// }

/* Mirrors the frontend's per-step Zod-style rules — kept intentionally small
   here; swap in a real Zod schema (or the shared validators from the
   frontend, if this is a monorepo) for full parity. */
function validateAdmissionPayload(payload: any): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!payload?.program?.academicYear) errors["program.academicYear"] = "Academic year is required.";
  if (!payload?.program?.track) errors["program.track"] = "Program track is required.";
  if (!payload?.student?.firstName) errors["student.firstName"] = "First name is required.";
  if (!payload?.student?.lastName) errors["student.lastName"] = "Last name is required.";
  if (!payload?.guardian1?.email) errors["guardian1.email"] = "Guardian email is required.";

  if (payload?.program?.track === "montessori") {
    if (!payload?.montessori?.attendedBefore) errors["montessori.attendedBefore"] = "Required for Montessori applicants.";
  }

  if (!payload?.consent?.tuitionAgreement) errors["consent.tuitionAgreement"] = "Tuition agreement must be accepted.";

  return errors;
}

