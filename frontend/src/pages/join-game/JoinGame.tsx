import { Breadcrumb } from "react-bootstrap";
import Meta from "../../components/main-components/Meta.tsx";
import styles from "./JoinGame.module.scss";
import Sidebar from "../../components/main-components/sidebar/SideBar.tsx";
import { useSocket } from "../../socket/useSocket.ts";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../store/userSlice.ts";
import useQueryParam from "../../hooks/useQueryParam.ts";
import SetUserNameModal from "./set-username-modal/SetUserNameModal.tsx";
import MainContainer from "../../components/main-components/MainContainer.tsx";
import MainBox from "../../components/main-components/MainBox.tsx";
import MainTitle from "../../components/main-components/MainTitle.tsx";
import { useSidebarItems } from "../../hooks/useSidebarItems.ts";

const JoinGame: React.FC = () => {
  const codeQueryParam = useQueryParam("code");
  const [gameId, setGameId] = useState(codeQueryParam ?? "");
  const socket = useSocket();
  const navigate = useNavigate();
  const user = useUser();
  const sidebarItems = useSidebarItems()

  const [showModal, setShowModal] = useState(false);

  function onJoinGame() {
    if (!user?.loggedIn) {
      setShowModal(true);
      return;
    }

    socket.emit("join_game", gameId, () =>
      navigate("/waiting-room")
    );
  }

  return (
    <>
      <Meta title={"Dołącz do gry"} />
      <Breadcrumb title="Dołącz do gry" />
      <Sidebar items={sidebarItems} />
      <MainContainer className={styles.sidebarContainer}>
        <MainBox>
          <MainTitle>Dołącz do gry</MainTitle>
          <div className={styles.selectionBoxes}>
            <input
              className={styles.inputBox}
              type={"text"}
              placeholder={"Podaj ID gry"}
              value={gameId}
              onChange={(e) => setGameId(e.target.value.toUpperCase())}
            />
          </div>
          <div className={styles.createButton}>
            <button onClick={() => onJoinGame()}>Dołącz</button>
          </div>
        </MainBox>
      </MainContainer>
      <SetUserNameModal
        show={showModal}
        confirmBtnText="Dołącz do gry"
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          socket.emit("join_game", gameId, () =>
            navigate("/waiting-room")
          );
        }}
      />
    </>
  );
};

export default JoinGame;
