"use server";
import { User } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getAuth() {
  const tokenObj = cookies().get("token");

  if (!tokenObj || !tokenObj.value) {
    redirect("/auth/login");
  }
  const token = tokenObj.value;

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

  if (response.status !== 200) {
    console.log(response.statusText);
    console.log(response.status);
    throw new Error(response.statusText);
  }

  const { token, user } = await response.json();

  cookies().set("token", token);
  cookies().set("user", JSON.stringify(user));

  redirect("/");
}

export async function register(formData: FormData) {
  const username = formData.get("username");
  const name = formData.get("name");
  const password = formData.get("password");
  const repeatPassword = formData.get("repeatPassword");

  if (!username || !name || !password || !repeatPassword) {
    throw new Error("Missing username, name or password");
  }

  if (password !== repeatPassword) {
    throw new Error("Passwords do not match");
  }

  const response = await fetch(`http://localhost:8080/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, name, password }),
  });

  console.log(response.status);

  if (response.status !== 200) {
    console.log(response.statusText);
    console.log(response.status);
    throw new Error(response.statusText);
  }

  const { token, user } = await response.json();

  cookies().set("token", token);
  cookies().set("user", JSON.stringify(user));

  redirect("/");
}

export async function logout() {
  cookies().delete("token");
  cookies().delete("user");
  redirect("/auth/login");
}
