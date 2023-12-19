"use client";

import { useWebSocket } from "@/hooks/socket-context";
import { UserPreview } from "./user-preview";
import Link from "next/link";
import { Message, User } from "@/lib/types";
import { PiCamera } from "react-icons/pi";

export function Conversations({ user }: { user: User }) {
  const { messages } = useWebSocket();

  let conversations: { [key: string]: Message[] } = {};
  messages.forEach((message) => {
    if (!message.sender || !message.receiver) return;
    if (message.sender === user.username) {
      if (conversations[message.receiver]) {
        conversations[message.receiver].push(message);
      } else {
        conversations[message.receiver] = [message];
      }
    } else {
      if (conversations[message.sender]) {
        conversations[message.sender].push(message);
      } else {
        conversations[message.sender] = [message];
      }
    }
  });

  return (
    <ul className="flex flex-col gap-2">
      {conversations ? (
        Object.keys(conversations).map((key) => (
          <li
            key={key}
            className="hover:bg-neutral-100 transition-colors duration-300 ease-in-out"
          >
            {user && (
              <MessagePreview
                user={user}
                message={conversations[key][conversations[key].length - 1]}
              />
            )}
          </li>
        ))
      ) : (
        <p className="text-center text-gray-500">No conversations</p>
      )}
    </ul>
  );
}

function MessagePreview({ user, message }: { user: User; message: Message }) {
  return (
    <Link href={`dm/${message.sender}--${message.receiver}`}>
      <div className="flex items-center gap-4">
        <UserPreview user={user} hasStory hideUrl />
        <div className="flex flex-col flex-1">
          <h3 className="font-semibold">
            {user.username === message.sender
              ? message.receiver
              : message.sender}
          </h3>
          <p className="text-sm truncate">{message.content}</p>
        </div>
        <button className="text-xl px-4">
          <PiCamera />
        </button>
      </div>
    </Link>
  );
}
