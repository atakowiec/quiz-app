import { Breadcrumb } from "react-bootstrap";
import Meta from "../../components/Meta.tsx";
import styles from "./CreateGame.module.scss";
import {
  IoPeopleSharp,
  IoPersonSharp,
  IoPodiumSharp,
} from "react-icons/io5";
import Sidebar from "../../components/SideBar.tsx";
import { useSocket } from "../../socket/useSocket.ts";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../store/userSlice.ts";
import SetUserNameModal from "../../components/set-username-modal/SetUserNameModal.tsx";
import MainContainer from "../../components/MainContainer.tsx";
import MainBox from "../../components/MainBox.tsx";
import MainTitle from "../../components/MainTitle.tsx";
import { toast } from "react-toastify";
import { setInQueue, useQueue } from "../../store/queueSlice.ts";
import { useDispatch } from "react-redux";
import { useSidebarItems } from "../../hooks/useSidebarItems.ts";

const CreateGame: React.FC = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const user = useUser();
  const dispatch = useDispatch();
  const queue = useQueue();

  const [showModal, setShowModal] = useState(false);
  const [gameType, setGameType] = useState("");

  const sidebarItems = useSidebarItems();

  function onNewGame(gameType: string) {
    setGameType(gameType);
    if (!user?.loggedIn) {
      setShowModal(true);
      return;
    }
    newGame(gameType);
  }

  function newGame(gameType: string) {
    if (gameType === "matchmaking") {
      if (queue.inQueue) {
        toast.error("Jesteś już w kolejce");
        return;
      }
      socket.emit("join_queue", (gameId: string) => {
        if (gameId === "NO_GAME") {
          dispatch(setInQueue(true));
          toast.info("Dołączono do kolejki");
        }
      });
    } else {
      socket.emit("create_game", gameType, () => navigate("/waiting-room"));
    }
  }

  return (
    <>
      <Meta title={"Stwórz grę"}/>
      <Breadcrumb title="Stwórz grę"/>
      <Sidebar items={sidebarItems}/>
      <MainContainer className={styles.sidebarContainer}>
        <MainBox>
          <MainTitle>Stwórz Grę</MainTitle>
          <div className={styles.modeText}>Wybierz tryb gry</div>
          <div className={styles.selectionBoxes}>
            <div
              className={styles.modeSelectionText}
              onClick={() => onNewGame("singleplayer")}>
              Jednoosobowy <IoPersonSharp className={styles.singlePlayer}/>
            </div>
            <div
              className={styles.modeSelectionText}
              onClick={() => onNewGame("multiplayer")}
            >
              Wieloosobowy <IoPeopleSharp className={styles.multiPlayer}/>
            </div>

            <div
              className={styles.modeSelectionText}
              onClick={() => onNewGame("matchmaking")}
            >
              Matchmaking <IoPodiumSharp className={styles.ranked}/>
            </div>
          </div>
        </MainBox>
      </MainContainer>
      <SetUserNameModal
        show={showModal}
        confirmBtnText="Stwórz grę"
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false);
          newGame(gameType);
        }}
      />
    </>
  );
};

export default CreateGame;
