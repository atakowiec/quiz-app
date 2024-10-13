import { useNavigate } from "react-router-dom";
import getApi from "../../api/axios.ts";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/userSlice.ts";
import { useSocket } from "../../socket/useSocket.ts";
import { notificationsActions } from "../../store/notificationsSlice.ts";
import { gameActions } from "../../store/gameSlice.ts";

export default function Logout() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const socket = useSocket();

  useEffect(() => {
    // I trust that this won't throw an error - if so, it's kinda bad
    getApi().post("/auth/logout").then(() => {
      socket.disconnect();

      dispatch(userActions.setUser(null));
      dispatch(notificationsActions.setNotifications([]));
      dispatch(gameActions.setGame(null));

      navigate("/");
    });
  }, []);

  return null;
}