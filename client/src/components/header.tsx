"use server";
import { cookies } from "next/headers";
import Link from "next/link";

export async function Header() {
  const token = cookies().get("token");
  console.log("tokennnnn", token);
  return (
    <header className="flex justify-between items-center w-full px-6 py-4 border-b border-b-white">
      <h1 className="text-4xl font-bold">Insta</h1>
      <nav>
        <ul className="flex gap-4">
          <li>
            <Link href="/">Upload</Link>
          </li>
          <li>
            {token ? (
              <Link href="/">Profile</Link>
            ) : (
              <Link href="/auth/login">Login</Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
