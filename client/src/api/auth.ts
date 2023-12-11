"use server";
import { User } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getAuth() {
  const token = cookies().get("token");
  if (!token) {
    redirect("/auth/login");
  }

  const cookieUser = cookies().get("user");
  if (!cookieUser) {
    redirect("/auth/login");
  }
  const user = JSON.parse(cookieUser.value) as User;
  return { token, user };
}

export async function login(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const response = await fetch(`http://localhost:8080/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  console.log(response.status);

  if (response.status !== 200) {
    console.log(response.statusText);
    console.log(response.status);
    console.log(username);
    console.log(password);
    throw new Error(response.statusText);
  }

  const { token, user } = await response.json();

  cookies().set("token", token);
  cookies().set("user", JSON.stringify(user));

  redirect("/");
}

export async function logout() {
  cookies().delete("token");
  redirect("/auth/login");
}
