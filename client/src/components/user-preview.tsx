import { User } from "@/lib/types";
import Link from "next/link";

type UserPreviewProps = {
  user: User;
  url?: string;
  hideUrl?: boolean;
  hasStory?: boolean;
};

export function UserPreview({
  user,
  url,
  hideUrl,
  hasStory,
}: UserPreviewProps) {
  url = url || `/auth/profile/${user.username}`;

  return (
    <>
      {hideUrl ? (
        <div>
          {hasStory ? (
            <div className="p-[2px] bg-gradient-to-bl from-rose-600 to-orange-400 h-fit w-fit rounded-full">
              <div className="p-[1px] bg-white h-fit w-fit rounded-full">
                <div className="p-6 h-14 w-14 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-300">
                  <span className="font-semibold capitalize text-xl">
                    {user.username[0]}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 h-14 w-14 flex items-center justify-center rounded-full bg-gray-300">
              <span className="font-semibold capitalize text-xl">
                {user.username[0]}
              </span>
            </div>
          )}
        </div>
      ) : (
        <Link href={url}>
          {hasStory ? (
            <div className="p-[2px] bg-gradient-to-bl from-rose-600 to-orange-400 h-fit w-fit rounded-full">
              <div className="p-[1px] bg-white h-fit w-fit rounded-full">
                <div className="p-6 h-14 w-14 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition-colors duration-300">
                  <span className="font-semibold capitalize text-xl">
                    {user.username[0]}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 h-14 w-14 flex items-center justify-center rounded-full bg-gray-300">
              <span className="font-semibold capitalize text-xl">
                {user.username[0]}
              </span>
            </div>
          )}
        </Link>
      )}
    </>
  );
}
