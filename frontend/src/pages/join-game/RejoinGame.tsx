import { Breadcrumb } from "react-bootstrap";
import Meta from "../../components/main-components/Meta.tsx";
import styles from "./JoinGame.module.scss";
import Sidebar from "../../components/main-components/sidebar/SideBar.tsx";
import { useSocket } from "../../socket/useSocket.ts";
import React from "react";
import MainContainer from "../../components/main-components/MainContainer.tsx";
import MainBox from "../../components/main-components/MainBox.tsx";
import MainTitle from "../../components/main-components/MainTitle.tsx";

import { useSidebarItems } from "../../hooks/useSidebarItems.ts";
import getApi from "../../api/axios.ts";
import { userActions } from "../../store/userSlice.ts";
import { useDispatch } from "react-redux";

const RejoinGame: React.FC = () => {
  const [gameId, setGameId] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [error, setError] = React.useState("");
  const socket = useSocket();
  const dispatch = useDispatch();
  const sidebarItems = useSidebarItems()

  async function onJoinGame() {
    if(!username || !gameId) {
      setError("Podaj nazwę użytkownika i ID gry");
      return
    }
    socket.disconnect();

    getApi().post("/auth/username-and-game", { username: username, gameId: gameId })
      .then(response => {
        setError("");

        if (response.status !== 200) {
          return;
        }

        dispatch(userActions.setUser(response.data));

        socket.connect();
      })
      .catch(err => {
        setError(err.response.data.message);
      })
  }

  return (
    <>
      <Meta title={"Wróć do gry"}/>
      <Breadcrumb title="Wróć do gry"/>
      <Sidebar items={sidebarItems}/>
      <MainContainer className={styles.sidebarContainer}>
        <MainBox>
          <MainTitle>Wróć do gry</MainTitle>
          <div className={styles.selectionBoxes}>
            <input
              className={styles.inputBox}
              type={"text"}
              placeholder={"Podaj ID gry"}
              value={gameId}
              onChange={(e) => setGameId(e.target.value.toUpperCase())}
            />
            <input
              className={styles.inputBox}
              type={"text"}
              placeholder={"Podaj nazwę użytkownika"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={styles.error}>
            {error}
          </div>
          <div className={styles.createButton}>
            <button onClick={() => onJoinGame()}>Dołącz</button>
          </div>
        </MainBox>
      </MainContainer>
    </>
  );
};

export default RejoinGame;
