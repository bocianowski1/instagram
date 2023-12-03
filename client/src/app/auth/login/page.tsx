import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function LoginPage() {
  async function login(formData: FormData) {
    "use server";
    const username = formData.get("username");
    const password = formData.get("password");

    if (!username || !password) {
      return;
    }
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (!data.token) {
      return;
    }
    cookies().set(
      "token",
      data.token
      //   httpOnly: true,
      //   path: "/",
    );

    redirect("/");
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Login</h1>
      <form className="flex flex-col gap-4" action={login} method="POST">
        <label className="flex flex-col gap-2">
          Username
          <input
            type="text"
            className="text-black px-3 py-1 rounded-xl"
            name="username"
          />
        </label>
        <label className="flex flex-col gap-2">
          Password
          <input
            type="password"
            className="text-black px-3 py-1 rounded-xl"
            name="password"
          />
        </label>
        <button
          type="submit"
          className="bg-blue-500 font-semibold text-white px-4 py-2 rounded-xl"
        >
          Login
        </button>
      </form>
    </div>
  );
}
