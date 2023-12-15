"use client";
import { User } from "@/lib/types";
import Link from "next/link";
import { BiPlusCircle } from "react-icons/bi";

type NewChatProps = {
  user: User;
  otherUser: User;
};

export function NewChat({ user, otherUser }: NewChatProps) {
  return (
    <Link
      href={`/dm/${user.username}--${otherUser.username}`}
      className="text-2xl p-2 hover:scale-110 transition-all duration-300"
    >
      <BiPlusCircle />
    </Link>
  );
}
