"use server";

import { createAuthSession, removeSession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user";
import { redirect } from "next/navigation";

export const signUp = async (_, formData) => {
  const email = formData.get("email");
  const password = formData.get("password");

  let errors = {};

  if (!email.includes("@")) {
    errors.email = "please enter a valid email.";
  }

  if (password.trim().length < 8) {
    errors.password = "Password should be at least 8 character long.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  try {
    const id = createUser(email, hashUserPassword(password));
    await createAuthSession(id);
    redirect("/training");
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINTS_UNIQUE")
      return {
        errors: {
          email: "Duplicate email, email already exist in the system.",
        },
      };
    throw error;
  }
};

export const login = async (_, formDate) => {
  const email = formDate.get("email");
  const password = formDate.get("password");

  const result = getUserByEmail(email);
  if (!result) {
    return {
      errors: {
        email: "User doesn't exist in our system.",
      },
    };
  }

  if (!verifyPassword(result.password, password)) {
    return {
      errors: {
        password: "Invalid password",
      },
    };
  }
  await createAuthSession(result.id);
  redirect("/training");
};

export const logout = () => {
  removeSession();
  redirect("/");
};
