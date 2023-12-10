"use client";
import { User } from "@/lib/types";
import { createContext, useContext, useState } from "react";

const UserContext = createContext({
  user: null as User | null,
  updateUser: (newUser: User) => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
