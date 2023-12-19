"use server";
import { getAuth } from "@/api/auth";
import { Chat } from "@/components/chat";
import { notFound } from "next/navigation";

type Props = {
  params: {
    usernames: string;
  };
};

export default async function DM({ params: { usernames } }: Props) {
  const { user } = await getAuth();
  const usernamesList = usernames.split("--").sort();

  if (usernamesList.length !== 2) {
    console.log("Invalid usernames:", usernamesList);
    notFound();
  }

  const thisUser =
    user.username === usernamesList[0] ? usernamesList[0] : usernamesList[1];
  const otherUser =
    user.username === usernamesList[0] ? usernamesList[1] : usernamesList[0];

  return (
    <main className="flex flex-col justify-between h-screen">
      <Chat
        {...{
          thisUser,
          otherUser,
        }}
      />
    </main>
  );
}
