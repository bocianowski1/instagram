export type CloudImage = {
  id: string;
  url: string;
};

export type User = {
  ID: number;
  username: string;
  name: string;
  password: string;
  Followers: User[];
  Following: User[];
};

export type Message = {
  ID: number;
  sender: string;
  receiver: string;
  content: string;
  CreatedAt: string;
};

export type Comment = {
  ID: number;
  postId: number;
  username: string;
  content: string;
  CreatedAt: string;
};

export type Like = {
  ID: number;
  postId: number;
  username: string;
  CreatedAt: string;
};

export type Post = {
  ID: number;
  username: string;
  caption: string;
  CreatedAt: string;
  // Images: CloudImage[];
  comments: Comment[];
  likes: Like[];
};
