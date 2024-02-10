"use client";
import { Post, User } from "@/lib/types";
import { formatLikes, postLikedByUser } from "@/lib/utils";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";

export function LikeButton({ post, user }: { post: Post; user: User }) {
  const [liked, setLiked] = useState<boolean>(
    postLikedByUser(post, user?.username)
  );
  const [likes, setLikes] = useState<number>(post.likes.length);

  const handleLike = () => {
    const action = liked ? "unlike" : "like";
    setLiked(action === "like");
    setLikes(action === "like" ? likes + 1 : likes - 1);
  };

  return (
    <button
      onClick={handleLike}
      type="submit"
      className="flex items-center gap-1"
    >
      {liked ? (
        <FaHeart className="text-red-400 hover:text-red-500 transition-colors duration-200" />
      ) : (
        <FiHeart />
      )}
      <span className="text-sm">{formatLikes(likes)}</span>
    </button>
  );
}
