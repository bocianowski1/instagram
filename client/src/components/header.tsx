"use server";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiMessageCircle, FiPlusSquare } from "react-icons/fi";
import { UserPreview } from "./user-preview";
import { getUsers } from "@/api/users";
import { User } from "@/lib/types";
import Notifications from "./notifications";
import { getAuth } from "@/api/auth";

const links = [
  {
    href: "/new",
    label: "New",
    icon: <FiPlusSquare />,
  },
  {
    href: "/likes",
    label: "Likes",
    icon: (
      <div className="relative">
        <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
        <FiHeart />
      </div>
    ),
  },
  {
    href: "/dm",
    label: "DMs",
    icon: <FiMessageCircle />,
  },
];

export async function Header() {
  const { user } = await getAuth();
  const users = (await getUsers()) as User[];

  return (
    <header className="bg-white h-[12rem] sticky top-0 left-0 right-0 z-20 border-b border-neutral-200">
      <Notifications />
      <ul className="flex justify-between items-center px-4 pt-3">
        <h1 className="h-[75px] flex items-center overflow-hidden">
          <Image
            src="/instagram-logo.png"
            alt="instagram"
            width={250}
            height={150}
            className="object-contain h-full w-full"
          />
        </h1>
        <nav className="flex items-center gap-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className="flex flex-col items-center p-1 text-2xl hover:scale-110 transition-all duration-300">
                {link.icon}
                <span hidden>{link.label}</span>
              </span>
            </Link>
          ))}
        </nav>
      </ul>

      {/* Stories */}
      <section className="w-full overflow-x-scroll pb-4">
        <ul className="flex justify-between gap-2 w-fit px-4">
          <li className="relative flex flex-col gap-1 items-center">
            <div className="border-r border-neutral-200 pr-2">
              <UserPreview user={user} hasStory />
            </div>
            <span className="text-sm">{user.username}</span>
          </li>
          {users &&
            users.map((u) => {
              if (u.username === user.username) return null;
              return (
                <li
                  key={u.ID}
                  className="relative flex flex-col gap-1 items-center"
                >
                  <UserPreview user={u} hasStory />
                  <span className="text-sm">{u.username}</span>
                </li>
              );
            })}
        </ul>
      </section>
    </header>
  );
}
