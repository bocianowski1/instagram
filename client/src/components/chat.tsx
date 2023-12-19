"use client";
import { useWebSocket } from "@/hooks/socket-context";
import { Message } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { PiPaperPlaneRight } from "react-icons/pi";

type ChatProps = {
  thisUser: string;
  otherUser: string;
};

export function Chat({ thisUser, otherUser }: ChatProps) {
  // refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // indices
  const [lastIndexThisUser, setLastIndexThisUser] = useState(-1);
  const [lastIndexOtherUser, setLastIndexOtherUser] = useState(-1);

  // input & messages
  const [messageInput, setMessageInput] = useState("");
  const { messages, sendMessage } = useWebSocket();

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }

    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === thisUser) {
        setLastIndexThisUser(i);
        break;
      }
    }

    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].sender === otherUser) {
        setLastIndexOtherUser(i);
        break;
      }
    }
  }, [messages, thisUser, otherUser]);

  const send = () => {
    if (messageInput) {
      sendMessage({
        sender: thisUser,
        content: messageInput,
        receiver: otherUser,
      } as Message);

      setMessageInput("");

      if (inputRef.current) {
        inputRef.current.focus();
      }

      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
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
          <h1 className="font-semibold">
            <Link href={`/auth/profile/${otherUser}`}>{otherUser}</Link>
          </h1>
          <span className="text-xs text-gray-500">You are {thisUser}</span>
        </div>
        <div />
      </section>
      <section className="h-[calc(100%-16rem)] flex flex-col-reverse justify-end overflow-y-auto py-2 px-6">
        <div
          className="flex flex-col justfiy-end gap-1 overflow-y-scroll h-fit"
          ref={containerRef}
        >
          {messages.map((message, idx) => {
            const isThisUser = message.sender === thisUser;

            return (
              <div key={`${message.ID}`} className="flex flex-col">
                <div className={`${isThisUser ? "ml-auto" : "mr-auto"}`}>
                  <p
                    className={`${
                      isThisUser
                        ? `bg-blue-400 text-white ml-auto ${
                            lastIndexThisUser === idx ? "rounded-br-none" : ""
                          }`
                        : `bg-neutral-200 text-black mr-auto ${
                            lastIndexOtherUser === idx ? "rounded-bl-none" : ""
                          }`
                    } relative w-fit h-fit truncate max-w-[50vw] py-3 px-4 rounded-2xl`}
                  >
                    {message.content}
                  </p>
                  <div className="flex flex-col">
                    {lastIndexOtherUser === idx && !isThisUser && (
                      <Link
                        href={`/auth/profile/${otherUser}`}
                        className="text-gray-600 text-sm w-fit hover:font-semibold hover:underline transition-colors duration-300 ease-in-out"
                      >
                        {otherUser}
                      </Link>
                    )}
                    {(lastIndexOtherUser === idx ||
                      lastIndexThisUser === idx) && (
                      <span
                        className={`${
                          isThisUser ? "ml-auto" : "mr-auto"
                        } text-gray-500 text-sm`}
                      >
                        {formatDate(message.CreatedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="w-full flex flex-col p-1">
        <div className="flex justify-end p-2 border-y border-y-neutral-200">
          <button className="-rotate-45 text-xl" onClick={() => send()}>
            <PiPaperPlaneRight />
          </button>
        </div>
        <textarea
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="w-full p-2 rounded-lg bg-neutral-100 overflow-y-scroll h-32"
          autoFocus
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && messageInput) {
              e.preventDefault();
              send();
            }
          }}
        />
      </section>
    </>
  );
}
