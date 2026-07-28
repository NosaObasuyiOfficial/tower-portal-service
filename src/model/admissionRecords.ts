import { DataTypes, Model, Optional } from "sequelize";
import { towerDatabase } from "../database/databaseConnection";

/* ---------------------------------------------------------------------------
   Nested JSON shapes (stored as JSONB columns rather than flattened —
   they're either free-form or only ever read/written as a whole object).
--------------------------------------------------------------------------- */
export type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
};

export type UploadedFile = {
  name: string;
  url: string; // wherever the file actually lives (S3 / disk / CDN) — never store raw file bytes in Postgres
  size: number;
  mimeType: string;
};

export type Uploads = {
  birthCertificate: UploadedFile | null;
  passport: UploadedFile | null;
  immunization: UploadedFile | null;
  academicRecords: UploadedFile | null;
};

/* ---------------------------------------------------------------------------
   Full row shape
--------------------------------------------------------------------------- */
export type ADMISSION = {
  id: string;

  // Program
  academicYear: string;
  admissionType: "new" | "returning";
  track: "montessori" | "primary";
  grade: string;

  // Student
  studentFirstName: string;
  studentMiddleName: string | null;
  studentLastName: string;
  studentDob: string; // ISO date, e.g. "2019-04-02"
  gender: "male" | "female";
  address: Address;
  previousSchool: string | null;

  // Guardian 1 — always required
  guardian1Relation: string;
  guardian1Name: string;
  guardian1Phone: string;
  guardian1Email: string;
  guardian1Occupation: string;

  // Guardian 2 — optional ("None" on the form maps to all-null here)
  guardian2Relation: string | null;
  guardian2Name: string | null;
  guardian2Phone: string | null;
  guardian2Email: string | null;
  guardian2Occupation: string | null;

  // Medical
  emergencyRelation: string;
  emergencyPhone: string;
  allergies: string | null;
  medicalConditions: string | null;

  // Montessori — ONLY populated when track === "montessori", null for Primary
  montessoriAttendedBefore: "yes" | "no" | null;
  montessoriInterest: string | null;
  montessoriStrengths: string | null;

  // Uploads
  uploads: Uploads;

  // Consent & signature
  tuitionAgreement: boolean;
  mediaRelease: "grant" | "deny";
  signatureMode: "draw" | "type";
  signatureTypedName: string | null;
  signatureImageUrl: string | null; // uploaded PNG from the canvas, NOT the raw base64 — see controller notes
  signatureDate: string; // ISO date

  status: "submitted" | "under_review" | "accepted" | "waitlisted" | "rejected";
};

/* Fields the app doesn't have to supply at create-time (nullable / defaulted) */
type AdmissionCreationAttrs = Optional<
  ADMISSION,
  | "studentMiddleName"
  | "previousSchool"
  | "guardian2Relation"
  | "guardian2Name"
  | "guardian2Phone"
  | "guardian2Email"
  | "guardian2Occupation"
  | "allergies"
  | "medicalConditions"
  | "montessoriAttendedBefore"
  | "montessoriInterest"
  | "montessoriStrengths"
  | "signatureTypedName"
  | "signatureImageUrl"
  | "status"
>;

class Admission extends Model<ADMISSION, AdmissionCreationAttrs> {}

Admission.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },

    // Program
    academicYear: { type: DataTypes.STRING, allowNull: false },
    admissionType: { type: DataTypes.ENUM("new", "returning"), allowNull: false },
    track: { type: DataTypes.ENUM("montessori", "primary"), allowNull: false },
    grade: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Student
    studentFirstName: { type: DataTypes.STRING, allowNull: false },
    studentMiddleName: { type: DataTypes.STRING, allowNull: true },
    studentLastName: { type: DataTypes.STRING, allowNull: false },
    studentDob: { type: DataTypes.DATEONLY, allowNull: false },
    gender: { type: DataTypes.ENUM("male", "female"), allowNull: false },
    address: { type: DataTypes.JSONB, allowNull: false },
    previousSchool: { type: DataTypes.STRING, allowNull: true },

    // Guardian 1
    guardian1Relation: { type: DataTypes.STRING, allowNull: false },
    guardian1Name: { type: DataTypes.STRING, allowNull: false },
    guardian1Phone: { type: DataTypes.STRING, allowNull: false },
    guardian1Email: { type: DataTypes.STRING, allowNull: false },
    guardian1Occupation: { type: DataTypes.STRING, allowNull: false },

    // Guardian 2
    guardian2Relation: { type: DataTypes.STRING, allowNull: true },
    guardian2Name: { type: DataTypes.STRING, allowNull: true },
    guardian2Phone: { type: DataTypes.STRING, allowNull: true },
    guardian2Email: { type: DataTypes.STRING, allowNull: true },
    guardian2Occupation: { type: DataTypes.STRING, allowNull: true },

    // Medical
    emergencyRelation: { type: DataTypes.STRING, allowNull: false },
    emergencyPhone: { type: DataTypes.STRING, allowNull: false },
    allergies: { type: DataTypes.TEXT, allowNull: true },
    medicalConditions: { type: DataTypes.TEXT, allowNull: true },

    // Montessori (nullable — only set when track = "montessori")
    montessoriAttendedBefore: { type: DataTypes.ENUM("yes", "no"), allowNull: true },
    montessoriInterest: { type: DataTypes.TEXT, allowNull: true },
    montessoriStrengths: { type: DataTypes.TEXT, allowNull: true },

    // Uploads
    uploads: { type: DataTypes.JSONB, allowNull: true, defaultValue: {} },

    // Consent & signature
    tuitionAgreement: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    mediaRelease: { type: DataTypes.ENUM("grant", "deny"), allowNull: false },
    signatureMode: { type: DataTypes.ENUM("draw", "type"), allowNull: false },
    signatureTypedName: { type: DataTypes.STRING, allowNull: true },
    signatureImageUrl: { type: DataTypes.STRING, allowNull: true },
    signatureDate: { type: DataTypes.DATEONLY, allowNull: false },

    status: {
      type: DataTypes.ENUM("submitted", "under_review", "accepted", "waitlisted", "rejected"),
      allowNull: false,
      defaultValue: "submitted",
    },
  },
  {
    sequelize: towerDatabase,
    tableName: "Admissions",
    modelName: "Admission",
    timestamps: true,
    indexes: [
      { fields: ["track"] },
      { fields: ["status"] },
      { fields: ["academicYear"] },
      { fields: ["guardian1Email"] },
    ],
  },
);

export default Admission;