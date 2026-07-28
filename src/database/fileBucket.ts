// import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";

// dotenv.config();

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME!,
//   api_key: process.env.CLOUD_API_KEY!,
//   api_secret: process.env.CLOUD_API_SECRET!,
// });

// export async function uploadToCloudinary({
//   uploadId,
//   file,
// }: {
//   uploadId: string;
//   file: string;
// }) {
//   try {
//     const result = await cloudinary.uploader.upload(file, {
//       public_id: uploadId,
//       resource_type: "auto",
//     });

//     return {
//       url: result.secure_url!,
//       publicId: result.public_id!,
//     };
//   } catch (error) {
//     return {
//       success: false,
//       message: "Game file upload failed",
//       response: error,
//     };
//   }
// }

// export async function readyCloudinary() {
//   try {
//     const result = await cloudinary.api.ping();

//     console.log("Cloudinary ready", result);
//   } catch (error) {
//     console.error("Cloudinary warmup failed", error);
//   }
// }