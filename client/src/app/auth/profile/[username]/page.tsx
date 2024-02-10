import { getAuth, logout } from "@/api/auth";
import { followUser, getUserByUsername, unfollowUser } from "@/api/users";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CiLogout } from "react-icons/ci";
import { IoChevronBack } from "react-icons/io5";

type Props = {
  params: {
    username: string;
  };
};

export default async function ProfilePage({ params: { username } }: Props) {
  const { user } = await getAuth();
  const profileUser = await getUserByUsername(username);

  if (!profileUser) {
    notFound();
  }

  const isFollowing = profileUser.Followers?.some(
    (follower) => follower.ID === user.ID
  );

  return (
    <main className="relative flex flex-col w-full">
      <div className="px-4">
        <section className="flex justify-between text-lg py-4">
          <Link href="/" className="text-2xl w-8">
            <IoChevronBack />
          </Link>
          <h1 className="font-semibold">{profileUser.username}</h1>
          {user.ID === profileUser.ID ? (
            <form className="sm:text-lg lg:text-2xl" action={logout}>
              <button className="text-black" type="submit">
                <CiLogout />
              </button>
            </form>
          ) : (
            <div className="w-8" />
          )}
        </section>

        <section className="flex items-center gap-8">
          <div className="p-[4px] bg-gradient-to-bl from-rose-600 to-orange-400 h-fit w-fit rounded-full">
            <div className="p-[3px] bg-white h-fit w-fit rounded-full">
              <div className="h-32 w-32 flex items-center justify-center rounded-full bg-gray-300">
                <span className="font-semibold capitalize text-6xl">
                  {profileUser.username[0]}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-3/5">
            <ul className="flex justify-between text-lg px-2">
              <li className="flex flex-col items-center">
                <span className="font-semibold translate-y-2">0</span>
                Posts
              </li>
              <li className="flex flex-col items-center">
                <span className="font-semibold translate-y-2">
                  {profileUser.Followers?.length}
                </span>
                Followers
              </li>
              <li className="flex flex-col items-center">
                <span className="font-semibold translate-y-2">
                  {profileUser.Following?.length}
                </span>
                Following
              </li>
            </ul>
            {profileUser.ID !== user.ID && (
              <>
                {isFollowing ? (
                  <form action={unfollowUser}>
                    <input
                      type="hidden"
                      name="profileUsername"
                      value={profileUser.username}
                    />
                    <input
                      type="hidden"
                      name="username"
                      value={user.username}
                    />
                    <button
                      type="submit"
                      className="font-semibold text-white rounded-md w-full flex items-center justify-center py-3 bg-blue-400 hover:bg-blue-500 transition-colors duration-300"
                    >
                      Unfollow
                    </button>
                  </form>
                ) : (
                  <form action={followUser} method="POST">
                    <input
                      type="hidden"
                      name="profileUsername"
                      value={profileUser.username}
                    />
                    <input
                      type="hidden"
                      name="username"
                      value={user.username}
                    />
                    <button className="font-semibold text-white rounded-md w-full flex items-center justify-center py-3 bg-blue-400 hover:bg-blue-500 transition-colors duration-300">
                      Follow
                    </button>
                  </form>
                )}
              </>
            )}
            {profileUser.ID === user.ID && (
              <button className="font-semibold text-white rounded-md w-full flex items-center justify-center py-3 bg-blue-400 hover:bg-blue-500 transition-colors duration-300">
                Edit Profile
              </button>
            )}
          </div>
        </section>

        <section className="flex flex-col py-4 text-sm">
          <h2 className="font-semibold text-base">{profileUser.name}</h2>
          <span className="text-gray-400 font-light">Entrepreneur</span>
          <div className="flex flex-col gap-2">
            <p className="max-w-full">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet
              obcaecati dignissimos, distinctio iusto provident neque rerum
              porro aliquid possimus quos, tenetur quidem? Vero reprehenderit
              eligendi asperiores, itaque laborum nisi fugit.
            </p>
            {profileUser.Followers && profileUser.Followers.length > 0 && (
              <p>
                Followed by{" "}
                <span className="font-semibold">
                  {profileUser.Followers[0].username}
                </span>{" "}
                {profileUser.Followers?.length > 2 ? (
                  <>
                    <span>and </span>
                    <span className="font-semibold">
                      {profileUser.Followers?.length - 1} others
                    </span>
                  </>
                ) : (
                  <>
                    {profileUser.Followers?.map((follower, index) => {
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
