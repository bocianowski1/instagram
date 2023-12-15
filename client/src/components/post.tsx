import { UserPreview } from "./user-preview";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import { PiPaperPlaneRight } from "react-icons/pi";
import { FaRegBookmark } from "react-icons/fa";
import Image from "next/image";

export function Post({ imageURL }: { imageURL: string }) {
  return (
    <div className="w-full flex flex-col h-fit pb-3">
      <section className="flex gap-3 items-center p-2">
        {/* <UserPreview
          user={null}
        /> */}
        <p className="font-semibold">faze_torger</p>
      </section>
      <section className="h-[50vh]">
        {imageURL.endsWith("mp4") ? (
          <video
            src={imageURL}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={imageURL}
            alt=""
            height={400}
            width={400}
            className="w-full h-full object-cover"
          />
        )}
      </section>
      <section className="bg-white flex justify-between p-4 text-2xl">
        <div className="flex items-center gap-4">
          <FiHeart />
          <FiMessageCircle />
          <div className="-rotate-45">
            <PiPaperPlaneRight />
          </div>
        </div>
        <FaRegBookmark />
      </section>
      <section className="flex flex-col gap-2 px-2">
        <div className="flex">
          <ul className="flex">
            <li className="">
              <div className="bg-red-200 border border-gray-400 rounded-full h-6 w-6" />
            </li>
            <li className="-translate-x-2">
              <div className="bg-blue-200 border border-gray-400 rounded-full h-6 w-6" />
            </li>
            <li className="-translate-x-4">
              <div className="bg-orange-200 border border-gray-400 rounded-full h-6 w-6" />
            </li>
          </ul>
          <p className="-translate-x-2">
            Liked by <span className="font-semibold">optic_paal2</span> and{" "}
            <span className="font-semibold">others</span>
          </p>
        </div>
        <div className="px-2 flex gap-1">
          <span className="font-semibold">faze_torger</span>
          <p>Sjekk denne!</p>
        </div>
      </section>
    </div>
  );
}
