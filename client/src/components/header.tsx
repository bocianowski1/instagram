import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiMessageCircle, FiPlusSquare } from "react-icons/fi";
import { UserPreview } from "./user-preview";

const links = [
  {
    href: "/new",
    label: "New",
    icon: <FiPlusSquare />,
  },
  {
    href: "/likes",
    label: "Likes",
    icon: (
      <div className="relative">
        <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
        <FiHeart />
      </div>
    ),
  },
  {
    href: "/dm",
    label: "DMs",
    icon: <FiMessageCircle />,
  },
];

export function Header() {
  return (
    <header className="bg-white h-[12rem] absolute top-0 left-0 right-0 z-50 border-b border-neutral-200">
      <ul className="flex justify-between items-center px-4 pt-3">
        <h1 className="h-[75px] flex items-center overflow-hidden">
          <Image
            src="/instagram-logo.png"
            alt="instagram"
            width={250}
            height={150}
            className="object-contain h-full w-full"
          />
        </h1>
        <nav className="flex items-center gap-6">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className="flex flex-col items-center text-2xl">
                {link.icon}
                <span hidden>{link.label}</span>
              </span>
            </Link>
          ))}
        </nav>
      </ul>

      {/* Stories */}
      <section className="w-full overflow-x-scroll pb-4">
        <ul className="flex justify-between gap-2 w-fit px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((item) => (
            <li
              key={item}
              className="relative flex flex-col gap-1 items-center"
            >
              <UserPreview profileImage={<div />} hasStory />
              <span className="text-sm">Me</span>
            </li>
          ))}
        </ul>
      </section>
    </header>
  );
}
