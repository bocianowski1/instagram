import { logout } from "@/api/auth";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

export async function ProfileForm() {
  return (
    <form className="text-2xl" action={logout}>
      <button className="font-semibold" type="submit">
        <HiOutlineDotsHorizontal />
      </button>
    </form>
  );
}
