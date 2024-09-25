import { Breadcrumb, Container } from "react-bootstrap";
import Meta from "../../components/Meta.tsx";
import styles from "./CreateGame.module.scss";
import { FaWrench } from "react-icons/fa";
import {
  IoPersonSharp,
  IoPeopleSharp,
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
import SetUserNameModal from "../../components/SetUserNameModal/SetUserNameModal.tsx";

const CreateGame: React.FC = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const user = useUser();

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
            href: "/games",
          },
          { icon: IoStatsChartSharp, label: "Statystyki", href: "/stats" },
        ]
      : []), // Jeśli użytkownik nie jest zalogowany, te elementy zostaną pominięte
  ];

  function onNewGame(gameType: string) {
    // todo allow not logged users to play the game - modal with username input
    setGameType(gameType);
    if (!user?.loggedIn) {
      setShowModal(true);
      return;
    }

    socket.emit("create_game", gameType, () => navigate("/waiting-room"));
  }

  /*
    if client has a game in "waiting_for_players" status, redirect to waiting room
  */

  return (
    <div>
      <Meta title={"Stwórz grę"} />
      <Breadcrumb title="Stwórz grę" />
      <Sidebar items={sidebarItems} />
      <Container className={styles.mainContainer}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">
            <div className={styles.mainBox}>
              <div className={styles.mainText}>
                <FaWrench className="mb-2 fs-2" /> Stwórz Grę
              </div>
              <div className={styles.modeText}>Wybierz tryb gry</div>
              <div className={styles.selectionBoxes}>
                <div className={styles.modeSelectionText}>
                  Jednoosobowy <IoPersonSharp className={styles.singlePlayer} />
                </div>
                <div
                  className={styles.modeSelectionText}
                  onClick={() => onNewGame("multi")}
                >
                  Wieloosobowy <IoPeopleSharp className={styles.multiPlayer} />
                </div>

                <div className={styles.modeSelectionText}>
                  Rankingowy <IoPodiumSharp className={styles.ranked} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <SetUserNameModal
        show={showModal}
        confirmBtnText="Stwórz grę"
        onClose={() => setShowModal(false)}
        onConfirm={() => {
          socket.emit("create_game", gameType, () => navigate("/waiting-room"));
        }}
      />
    </div>
  );
};

export default CreateGame;
