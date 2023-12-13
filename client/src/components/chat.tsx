"use client";
import { User } from "@/lib/types";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { PiPaperPlaneRight } from "react-icons/pi";

export default function Chat({
  user,
  prevMessages,
}: {
  user: User;
  prevMessages: any;
}) {
  const path = usePathname();
  const usernames = path.split("/")[2];
  const usernamesList = usernames.split("--").sort();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  if (!user) {
    redirect("/auth/login");
  }

  if (usernamesList.length !== 2) {
    redirect("/dm");
  }

  if (
    usernamesList[0] !== user.username &&
    usernamesList[1] !== user.username
  ) {
    redirect("/dm");
  }

  const thisUser =
    user.username === usernamesList[0] ? usernamesList[0] : usernamesList[1];
  const otherUser =
    user.username === usernamesList[0] ? usernamesList[1] : usernamesList[0];

  // prevMessages is an array of type message, but we need to convert it to an array of strings in the format of "sender--content--receiver"
  // so that we can display it in the chat
  let prevMessagesString: string[] = [];
  prevMessages.forEach((message: any) => {
    prevMessagesString.push(
      `${message.sender}--${message.content}--${message.receiver}`
    );
  });

  const [messages, setMessages] = useState<string[]>(prevMessagesString);
  const [messageInput, setMessageInput] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    const newSocket = new WebSocket("ws://localhost:9999/ws");

    newSocket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    newSocket.onmessage = (event) => {
      const msg = event.data;
      console.log("Received message:", msg);
      if (typeof msg !== "string") {
        console.log("Message is not a string", msg);
        return;
      }
      setMessages((messages) => [...messages, msg]);

      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [messages, setMessages]);

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      if (!messageInput) return;

      const message = `${thisUser}--${messageInput}--${otherUser}`;
      socket.send(message);
      setMessages((messages) => [...messages, message]);
      setMessageInput("");

      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <>
      <section className="flex justify-between text-lg p-4 border-b border-b-neutral-200">
        <Link href="/dm" className="text-2xl">
          <IoChevronBack />
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="font-semibold">{otherUser}</h1>
          <span className="text-xs text-gray-500">You are {thisUser}</span>
        </div>
        <div />
      </section>
      <section className="h-[calc(100%-16rem)] flex flex-col justify-end pb-2 px-6">
        <div
          className="flex flex-col justfiy-end gap-1 overflow-y-scroll h-fit"
          ref={containerRef}
        >
          {messages.map((message, idx) => {
            if (typeof message === "string") {
              const isThisUser = message.split("--")[0] === thisUser;
              const content = message.split("--")[1];

              let isLastMessageThisUser = false;
              if (idx === messages.length - 1) {
                isLastMessageThisUser = true;
              } else if (messages[idx].split("--")[0] !== thisUser) {
                isLastMessageThisUser = true;
              }

              let isLastMessageOtherUser = false;
              if (idx === messages.length - 1) {
                isLastMessageOtherUser = true;
              } else if (messages[idx].split("--")[0] === thisUser) {
                isLastMessageOtherUser = true;
              }

              return (
                <div key={idx} className="flex flex-col">
                  <div className={`${isThisUser ? "ml-auto" : ""}`}>
                    <p
                      className={`${
                        isThisUser
                          ? `bg-blue-400 text-white ${
                              isLastMessageThisUser ? "rounded-br-none" : ""
                            }`
                          : `bg-neutral-200 text-black ${
                              isLastMessageOtherUser ? "rounded-bl-none" : ""
                            }`
                      } relative w-fit max-w-[50vw] py-3 px-4 rounded-2xl`}
                    >
                      {content}
                    </p>
                    {isLastMessageOtherUser && !isThisUser && (
                      <span className="text-gray-500 text-sm">{otherUser}</span>
                    )}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </section>

      <section className="w-full flex flex-col p-1">
        <div className="flex justify-end p-2 border-y border-y-neutral-200">
          <button className="-rotate-45 text-xl" onClick={sendMessage}>
            <PiPaperPlaneRight />
          </button>
        </div>
        <textarea
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          rows={5}
          className="w-full p-2 rounded-lg bg-neutral-100"
          autoFocus
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && messageInput) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
      </section>
    </>
  );
}
