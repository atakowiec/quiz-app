import { Breadcrumb } from "react-bootstrap";
import Meta from "../../components/Meta.tsx";
import styles from "./JoinGame.module.scss";
import Sidebar from "../../components/SideBar.tsx";
import { useSocket } from "../../socket/useSocket.ts";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../store/userSlice.ts";
import useQueryParam from "../../hooks/useQueryParam.ts";
import SetUserNameModal from "../../components/set-username-modal/SetUserNameModal.tsx";
import MainContainer from "../../components/MainContainer.tsx";
import MainBox from "../../components/MainBox.tsx";
import MainTitle from "../../components/MainTitle.tsx";
import { useSidebarItems } from "../../hooks/useSidebarItems.ts";

const JoinGame: React.FC = () => {
  const gameIdRef = useRef<HTMLInputElement>(null);
  const socket = useSocket();
  const navigate = useNavigate();
  const user = useUser();
  const codeQueryParam = useQueryParam("code");
  const sidebarItems = useSidebarItems()

  const [showModal, setShowModal] = useState(false);

  function onJoinGame() {
    if (!user?.loggedIn) {
      setShowModal(true);
      return;
    }

    socket.emit("join_game", gameIdRef.current!.value, () =>
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
              defaultValue={codeQueryParam ?? ""}
              ref={gameIdRef}
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
          socket.emit("join_game", gameIdRef.current!.value, () =>
            navigate("/waiting-room")
          );
        }}
      />
    </>
  );
};

export default JoinGame;
