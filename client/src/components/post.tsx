import { UserPreview } from "./user-preview";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { PiPaperPlaneRight } from "react-icons/pi";
import { FaRegBookmark } from "react-icons/fa";
import { Post } from "@/lib/types";
import { getUserByUsername } from "@/api/users";
import { likePost, postComment } from "@/api/posts";
import { getAuth } from "@/api/auth";
import { postLikedByUser } from "@/lib/utils";
import { LikeButton } from "./like-button";
import Link from "next/link";

type Props = {
  post: Post;
};

export async function PostCard({ post }: Props) {
  const { user } = await getAuth();
  const postUser = await getUserByUsername(post.username);

  return (
    <div className="w-full flex flex-col h-fit pb-3">
      <section className="flex gap-3 items-center p-3">
        <UserPreview user={postUser} hasStory />
        <Link href={`/auth/profile/${post.username}`} className="font-semibold">
          {post.username} {post.ID}
        </Link>
      </section>
      <section className="h-[50vh] w-[600px] px-[1px] bg-neutral-200">
        <div className="w-full h-full bg-gradient-to-br from-pink-300 to-purple-300" />
        {/* {imageURL.endsWith("mp4") ? (
          <video
            src={imageURL}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={imageURL}
            alt=""
            height={400}
            width={400}
            className="w-full h-full object-cover"
          />
        )} */}
      </section>
      <section className="flex justify-between p-4 text-2xl">
        <div className="flex items-center gap-4">
          <form
            action={likePost}
            method="POST"
            className="flex items-center justify-center"
          >
            <input type="hidden" name="postId" value={post.ID} />
            <input type="hidden" name="username" value={user.username} />
            <input
              type="hidden"
              name="action"
              value={postLikedByUser(post, user.username) ? "unlike" : "like"}
            />
            <LikeButton post={post} user={user} />
          </form>
          <FiMessageCircle />
          <div className="-rotate-45">
            <PiPaperPlaneRight />
          </div>
        </div>
        <FaRegBookmark />
      </section>
      <section className="flex flex-col gap-2 px-2">
        <div className="flex items-center gap-2">
          <ul className="flex pr-2">
            {post.likes.length > 0 &&
              post.likes.map(async (like, idx) => {
                if (idx === 3) return;
                const user = await getUserByUsername(like.username);
                let xOffset = idx * 2;
                return (
                  <li key={like.ID} className={`-translate-x-${xOffset}`}>
                    <UserPreview
                      user={user}
                      hideUrl
                      className="h-8 w-8 p-2 font-normal text-sm border border-gray-500"
                    />
                  </li>
                );
              })}
          </ul>
          {post.likes.length > 0 && (
            <p className="-translate-x-2">
              Liked by{" "}
              <span className="font-semibold">{post.likes[0].username}</span>{" "}
              {post.likes.length === 2 && (
                <>
                  <span>and </span>
                  <span className="font-semibold">
                    {post.likes[1].username}
                  </span>
                </>
              )}
              {post.likes.length > 2 && (
                <>
                  <span>and </span>
                  <span className="font-semibold">
                    {post.likes.length - 1} others
                  </span>
                </>
              )}
            </p>
          )}
        </div>
        <div className="px-2 flex gap-1">
          <Link
            href={`/auth/profile/${post.username}`}
            className="font-semibold"
          >
            {post.username}
          </Link>
          <p>{post.caption}</p>
        </div>
        <form
          action={postComment}
          method="POST"
          className="relative flex items-center rounded-lg border border-neutral-200"
        >
          <input type="hidden" name="postId" value={post.ID} />
          <input type="hidden" name="username" value={user.username} />
          <input
            type="text"
            className="w-full pl-3 pr-[45px] py-2 rounded-lg bg-neutral-100"
            name="content"
            placeholder="Add a comment..."
          />
          <button
            type="submit"
            className="absolute right-0 top-0 bottom-0 w-[40px] rounded-r-lg flex items-center justify-center px-3 text-lg text-gray-400"
          >
            <PiPaperPlaneRight className="-rotate-45 text-2xl" />
          </button>
        </form>
        {post.comments.length === 0 && (
          <p className="text-gray-500 text-sm px-2">No comments</p>
        )}
        {post.comments.length === 1 && (
          <p className="text-gray-500 text-sm px-2">1 comment</p>
        )}
        {post.comments.length > 1 && (
          <p className="text-gray-500 text-sm px-2">
            {post.comments.length} comments
          </p>
        )}
        <div className="max-h-[6rem] overflow-y-scroll">
          <div className="flex flex-col h-fit px-2">
            {post.comments.length > 0 &&
              post.comments.map((comment) => {
                return (
                  <div key={comment.ID} className="flex gap-1">
                    <span className="font-semibold">{comment.username}</span>
                    <p>{comment.content}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
}
