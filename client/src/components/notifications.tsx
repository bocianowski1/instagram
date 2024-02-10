"use client";
import { useEffect, useState } from "react";
import { useWebSocket } from "@/hooks/socket-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PiPaperPlaneRight } from "react-icons/pi";

export default function Notifications() {
  const pathname = usePathname();
  const isDM = pathname.startsWith("/dm");

  const { messages, hasNewMessages } = useWebSocket();
  const [notification, setNotification] = useState("");

  useEffect(() => {
    let text = "New message!";
    if (messages && messages.length > 0) {
      const m = messages[messages.length - 1];
      text = `${m.sender}: ${m.content}`;
    }
    setNotification(text);
  }, [messages]);

  if (isDM) {
    return null;
  }

  return (
    <div
      className={`${
        hasNewMessages
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-20"
      } absolute top-20 right-6 z-50 flex items-center justify-between rounded-md px-3 py-2 max-w-[12rem] truncate bg-white shadow-lg border border-black/80
        transition-all duration-200 ease-in-out
        `}
    >
      <p className="overflow-hidden">{notification}</p>
      <Link
        href="/dm"
        className="bg-white pl-2 flex items-center justify-center rounded-md"
      >
        <PiPaperPlaneRight className="-rotate-45 text-lg" />
      </Link>
    </div>
  );
}
