import { Breadcrumb } from "react-bootstrap";
import Meta from "../../components/Meta.tsx";
import styles from "./CreateGame.module.scss";
import {
  IoPeopleSharp,
  IoPersonSharp,
  IoPodiumSharp,
  IoStatsChartSharp,
} from "react-icons/io5";
import Sidebar, { SidebarItem } from "../../components/SideBar.tsx";
import { useSocket } from "../../socket/useSocket.ts";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoIosAddCircleOutline,
  IoIosPlay,
  IoLogoGameControllerB,
} from "react-icons/io";
import { useUser } from "../../store/userSlice.ts";
import SetUserNameModal from "../../components/set-username-modal/SetUserNameModal.tsx";
import MainContainer from "../../components/MainContainer.tsx";
import MainBox from "../../components/MainBox.tsx";
import MainTitle from "../../components/MainTitle.tsx";
import { toast } from "react-toastify";
import { setInQueue, useQueue } from "../../store/queueSlice.ts";
import { useDispatch } from "react-redux";

const CreateGame: React.FC = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const user = useUser();
  const dispatch = useDispatch();
  const queue = useQueue();

  const [showModal, setShowModal] = useState(false);
  const [gameType, setGameType] = useState("");

  const sidebarItems: SidebarItem[] = [
    { icon: IoIosAddCircleOutline, label: "Stwórz Grę", href: "/create-game" },
    { icon: IoIosPlay, label: "Dołącz do gry", href: "/join-game" },
    ...(user.loggedIn
      ? [
          {
            icon: IoLogoGameControllerB,
            label: "Historia Gier",
            href: "/history",
          },
          { icon: IoStatsChartSharp, label: "Statystyki", href: "/stats" },
        ]
      : []), // Jeśli użytkownik nie jest zalogowany, te elementy zostaną pominięte
  ];

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

  /*
      if client has a game in "waiting_for_players" status, redirect to waiting room
    */

  return (
    <>
      <Meta title={"Stwórz grę"} />
      <Breadcrumb title="Stwórz grę" />
      <Sidebar items={sidebarItems} />
      <MainContainer className={styles.sidebarContainer}>
        <MainBox>
          <MainTitle>Stwórz Grę</MainTitle>
          <div className={styles.modeText}>Wybierz tryb gry</div>
          <div className={styles.selectionBoxes}>
            <div className={styles.modeSelectionText}>
              Jednoosobowy <IoPersonSharp className={styles.singlePlayer} />
            </div>
            <div
              className={styles.modeSelectionText}
              onClick={() => onNewGame("wieloosobowy")}
            >
              Wieloosobowy <IoPeopleSharp className={styles.multiPlayer} />
            </div>

            <div
              className={styles.modeSelectionText}
              onClick={() => onNewGame("matchmaking")}
            >
              Matchmaking <IoPodiumSharp className={styles.ranked} />
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
