import { getAuth } from "@/api/auth";
import { IoChevronBack } from "react-icons/io5";
import Link from "next/link";
import { getRecentActivity } from "@/api/posts";

export default async function LikesPage() {
  const { user } = await getAuth();
  const recentActivity = await getRecentActivity(user.username);

  return (
    <main className="flex flex-col w-full px-4">
      <section className="flex justify-between text-lg py-4">
        <Link href="/" className="text-2xl">
          <IoChevronBack />
        </Link>
        <span className="text-xs text-gray-500">You are {user.username}</span>
      </section>

      <section className="flex flex-col gap-3 mt-4">
        <div className="flex justify-between items-center pl-2">
          <h2 className="font-semibold">Recent activity</h2>
        </div>
        {JSON.stringify(recentActivity)}
        <div className="flex flex-col gap-2">
          {recentActivity.map((activity) => {
            return (
              <div
                key={`${activity.postId}${activity.username}${activity.CreatedAt}`}
              >
                {activity.ID}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
