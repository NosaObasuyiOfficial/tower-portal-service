import { createHash, randomInt } from "crypto";

const SCHOOL_CODE = "TPA"; // Tower Preparatory Academy
const STUDENT_ID_CODE_LENGTH = 5; // "TPA-26-4K9XQ" — 13 characters total

// No 0/O, 1/I/l, etc. — avoids characters that look alike when handwritten,
// printed on an admission slip, or read aloud over the phone.
const UNAMBIGUOUS_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";


export function generateStudentId(applicationId: string, attempt = 0): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const hash = createHash("sha256").update(`${applicationId}:${attempt}`).digest();

  let code = "";
  for (let i = 0; i < STUDENT_ID_CODE_LENGTH; i++) {
    code += UNAMBIGUOUS_ALPHABET[hash[i] % UNAMBIGUOUS_ALPHABET.length];
  }

  return `${SCHOOL_CODE}-${year}-${code}`;
}


export async function ensureUniqueStudentId(
  applicationId: string,
  checkExists: (studentId: string) => Promise<boolean>,
  maxAttempts = 10
): Promise<string> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidate = generateStudentId(applicationId, attempt);
    if (!(await checkExists(candidate))) return candidate;
  }
  throw new Error(`Could not generate a unique Student ID after ${maxAttempts} attempts.`);
}


export function generateTemporaryPassword(length = 8): string {
  let password = "";
  for (let i = 0; i < length; i++) {
    password += UNAMBIGUOUS_ALPHABET[randomInt(0, UNAMBIGUOUS_ALPHABET.length)];
  }
  return password;
}