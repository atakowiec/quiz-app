import { useEffect } from "react";
import { userActions, useUser } from "../../store/userSlice";
import getApi from "../../api/axios";
import { useSocket } from "../../socket/useSocket";

export default function GameOverPhase() {
  const user = useUser();
  const socket = useSocket();
  useEffect(() => {
    console.log(user);
    if (user.loggedIn === false) {
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
      <a href="/">Odśwież</a>
      {/* TODO: Usuwanie Tokenu z niezalogowanego użytkownika po grze */}
      {/*todo entire component*/}
    </div>
  );
}
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
