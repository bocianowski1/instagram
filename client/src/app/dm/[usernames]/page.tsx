"use server";
import { getAuth } from "@/api/auth";
import { loadDM } from "@/api/dm";
import Chat from "@/components/chat";

export default async function DM() {
  const { user } = await getAuth();
  const messages = await loadDM({
    user1: user.username,
    user2: user.username === "admin" ? "guest" : "admin",
  });

  return (
    <main className="flex flex-col justify-between h-screen">
      <Chat user={user} prevMessages={messages} />
    </main>
  );
}
