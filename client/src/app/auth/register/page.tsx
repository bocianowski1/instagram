import { register } from "@/api/auth";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex flex-col mx-auto my-auto px-8 py-6 gap-8 items-center justify-center h-fit w-fit border border-neutral-200 rounded-md">
      <h1 className="text-3xl font-bold">
        <div className="h-32">
          <Image
            src="/instagram-logo.png"
            alt="logo"
            height={400}
            width={400}
            className="object-contain h-full w-full"
          />
        </div>
      </h1>
      <form className="flex flex-col gap-4" action={register} method="POST">
        <label className="flex flex-col gap-2">
          Username
          <input
            autoFocus
            type="text"
            className="text-black px-3 py-1 rounded-lg border border-blue-500"
            name="username"
          />
        </label>
        <label className="flex flex-col gap-2">
          Name
          <input
            autoFocus
            type="text"
            className="text-black px-3 py-1 rounded-lg border border-blue-500"
            name="name"
          />
        </label>
        <label className="flex flex-col gap-2">
          Password
          <input
            type="password"
            className="text-black px-3 py-1 rounded-lg border border-blue-500"
            name="password"
          />
        </label>
        <label className="flex flex-col gap-2">
          Repeat password
          <input
            type="password"
            className="text-black px-3 py-1 rounded-lg border border-blue-500"
            name="repeatPassword"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 font-semibold text-white px-4 py-2 rounded-lg"
        >
          Register
        </button>
      </form>
      <div className="flex py-3">
        <p className="text-sm">
          <span className="text-gray-500">Already got an account?</span>{" "}
          <Link href="/auth/login">
            <span className="text-blue-500 font-semibold underline hover:no-underline hover:text-blue-400 transition-all duration-300">
              Login
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
