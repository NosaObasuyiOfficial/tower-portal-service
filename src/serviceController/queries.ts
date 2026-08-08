import { Request, Response } from "express";
import dotenv from "dotenv";
import paystack from "../utils/paystackService";
import RegistrationPayments from "../model/registrationTransactions";
import Admission from "../model/admissionRecords";

dotenv.config();
const { REGISTRAION_FEE }: any = process.env;

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;

    const response = await paystack.get(`/transaction/verify/${reference}`);
    const payment = response.data.data;

    if (payment.status !== "success") {
      return res.status(400).json({
        success: false,
        message: "Payment not successful.",
      });
    } else {
      if (payment.amount !== parseInt(REGISTRAION_FEE)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment amount.",
        });
      } else {
        const payentSuccess = await RegistrationPayments.update(
          {
            paymentStatus: "COMPLETED",
            paymentReference: payment.reference,
          },
          {
            where: {
              id: payment.metadata.applicationId,
            },
          },
        );

        if (payentSuccess) {
          return res.status(200).json({
            success: true,
            payment,
          });
        }
      }
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.response?.data || error.message,
    });
  }
};

export const getAdmissionRecord = async (req: Request, res: Response) => {
  const id = req.params.admissionNo || req.params.studentDataId;

  try {
    const admissionData: any = await Admission.findOne({
      where: {
        id,
      },
    });
    const { studentId, password, ...data } = admissionData.dataValues;

    if (admissionData) {
      return res.status(200).json({
        success: true,
        data,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get data",
      errorMessage: error,
    });
  }
};
