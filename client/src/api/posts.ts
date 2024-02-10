"use server";
import { Comment, Like, Post } from "@/lib/types";
import { getAuth } from "./auth";
import { redirect } from "next/navigation";
import { debounce } from "./debounce";

export async function getPosts() {
  const { token } = await getAuth();

  const response = await fetch(`${process.env.POSTS_URL}/posts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = (await response.json()) as Post[];

  return data;
}

export async function postComment(formData: FormData) {
  const { token } = await getAuth();

  const postId = formData.get("postId") as string;
  const content = formData.get("content") as string;
  const username = formData.get("username") as string;

  console.log("INFO", postId, content, username);

  const response = await fetch(`${process.env.POSTS_URL}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ postId, content, username }),
  });

  if (response.status !== 200) {
    redirect("/auth/login");
  }

  const post = (await response.json()) as Post;

  redirect(`/#${post.ID}`);
}

type LikeAction = {
  postId: string;
  username: string;
  action: "like" | "unlike";
};

let lastLikeAction: LikeAction | null = null;
let debouncedLikePost: Function | null = null;

export async function likePost(formData: FormData) {
  const postId = formData.get("postId") as string;
  const username = formData.get("username") as string;
  const action = formData.get("action") as string;

  if (action !== "like" && action !== "unlike") {
    console.log("Invalid action", action);
    return;
  }

  if (!postId || !username) {
    console.log("postId or username is null");
    return;
  }

  lastLikeAction = { postId, username, action };

  if (!debouncedLikePost) {
    debouncedLikePost = debounce(sendLikePost, 1000, false);
  }

  debouncedLikePost();
}

async function sendLikePost() {
  if (!lastLikeAction) {
    console.log("lastLikeAction is null");
    return;
  }

  const { token } = await getAuth();

  const response = await fetch(`${process.env.POSTS_URL}/likes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(lastLikeAction),
  });

  if (response.status !== 200) {
    redirect("/auth/login");
  } else {
    const postId = lastLikeAction.postId;
    console.log("postId", postId);
    lastLikeAction = null;
    redirect(`/#${postId}`);
  }
}

export async function getLikes(username: string) {
  const { token } = await getAuth();

  const response = await fetch(`${process.env.POSTS_URL}/likes/${username}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const likes = (await response.json()) as Like[];

  return likes;
}

export async function getComments(username: string) {
  const { token } = await getAuth();

  const response = await fetch(
    `${process.env.POSTS_URL}/comments/${username}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const comments = (await response.json()) as Comment[];

  return comments;
}

export async function getRecentActivity(username: string) {
  const { token } = await getAuth();

  const response = await fetch(
    `${process.env.POSTS_URL}/activity/${username}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(response.status);

  const activity = (await response.json()) as (Comment | Like)[];

  console.log("activity", activity);

  return activity;
}
