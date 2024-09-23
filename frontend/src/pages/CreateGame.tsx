import { Breadcrumb, Container } from "react-bootstrap";
import Meta from "../components/Meta";
import styles from "../styles/CreateGame.module.scss";
import { FaWrench } from "react-icons/fa";
import {
  IoPersonSharp,
  IoPeopleSharp,
  IoPodiumSharp,
  IoStatsChartSharp,
} from "react-icons/io5";
import Sidebar, { SidebarItem } from "../components/SideBar";
import { useSocket } from "../socket/useSocket";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  IoIosAddCircleOutline,
  IoIosPlay,
  IoLogoGameControllerB,
} from "react-icons/io";
import { useUser } from "../store/userSlice.ts";
import { toast } from "react-toastify";

const CreateGame: React.FC = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const user = useUser();

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
    if (!user?.loggedIn) {
      toast.error("Musisz być zalogowany, aby stworzyć grę");
      return;
    }

    socket.emit("create_game", gameType, () => navigate("/waiting-room"));
  }

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
    </div>
  );
};

export default CreateGame;
