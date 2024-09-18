import { Breadcrumb, Container } from "react-bootstrap";
import Meta from "../components/Meta";
import styles from "../styles/CreateGame.module.scss";
import { FaWrench, FaGamepad, FaPlay } from "react-icons/fa";
import {
  IoPersonSharp,
  IoPeopleSharp,
  IoPodiumSharp,
  IoStatsChartSharp,
} from "react-icons/io5";
import Sidebar, { SidebarItem } from "../components/SideBar";
import { useSocket } from "../socket/useSocket";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { State } from "../store";
import { toast } from "react-toastify";

const CreateGame: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: FaGamepad, label: "Historia Gier", href: "/games" },
    { icon: FaPlay, label: "Stwórz Grę", href: "/create-game" },
    { icon: IoStatsChartSharp, label: "Statystyki", href: "/stats" },
  ];
  const socket = useSocket();
  const navigate = useNavigate();
  const game = useSelector((state: State) => state.game);

  function onNewGame(gameType: string) {
    socket.emit("create_game", gameType);

    socket.once("set_game", () => {
      navigate(`/room`);
    });
  }

  useEffect(() => {
    if (game) {
      navigate(`/room`);
      toast.info("Jesteś już w grze"); // TODO:  Dla testu zeby pokazac ze sie dwa razy wykonuje idk dlaczego
    }
  }, [game]);

  return (
    <div>
      <Meta title={"Stwórz grę"} />
      <Breadcrumb title="Stwórz grę" />
      <Sidebar items={sidebarItems} />
      <Container className={styles.createContainer}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">
            <div className={styles.createBox}>
              <div className={styles.createText}>
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
