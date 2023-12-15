"use server";
import Link from "next/link";
import { IoChevronBack } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { PiCamera } from "react-icons/pi";
import { UserPreview } from "@/components/user-preview";
import { getAuth } from "@/api/auth";
import { getMessages } from "@/api/dm";
import { Message, User } from "@/lib/types";
import { NewChat } from "@/components/chat/new-chat";
import { getUsers } from "@/api/users";

export default async function DMPage() {
  const { user } = await getAuth();
  const users = (await getUsers()) as User[];

  const messages = (await getMessages({
    user1: user.username,
    user2: user.username === "admin" ? "guest" : "admin",
  })) as Message[];

  let conversations: { [key: string]: Message[] } = {};
  messages.forEach((message) => {
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
    <main className="flex flex-col w-full px-4">
      <section className="flex justify-between text-lg py-4">
        <Link href={"/"} className="text-2xl">
          <IoChevronBack />
        </Link>
        <span className="text-xs text-gray-500">You are {user.username}</span>
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

      {users && (
        <section className="w-full overflow-x-scroll py-4">
          <ul className="flex justify-between gap-2 w-fit px-4">
            {users.map((u) => {
              if (u.username === user.username) return null;
              return (
                <li
                  key={u.ID}
                  className="relative flex flex-col gap-1 items-center"
                >
                  <UserPreview
                    user={u}
                    url={`/dm/${user.username}--${u.username}`}
                    hasStory
                  />
                  <span className="text-sm">{u.username}</span>
                  <div className="absolute bottom-6 right-1 bg-white p-[2px] rounded-full">
                    <div className="bg-green-500 rounded-full h-3 w-3" />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-3 mt-4">
        <div className="flex justify-between items-center pl-2">
          <h2 className="font-semibold">Messages</h2>
          {/* <NewChat
            user={user}
            otherUser={
              {
                username: user.username === "admin" ? "guest" : "admin",
              } as User
            }
          /> */}
        </div>
        <ul className="flex flex-col gap-2">
          {conversations ? (
            Object.keys(conversations).map((key) => (
              <li
                key={key}
                className="hover:bg-neutral-100 transition-colors duration-300 ease-in-out"
              >
                <MessagePreview
                  user={user}
                  message={conversations[key][conversations[key].length - 1]}
                />
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No messages</p>
          )}
        </ul>
      </section>
    </main>
  );
}

function MessagePreview({ user, message }: { user: User; message: Message }) {
  return (
    <Link href={`dm/${message.sender}--${message.receiver}`}>
      <div className="flex items-center gap-4">
        <UserPreview user={user} hasStory />
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
