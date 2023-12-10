import { useLogin } from "@/api/auth";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex flex-col mx-auto mt-40 px-8 py-6 gap-8 items-center justify-center h-fit w-fit border border-neutral-200 rounded-md">
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
      <form className="flex flex-col gap-4" action={useLogin} method="POST">
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
          Password
          <input
            type="password"
            className="text-black px-3 py-1 rounded-lg border border-blue-500"
            name="password"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 font-semibold text-white px-4 py-2 rounded-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
}
