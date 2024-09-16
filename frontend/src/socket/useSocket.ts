import { useContext } from "react";
import { SocketContext, SocketType } from "./SocketContext";

export function useSocket(): SocketType {
  return useContext(SocketContext)!;
}