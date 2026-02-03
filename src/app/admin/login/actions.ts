// src/app/admin/login/actions.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData) {
  const password = formData.get("password") as string;
  
  // Legge la password vera dal file .env
  const CORRECT_PASSWORD = process.env.ADMIN_PASSWORD;

  if (password === CORRECT_PASSWORD) {
    // Password corretta!
    // Imposta un cookie che dura 24 ore
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true, // Non accessibile da JS (sicurezza)
      secure: process.env.NODE_ENV === "production", // Solo HTTPS in produzione
      maxAge: 60 * 60 * 24, // 24 ore
      path: "/",
    });

    redirect("/admin");
  } else {
    return { success: false, message: "Password errata." };
  }
}