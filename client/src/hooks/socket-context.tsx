"use client";
import { getAuth } from "@/api/auth";
import { getMessages } from "@/api/dm";
import { Message, User } from "@/lib/types";
import React, { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext({
  messages: [] as Message[],
  socket: null as WebSocket | null,
  sendMessage: (message: Message) => {},
  hasNewMessages: false,
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [hasNewMessages, setHasNewMessages] = useState(false);

  useEffect(() => {
    console.log("Creating new WebSocket");

    // fetch messages from server
    const fetchMessages = async () => {
      const { user } = await getAuth();
      const prevMessages = await getMessages({
        user1: user.username || "",
        user2: "",
      });
      setMessages(prevMessages);
    };

    void fetchMessages();

    const newSocket = new WebSocket(
      process.env.WS_URL || "ws://localhost:9999/ws"
    );

    newSocket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    newSocket.onmessage = (event) => {
      const msg = event.data;
      if (typeof msg !== "string") return;

      console.log("Received message:", msg);

      let jsonMsg: Message;
      try {
        jsonMsg = JSON.parse(msg);
      } catch (e) {
        return;
      }

      setMessages((messages) => [...messages, jsonMsg]);
      setHasNewMessages(true);

      setTimeout(() => {
        setHasNewMessages(false);
      }, 2000);
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  function sendMessage(message: Message) {
    if (!message.sender || !message.receiver || !message.content) return;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    }
  }

  return (
    <WebSocketContext.Provider
      value={{ messages, socket, sendMessage, hasNewMessages }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
