"use server";
import { getAuth } from "@/api/auth";
import Chat from "@/components/chat";

export default async function DM() {
  const { user } = await getAuth();
  return (
    <main className="flex flex-col justify-between h-screen">
      <Chat user={user} />
    </main>
  );
}
