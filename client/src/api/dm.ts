interface DMProps {
  user1: string;
  user2: string;
}

export async function getMessages({ user1, user2 }: DMProps) {
  const response = await fetch(
    `http://localhost:9999/messages?user1=${user1}&user2=${user2}`
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}

export async function getMessagesByUser(username: string) {
  const response = await fetch(
    `http://localhost:9999/messages?user1=${username}`
  );
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}
