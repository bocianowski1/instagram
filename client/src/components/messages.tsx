"use client";

import { useWebSocket } from "@/hooks/socket-context";

export function MessageList() {
  const { messages } = useWebSocket();

  return (
    <ul className="flex flex-col-reverse">
      {messages.map((message) => (
        <li key={`${message.ID}${message.sender}${message.receiver}`}>
          {message.content}
          {messages.length}
        </li>
      ))}
    </ul>
  );
}
