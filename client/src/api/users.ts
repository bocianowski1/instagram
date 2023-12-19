"use server";
import { getAuth } from "./auth";
import { User } from "@/lib/types";
import { redirect } from "next/navigation";

export async function getUsers() {
  const { token } = await getAuth();

  const response = await fetch(`${process.env.AUTH_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    console.log(response.statusText);
    console.log(response.status);
    return redirect("/auth/login");
  }

  const users = (await response.json()) as User[];

  return users;
}

export async function getUserByUsername(username: string) {
  const { token } = await getAuth();
  const response = await fetch(`${process.env.AUTH_URL}/users/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(response.status);

  if (response.status !== 200) {
    console.log(response.statusText);
    console.log(response.status);
    throw new Error(response.statusText);
  }

  const user = (await response.json()) as User;

  return user;
}

export async function followUser(formData: FormData) {
  const { token } = await getAuth();
  const username = formData.get("username");
  const followingUsername = formData.get("profileUsername");

  const response = await fetch(
    `${process.env.AUTH_URL}/follow?username=${username}&followingUsername=${followingUsername}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status !== 200) {
    console.log(response.statusText);
    console.log(response.status);
    throw new Error(response.statusText);
  }
}

export async function unfollowUser(formData: FormData) {
  const { token } = await getAuth();
  const username = formData.get("username");
  const followingUsername = formData.get("profileUsername");

  const response = await fetch(
    `${process.env.AUTH_URL}/follow?username=${username}&followingUsername=${followingUsername}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.status !== 200) {
    console.log(response.statusText);
    console.log(response.status);
    throw new Error(response.statusText);
  }
}
