import { Breadcrumb, Container } from "react-bootstrap";
import Meta from "../../components/Meta.tsx";
import styles from "./JoinGame.module.scss";
import { FaWrench } from "react-icons/fa";
import { IoStatsChartSharp } from "react-icons/io5";
import Sidebar, { SidebarItem } from "../../components/SideBar.tsx";
import { useSocket } from "../../socket/useSocket.ts";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoIosAddCircleOutline,
  IoIosPlay,
  IoLogoGameControllerB,
} from "react-icons/io";
import { useUser } from "../../store/userSlice.ts";
import useQueryParam from "../../hooks/useQueryParam.ts";
import SetUserNameModal from "../../components/set-username-modal/SetUserNameModal.tsx";

const JoinGame: React.FC = () => {
  const gameIdRef = useRef<HTMLInputElement>(null);
  const socket = useSocket();
  const navigate = useNavigate();
  const user = useUser();
  const codeQueryParam = useQueryParam("code");

  const [showModal, setShowModal] = useState(false);

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
    <div>
      <Meta title={"Dołącz do gry"} />
      <Breadcrumb title="Dołącz do gry" />
      <Sidebar items={sidebarItems} />
      <Container className={styles.mainContainer}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">
            <div className={styles.mainBox}>
              <div className={styles.mainText}>
                <FaWrench className="mb-2 fs-2" /> Dołącz do gry
              </div>
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
            </div>
          </div>
        </div>
      </Container>
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
    </div>
  );
};

export default JoinGame;
