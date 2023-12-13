export type CloudImage = {
  id: string;
  url: string;
};

export type User = {
  ID: string;
  username: string;
  password: string;
  role: string;
};

export type Message = {
  ID: string;
  sender: string;
  receiver: string;
  content: string;
  CreatedAt: string;
};
