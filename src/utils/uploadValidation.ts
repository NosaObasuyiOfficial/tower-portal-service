// import { z } from "zod";

// export const stepOneSchema = z.object({
//   engine: z.preprocess(
//     (val) => (typeof val === "string" ? val.trim() : val),
//     z.enum(["101", "102", "103", "104", "105", "106", "107", "108"], {
//       error: "Game engine must be set",
//     }),
//   ),
// });

// export const stepTwoSchema = z
//   .object({
//     minPlayers: z.coerce
//       .number({
//         error: "Min players must be a number",
//       })
//       .int("Min players must be an integer")
//       .min(1, "Min players must be at least 1"),

//     maxPlayers: z.coerce
//       .number({
//         error: "Max players must be a number",
//       })
//       .int("Max players must be an integer")
//       .min(1, "Max players must be at least 1"),

//     skillTierRange: z.preprocess((value) => {
//       if (typeof value !== "object" || value === null) return value;

//       return Object.fromEntries(
//         Object.entries(value).map(([key, val]) => [
//           key,
//           typeof val === "string" ? val.trim() : val,
//         ]),
//       );
//     }, z.object({}).passthrough()),

//     minEntryFee: z.coerce
//       .number({
//         error: "Minimum entry fee must be a number",
//       })
//       .min(0, "Minimum entry fee cannot be negative"),

//     maxEntryFee: z.coerce
//       .number({
//         error: "Maximum entry fee must be a number",
//       })
//       .min(0, "Maximum entry fee cannot be negative"),

//     matchTimeOutSeconds: z.coerce
//       .number({
//         error: "Match timeout must be a number",
//       })
//       .int("Match timeout must be an integer")
//       .min(0, "Match timeout cannot be negative"),

//     gracePeriod: z.coerce
//       .number({
//         error: "Grace period must be a number",
//       })
//       .int("Grace period must be an integer")
//       .min(0, "Grace period cannot be negative"),

//     reconnectTimeout: z.coerce
//       .number({
//         error: "Reconnect timeout must be a number",
//       })
//       .int("Reconnect timeout must be an integer")
//       .min(0, "Reconnect timeout cannot be negative"),

//     platformCommission: z.coerce
//       .number({
//         error: "platform commission must be a number",
//       })
//       .int("Grace period must be an integer")
//       .min(0, "Grace period cannot be negative"),

//     developerCommission: z.coerce
//       .number({
//         error: "developer commission must be a number",
//       })
//       .int("Grace period must be an integer")
//       .min(0, "Grace period cannot be negative"),
//   })

//   .refine((data) => data.maxPlayers >= data.minPlayers, {
//     message: "Max players must be greater than or equal to min players",
//     path: ["maxPlayers"],
//   })

//   .refine((data) => data.maxEntryFee >= data.minEntryFee, {
//     message: "Max entry fee must be greater than or equal to min entry fee",
//     path: ["maxEntryFee"],
//   });

// export const stepThreeSchema = z.object({
//   title: z
//     .string()
//     .trim()
//     .min(3, "Title must be at least 3 characters")
//     .max(255, "Title cannot exceed 255 characters"),

//   genre: z.string().default("Action"),

//   description: z
//     .string()
//     .trim()
//     .min(20, "Description must be at least 20 characters")
//     .max(5000, "Description cannot exceed 5000 characters"),

//   thumbnail: z.string().trim().min(1, "Thumbnail is required"),

//   file: z.string().trim().min(1, "Game File is required"),
// });
