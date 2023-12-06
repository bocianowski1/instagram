import { IoChevronBack } from "react-icons/io5";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { loadImages } from "@/api/images";
import { CloudImage } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { getAuth, logout } from "@/api/auth";

export default async function ProfilePage() {
  const token = await getAuth();
  const images = await loadImages();

  return (
    <main className="flex flex-col w-screen">
      <div className="px-4">
        <section className="flex justify-between text-lg py-4">
          <Link href={"/"} className="text-2xl">
            <IoChevronBack />
          </Link>
          <h1 className="font-semibold">faze_torger</h1>
          <form className="text-2xl" action={logout}>
            <button className="font-semibold" type="submit">
              <HiOutlineDotsHorizontal />
            </button>
          </form>
        </section>

        <section className="flex items-center gap-12">
          <div className="p-[4px] bg-gradient-to-bl from-rose-600 to-orange-400 h-fit w-fit rounded-full">
            <div className="p-[3px] bg-white h-fit w-fit rounded-full">
              <div className="h-32 w-32 flex items-center justify-center rounded-full bg-gray-300">
                <Image
                  src={images[1].url ?? ""}
                  alt="torger"
                  height={100}
                  width={100}
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <ul className="flex gap-10 text-lg">
            <li className="flex flex-col items-center">
              <span className="font-semibold translate-y-2">
                {images.length}
              </span>{" "}
              Posts
            </li>
            <li className="flex flex-col items-center">
              <span className="font-semibold translate-y-2">5432</span>{" "}
              Followers
            </li>
            <li className="flex flex-col items-center">
              <span className="font-semibold translate-y-2">123</span> Following
            </li>
          </ul>
        </section>

        <section className="flex flex-col py-4 text-sm">
          <h2 className="font-semibold text-base">Torger</h2>
          <span className="text-gray-400 font-light">Entrepreneur</span>
          <div className="flex flex-col gap-2">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet
              obcaecati dignissimos, distinctio iusto provident neque rerum
              porro aliquid possimus quos, tenetur quidem? Vero reprehenderit
              eligendi asperiores, itaque laborum nisi fugit.
            </p>
            <p>
              Followed by
              <span className="font-semibold"> optic_paal2</span> and{" "}
              <span className="font-semibold">300 others</span>
            </p>
          </div>
        </section>
      </div>

      <section className="grid grid-cols-3 w-screen">
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
      </section>
    </main>
  );
}
