import { useEffect } from "react";
import { userActions, useUser } from "../../../store/userSlice.ts";
import getApi from "../../../api/axios.ts";
import { useSocket } from "../../../socket/useSocket.ts";
import { useDispatch } from "react-redux";

export default function GameOverPhase() {
  const user = useUser();
  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(user);
    if (!user.loggedIn) {
      getApi()
        .post("/auth/logout")
        .then(() => {
          dispatch(userActions.setUser(null));
          socket.disconnect();
        });
    }
  }, [user, socket]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h1>Winner winner chicken dinner</h1>
      <h2>Odśwież żeby stąd wyjść XD</h2>
      <a href="/public">Odśwież</a>
      {/* TODO: Usuwanie Tokenu z niezalogowanego użytkownika po grze */}
      {/*todo entire component*/}
    </div>
  );
}
