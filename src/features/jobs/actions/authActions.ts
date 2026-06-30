"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function registerUserAction(
  email: unknown,
  password: unknown,
  name: unknown
): Promise<{ success: boolean; error?: string }> {
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    (name !== undefined && typeof name !== "string")
  ) {
    return { success: false, error: "Invalid input types." };
  }

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();
  const trimmedName = typeof name === "string" ? name.trim() : "";

  if (trimmedEmail === "" || trimmedPassword === "") {
    return { success: false, error: "Email and password are required." };
  }

  if (trimmedPassword.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    await prisma.user.create({
      data: {
        email: trimmedEmail,
        password: hashedPassword,
        name: trimmedName || null,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Registration error:", err);
    return {
      success: false,
      error: "An unexpected error occurred during registration.",
    };
  }
}
