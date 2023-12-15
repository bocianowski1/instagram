"use server";
import { getAuth } from "@/api/auth";
import { ProfilePageClient } from "@/components/profile/profile-page";

export default async function ProfilePage() {
  const { user } = await getAuth();

  return (
    <main className="relative flex flex-col w-full">
      <ProfilePageClient user={user} />
    </main>
  );
}
