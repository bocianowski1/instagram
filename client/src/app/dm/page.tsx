"use client";
import Link from "next/link";
import { IoChevronBack } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { PiCamera } from "react-icons/pi";
import { UserPreview } from "@/components/user-preview";

export default function DMPage() {
  return (
    <main className="flex flex-col w-screen px-4">
      <section className="flex justify-between text-lg py-4">
        <Link href={"/"} className="text-2xl">
          <IoChevronBack />
        </Link>
        <h1 className="font-semibold">faze_torger</h1>
        <div />
      </section>

      <section className="relative flex items-center rounded-lg bg-neutral-100 border border-neutral-200">
        <div className="absolute left-0 top-0 bottom-0 w-[40px] rounded-l-lg flex items-center justify-center px-3 text-lg text-gray-400">
          <FiSearch />
        </div>
        <input
          type="text"
          className="w-full pl-[45px] py-2 rounded-lg bg-neutral-100"
          placeholder="Search"
        />
      </section>

      <section className="w-full overflow-x-scroll py-4">
        <ul className="flex justify-between gap-2 w-fit px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((item) => (
            <li
              key={item}
              className="relative flex flex-col gap-1 items-center"
            >
              <UserPreview profileImage={<div />} hasStory />
              <span className="text-sm">Me</span>
              <div className="absolute bottom-6 right-1 bg-white p-[2px] rounded-full">
                <div className=" bg-green-500 rounded-full h-3 w-3" />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3 mt-4">
        <h2 className="font-semibold mr-auto">Messages</h2>
        <ul className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((item) => (
            <li key={item} className="w-full">
              <MessagePreview />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function MessagePreview() {
  return (
    <Link href={`dm/${"admin"}`}>
      <div className="flex items-center gap-4">
        <UserPreview profileImage={<div />} hasStory />
        <div className="flex flex-col flex-1">
          <h3 className="font-semibold">faze_torger</h3>
          <p className="text-sm">Sjekk denne!</p>
        </div>
        <button className="text-xl px-4">
          <PiCamera />
        </button>
      </div>
    </Link>
  );
}
