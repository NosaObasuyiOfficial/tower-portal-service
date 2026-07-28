import axios from "axios";
import dotenv from 'dotenv'

dotenv.config();

const { PAYSTACK_SECRET_KEY, PAYSTACK_API } = process.env

const paystack = axios.create({
  baseURL: PAYSTACK_API!,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

export default paystack;