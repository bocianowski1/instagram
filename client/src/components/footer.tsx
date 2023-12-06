import Link from "next/link";
import { GoHomeFill } from "react-icons/go";
import { FiSearch, FiShoppingBag } from "react-icons/fi";
import { BiMoviePlay } from "react-icons/bi";
import { FaRegUserCircle } from "react-icons/fa";

const links = [
  {
    href: "/",
    label: "Home",
    icon: <GoHomeFill />,
  },
  {
    href: "/explore",
    label: "Explore",
    icon: <FiSearch />,
  },
  {
    href: "/reels",
    label: "Reels",
    icon: <BiMoviePlay />,
  },
  {
    href: "/shop",
    label: "Shop",
    icon: <FiShoppingBag />,
  },
  {
    href: "/auth/profile",
    label: "Profile",
    icon: <FaRegUserCircle />,
  },
];

export function Footer() {
  return (
    <footer className="bg-white h-[4rem] fixed bottom-0 left-0 right-0 z-50 border-t border-t-neutral-200">
      <nav className="flex justify-between px-6 pt-3 pb-8">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <span className="flex flex-col items-center text-2xl">
              {link.icon}
              <span hidden>{link.label}</span>
            </span>
          </Link>
        ))}
      </nav>
    </footer>
  );
}
