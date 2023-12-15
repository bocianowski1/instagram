import { getAuth } from "./auth";
import { User } from "@/lib/types";
import { redirect } from "next/navigation";

export async function getUsers() {
  const { token } = await getAuth();

  const response = await fetch(`http://localhost:8080/users`, {
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
  const response = await fetch(`http://localhost:8080/users/${username}`, {
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

  console.log(user);

  return user;
}

export async function followUser(username: string, followingUsername: string) {
  const { token } = await getAuth();
  const response = await fetch(
    `http://localhost:8080/follow?username=${username}&followingUsername=${followingUsername}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("follow", response.status);

  if (response.status !== 200) {
    console.log(response.statusText);
    console.log(response.status);
    throw new Error(response.statusText);
  }
}

export async function unfollowUser(
  username: string,
  followingUsername: string
) {
  const { token } = await getAuth();
  const response = await fetch(
    `http://localhost:8080/follow?username=${username}&followingUsername=${followingUsername}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log("unfollow", response.status);

  if (response.status !== 200) {
    console.log(response.statusText);
    console.log(response.status);
    throw new Error(response.statusText);
  }
}
