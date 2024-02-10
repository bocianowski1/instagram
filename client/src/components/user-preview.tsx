import { User } from "@/lib/types";
import Link from "next/link";

type UserPreviewProps = {
  user: User;
  url?: string;
  hideUrl?: boolean;
  hasStory?: boolean;
  className?: string;
};

export function UserPreview({
  user,
  url,
  hideUrl,
  hasStory,
  className,
}: UserPreviewProps) {
  url = url || `/auth/profile/${user.username}`;
  className = className || "w-12 h-12 p-6 text-xl";

  return (
    <>
      {hideUrl ? (
        <>
          {hasStory ? (
            <div className="p-[2px] bg-gradient-to-bl from-rose-600 to-orange-400 rounded-full">
              <div className="p-[1px] bg-white rounded-full">
                <div
                  className={`${className} flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-300`}
                >
                  <span className="font-semibold capitalize">
                    {user.username[0]}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`${className} flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-300`}
            >
              <span className="font-semibold capitalize">
                {user.username[0]}
              </span>
            </div>
          )}
        </>
      ) : (
        <Link href={url}>
          {hasStory ? (
            <div className="p-[2px] bg-gradient-to-bl from-rose-600 to-orange-400 rounded-full">
              <div className="p-[1px] bg-white rounded-full">
                <div
                  className={`${className} flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-300`}
                >
                  <span className="font-semibold capitalize">
                    {user.username[0]}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`${className} flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-300`}
            >
              <span className="font-semibold capitalize">
                {user.username[0]}
              </span>
            </div>
          )}
        </Link>
      )}
    </>
  );
}
