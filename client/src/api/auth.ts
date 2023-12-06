"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getAuth() {
  const token = cookies().get("token");
  if (!token) {
    redirect("/auth/login");
  }
  return token;
}

export async function login(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const response = await fetch(`http://localhost:8080/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const { token } = await response.json();

  cookies().set("token", token);

  redirect("/");
}

export async function logout() {
  cookies().delete("token");
  redirect("/auth/login");
}
