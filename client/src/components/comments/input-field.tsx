"use client";

import { useWebSocket } from "@/hooks/socket-context";

export function InputFieldComments() {
  const { notify } = useWebSocket();
  return (
    <div>
      <button onClick={notify}>Notify</button>
    </div>
  );
}
