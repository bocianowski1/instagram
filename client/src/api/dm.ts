import { Message } from "@/lib/types";

interface DMProps {
  user1: string;
  user2: string;
}

export async function getMessages({ user1, user2 }: DMProps) {
  const response = await fetch(
    `${process.env.MESSAGES_URL}/messages?user1=${user1}&user2=${user2}`
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return (await response.json()) as Message[];
}

export async function getMessagesByUser(username: string) {
  const response = await fetch(
    `${process.env.MESSAGES_URL}/messages?user1=${username}`
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}
