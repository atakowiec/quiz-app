import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext, SocketType } from "./SocketContext";

export function NavigationHandler() {
  const socket: SocketType | null = useContext(SocketContext);
  const navigate = useNavigate();

  // Handle navigation logic here
  socket?.on("game_joined", () => {
    navigate("/waiting-room");
  });

  return null; // This component doesn't render anything, it just handles the side effects
}
