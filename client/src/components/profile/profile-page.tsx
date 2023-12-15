"use client";
import { IoChevronBack } from "react-icons/io5";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import Link from "next/link";
import { logout } from "@/api/auth";
import { User } from "@/lib/types";
import { followUser, unfollowUser, getUserByUsername } from "@/api/users";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function ProfilePageClient({ user }: { user: User }) {
  const [profileUser, setProfileUser] = useState<User | null>(null);

  const pathname = usePathname();
  const username = pathname.split("/")[3];

  useEffect(() => {
    if (username) {
      getUserByUsername(username).then((user) => setProfileUser(user));
    }
  }, [username]);

  return (
    <main className="flex flex-col w-full">
      <div className="px-4">
        <section className="flex justify-between text-lg py-4">
          <Link href="/" className="text-2xl">
            <IoChevronBack />
          </Link>
          {profileUser ? (
            <h1 className="font-semibold">{profileUser.username}</h1>
          ) : (
            <h1 className="font-semibold">
              <div className="bg-gray-300 rounded-md animate-pulse w-20 h-6 mt-1" />
            </h1>
          )}
          <form className="sm:text-lg lg:text-2xl" action={logout}>
            <button className="font-semibold" type="submit">
              <HiOutlineDotsHorizontal />
            </button>
          </form>
        </section>

        <section className="flex items-center gap-12">
          <div className="p-[4px] bg-gradient-to-bl from-rose-600 to-orange-400 h-fit w-fit rounded-full">
            <div className="p-[3px] bg-white h-fit w-fit rounded-full">
              <div className="h-32 w-32 flex items-center justify-center rounded-full bg-gray-300">
                <span className="font-semibold capitalize text-6xl">
                  {profileUser?.username[0]}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <ul className="flex gap-10 text-lg">
              <li className="flex flex-col items-center">
                {profileUser ? (
                  <span className="font-semibold translate-y-2">0</span>
                ) : (
                  <span className="font-semibold translate-y-2">
                    <div className="bg-gray-300 rounded-md animate-pulse w-4 h-5 my-1" />
                  </span>
                )}{" "}
                Posts
              </li>
              <li className="flex flex-col items-center">
                {profileUser ? (
                  <span className="font-semibold translate-y-2">
                    {profileUser.Followers?.length}
                  </span>
                ) : (
                  <span className="font-semibold translate-y-2">
                    <div className="bg-gray-300 rounded-md animate-pulse w-4 h-5 my-1" />
                  </span>
                )}{" "}
                Followers
              </li>
              <li className="flex flex-col items-center">
                {profileUser ? (
                  <span className="font-semibold translate-y-2">
                    {profileUser.Following?.length}
                  </span>
                ) : (
                  <span className="font-semibold translate-y-2">
                    <div className="bg-gray-300 rounded-md animate-pulse w-4 h-5 my-1" />
                  </span>
                )}{" "}
                Following
              </li>
            </ul>
            {user?.ID !== profileUser?.ID && (
              <>
                {profileUser?.Followers?.find(
                  (follower) => follower.ID === user?.ID
                ) ? (
                  <button
                    onClick={async () => {
                      if (user?.username && profileUser?.username) {
                        await unfollowUser(
                          user?.username,
                          profileUser?.username
                        );
                      }
                    }}
                    className="font-semibold text-white rounded-md w-full flex items-center justify-center py-3 bg-blue-400 hover:bg-blue-500 transition-colors duration-300"
                  >
                    Following
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      if (user?.username && profileUser?.username) {
                        await followUser(user?.username, profileUser?.username);
                      }
                    }}
                    className="font-semibold text-white rounded-md w-full flex items-center justify-center py-3 bg-blue-400 hover:bg-blue-500 transition-colors duration-300"
                  >
                    Follow
                  </button>
                )}
              </>
            )}
            {user?.ID === profileUser?.ID && (
              <button className="font-semibold text-white rounded-md w-full flex items-center justify-center py-3 bg-blue-400 hover:bg-blue-500 transition-colors duration-300">
                Edit Profile
              </button>
            )}
          </div>
        </section>

        <section className="flex flex-col py-4 text-sm">
          {profileUser ? (
            <h2 className="font-semibold text-base">{profileUser.name}</h2>
          ) : (
            <h2 className="font-semibold text-base">
              <div className="bg-gray-300 rounded-md animate-pulse w-10 h-4" />
            </h2>
          )}
          <span className="text-gray-400 font-light">Entrepreneur</span>
          <div className="flex flex-col gap-2">
            <p className="max-w-full">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet
              obcaecati dignissimos, distinctio iusto provident neque rerum
              porro aliquid possimus quos, tenetur quidem? Vero reprehenderit
              eligendi asperiores, itaque laborum nisi fugit.
            </p>
            {profileUser?.Followers && profileUser?.Followers.length > 0 ? (
              <p>
                Followed by{" "}
                <span className="font-semibold">
                  {profileUser?.Followers[0].username}
                </span>{" "}
                {profileUser?.Followers?.length > 2 ? (
                  <>
                    <span>and </span>
                    <span className="font-semibold">
                      {profileUser?.Followers?.length - 1} others
                    </span>
                  </>
                ) : (
                  <>
                    {profileUser?.Followers?.map((follower, index) => {
                      if (index === 0) return null;
                      return (
                        <>
                          <span>and</span>{" "}
                          <span className="font-semibold">
                            {follower.username}
                          </span>{" "}
                        </>
                      );
                    })}
                  </>
                )}
              </p>
            ) : (
              // skeleton loading
              <p>
                <div className="bg-gray-300 rounded-md animate-pulse w-52 h-4 mt-1" />
              </p>
            )}
          </div>
        </section>
      </div>

      {/* <section className="grid grid-cols-3 w-full">
        {images.map((image: CloudImage) => (
          <div key={image.id} className="relative h-44 p-[2px] bg-white">
            {image.url.endsWith("mp4") ? (
              <video
                src={image.url}
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={image.url}
                alt=""
                height={400}
                width={400}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </section> */}
    </main>
  );
}
