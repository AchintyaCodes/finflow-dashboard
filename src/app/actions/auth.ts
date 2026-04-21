"use server";

import { z } from "zod";
import { signIn, signOut, signUp } from "@/lib/auth";
import { redirect } from "next/navigation";

const LoginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const SignupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Enter a valid email." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export type AuthState = { error?: string; success?: boolean } | undefined;

export async function loginAction(state: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const result = await signIn(parsed.data.email, parsed.data.password);
  if (result.error) return { error: result.error };
  redirect("/");
}

export async function signupAction(state: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const result = await signUp(parsed.data.name, parsed.data.email, parsed.data.password);
  if (result.error) return { error: result.error };
  redirect("/");
}

export async function logoutAction() {
  await signOut();
}
