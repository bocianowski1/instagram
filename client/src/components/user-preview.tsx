export function UserPreview({
  profileImage,
  hasStory,
}: {
  profileImage: React.ReactNode;
  hasStory?: boolean;
}) {
  return (
    <>
      {hasStory ? (
        <div className="p-[2px] bg-gradient-to-bl from-rose-600 to-orange-400 h-fit w-fit rounded-full">
          <div className="p-[1px] bg-white h-fit w-fit rounded-full">
            <div className="p-6 h-14 w-14 flex items-center justify-center rounded-full bg-gray-300">
              {profileImage}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 h-14 w-14 flex items-center justify-center rounded-full bg-gray-300">
          {profileImage}
        </div>
      )}
    </>
  );
}
