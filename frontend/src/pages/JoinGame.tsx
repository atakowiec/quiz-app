import { Breadcrumb, Container } from "react-bootstrap";
import Meta from "../components/Meta";
import styles from "../styles/JoinGame.module.scss";
import { FaWrench, FaGamepad, FaPlay } from "react-icons/fa";
import { IoStatsChartSharp } from "react-icons/io5";
import Sidebar, { SidebarItem } from "../components/SideBar";
import { useSocket } from "../socket/useSocket";
import { useRef } from "react";

const JoinGame: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: FaGamepad, label: "Historia Gier", href: "/games" },
    { icon: FaPlay, label: "Stwórz Grę", href: "/create-game" },
    { icon: IoStatsChartSharp, label: "Statystyki", href: "/stats" },
  ];
  const gameIdRef = useRef<HTMLInputElement>(null);
  const socket = useSocket();

  function onJoinGame() {
    socket.emit("join_game", gameIdRef.current!.value);
  }

  return (
    <div>
      <Meta title={"Dołącz do gry"} />
      <Breadcrumb title="Dołącz do gry" />
      <Sidebar items={sidebarItems} />
      <Container className={styles.createContainer}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">
            <div className={styles.createBox}>
              <div className={styles.createText}>
                <FaWrench className="mb-2 fs-2" /> Dołącz do gry
              </div>
              <div className={styles.selectionBoxes}>
                <input
                  type={"text"}
                  placeholder={"Podaj ID gry"}
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
    </div>
  );
};

export default JoinGame;
