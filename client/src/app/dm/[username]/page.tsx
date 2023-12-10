"use client";
import { getAuth } from "@/api/auth";
import { User } from "@/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { PiPaperPlaneRight } from "react-icons/pi";

export default function DM() {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getAuth().then(({ user }) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://10.111.43.167:9999/ws");

    ws.addEventListener("open", () => {
      console.log("WebSocket connection opened");
    });

    ws.addEventListener("message", (event) => {
      const message = event.data;
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    ws.addEventListener("close", () => {
      console.log("WebSocket connection closed");
    });

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(newMessage);

      // setMessages((prevMessages) => [...prevMessages, newMessage]);
      setNewMessage("");
    } else {
      console.error("WebSocket connection not open");
    }
  };
  return (
    <main className="flex flex-col justify-between h-screen">
      <section className="flex justify-between text-lg p-4 border-b border-b-neutral-200">
        <Link href={"/dm"} className="text-2xl">
          <IoChevronBack />
        </Link>
        <h1 className="font-semibold">faze_torger</h1>
        <div />
      </section>

      <section className="h-full overflow-y-scroll py-4 px-6">
        <div className="flex flex-col gap-4 min-h-fit">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`${
                idx % 2 === 0
                  ? "ml-auto bg-blue-400 text-white"
                  : "bg-neutral-200 text-black"
              } w-fit max-w-[50vw] py-3 px-4 rounded-2xl`}
            >
              <p>{message}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full flex flex-col p-1">
        <div className="flex justify-end p-2 border-y border-y-neutral-200">
          <button className="-rotate-45 text-xl" onClick={sendMessage}>
            <PiPaperPlaneRight />
          </button>
        </div>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          rows={5}
          className="w-full p-2 rounded-lg bg-neutral-100"
        />
      </section>
    </main>
  );
}
