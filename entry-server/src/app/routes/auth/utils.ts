import bcrypt from "bcryptjs";

export interface ValidateUserPasswordParams {
  originalPassword: string;
  password: string;
}

export async function validateUserPassword({
  originalPassword,
  password,
}: ValidateUserPasswordParams): Promise<boolean> {
  try {
    return await bcrypt.compare(password, originalPassword);
  } catch (error) {
    console.error("Password validation error:", error);
    return false;
  }
}

export async function hashPassword(password: string): Promise<string> {
  try {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.error("Password hashing error:", error);
    throw new Error("Failed to hash password");
  }
}