import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext, SocketType } from "./SocketContext";
import {useDispatch} from "react-redux";
import {clearQueue} from "../store/queueSlice.ts";

export function NavigationHandler() {
  const socket: SocketType | null = useContext(SocketContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  socket?.on("game_joined", () => {
    dispatch(clearQueue());
    navigate("/waiting-room");
  });

  return null;
}
