import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

let socket = null;

export const setupWebSocket = (userId, onNotification) => {
  if (!userId) {
    console.warn("No user ID provided for WebSocket setup");
    return () => {};
  }

  try {
    if (!socket) {
      socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        auth: {
          userId
        }
      });

      socket.on("connect", () => {
        console.log("WebSocket connected successfully");
        socket.emit("join", { userId });
      });

      socket.on("connect_error", (error) => {
        console.error("WebSocket connection error:", error.message);
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    }

    // Remove existing listeners to prevent duplicates
    socket.off("notification");
    socket.on("notification", onNotification);

    return () => {
      if (socket) {
        socket.off("notification");
        socket.disconnect();
      }
    };
  } catch (error) {
    console.error("Socket setup error:", error);
    return () => {};
  }
};
