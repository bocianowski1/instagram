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
