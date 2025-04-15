/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const FIVE_DAYS = 60 * 60 * 24 * 5;

export async function signUp(params: SignUpParams) {
  const { uid, name, email, password } = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in instead.",
      };
    }

    await db.collection("users").doc(uid).set({
      name,
      email,
      password,
    });

    return {
      success: true,
      message: 'Account created successfully, PLease sign in',
    }
  } catch (error: any) {
    console.error("Error creating a user", error);

    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        error: "Email already exists",
      };
    }

    return {
      success: false,
      message: "An error occurred while creating the user",
      error: error.message,
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: "User not found. Please sign up.",
      };
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Logged in successfully",
    };
  } catch (error: any) {
    console.error("Error logining a user", error);

    return {
      success: false,
      message: "An error occurred while logging in",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: FIVE_DAYS * 1000,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: FIVE_DAYS,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()

  const sessionCookie = cookieStore.get("session")?.value

  if(!sessionCookie) return null

  try {
    const decodeClaims = await auth.verifySessionCookie(sessionCookie, true)

    const userRecord = await db.collection("users").doc(decodeClaims.uid).get()

    if(!userRecord.exists) return null

    return {
      ...userRecord.data(),
      id: userRecord.id,
      email: userRecord.data()?.email,
      name: userRecord.data()?.name,
    }

  } catch (error) {
    console.log(error)

    return null
  }

}

export async function isAuthenticated() {
  const user = await getCurrentUser()

  return !!user
}