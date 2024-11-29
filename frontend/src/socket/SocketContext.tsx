import { createContext, ReactNode, useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "@shared/socket";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { gameActions } from "../store/gameSlice";
import { notificationsActions } from "../store/notificationsSlice.ts";
import { toast } from "react-toastify";
import { userActions } from "../store/userSlice.ts";
import { clearQueue } from "../store/queueSlice.ts";
import { globalDataActions } from "../store/globalDataSlice.ts";
import { getCategories } from "../utils/utils.ts";

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

export const SocketContext = createContext<SocketType | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const socket: SocketType = useMemo(() => {
    const newSocket: SocketType = io(import.meta.env.VITE_API_URL, {
      withCredentials: true, // this will to send a cookie with token automatically with the handshake
      autoConnect: false, // we don't want to connect immediately - socket will connect only when the user will enter its name or log in.
      transports: ["websocket"], // dunno why, but I guess it won't work without this
    });

    newSocket.on("set_game", (game) => dispatch(gameActions.setGame(game)));

    newSocket.on("update_game", (game) =>
      dispatch(gameActions.updateGame(game)),
    );

    newSocket.on("category_updated", async () => {
      console.log("Category updated");
      try {
        const categories = await getCategories();
        dispatch(globalDataActions.setData({ categories }));
      } catch (error) {
        console.error("Failed to update categories", error);
      }
    });
    newSocket.on("queue_left", () => dispatch(clearQueue()));

    newSocket.on("exception", (message) =>
      toast.error(typeof message === "string" ? message : message.message),
    );

    newSocket.on("notification", (message) => toast.info(message));

    newSocket.on("new_notification", (notification) =>
      dispatch(notificationsActions.newNotification(notification)),
    );

    newSocket.on("set_notifications", (notifications) =>
      dispatch(notificationsActions.setNotifications(notifications)),
    );

    newSocket.on("remove_notification", (notificationId) =>
      dispatch(notificationsActions.removeNotification(notificationId)),
    );

    newSocket.on("set_friend_requests", (friendRequests) =>
      dispatch(userActions.setFriendRequests(friendRequests)),
    );

    newSocket.on("remove_friend_request", (friendRequestId) =>
      dispatch(userActions.removeFriendRequest(friendRequestId)),
    );

    newSocket.on("new_friend_request", (friendRequest) =>
      dispatch(userActions.newFriendRequest(friendRequest)),
    );

    newSocket.on("set_friends", (friends) =>
      dispatch(userActions.setFriendships(friends)),
    );

    newSocket.on("new_friend", (friend) =>
      dispatch(userActions.newFriendship(friend)),
    );

    newSocket.on("update_friend_status", (friendId, newStatus) =>
      dispatch(
        userActions.updateFriendStatus({
          friendId,
          newStatus,
        }),
      ),
    );

    newSocket.on("update_friend_icon", (friendId, color) =>
      dispatch(
        userActions.updateFriendColor({
          friendId,
          color,
        }),
      ),
    );

    newSocket.on("remove_friend", (friendId) =>
      dispatch(userActions.removeFriendship(friendId)),
    );
    return newSocket;
  }, []);

  // clean up the socket listeners
  useEffect(() => {
    return () => {
      socket.offAny();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}
