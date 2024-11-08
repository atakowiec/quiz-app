import React, { useEffect, useState } from "react";
import { Breadcrumb } from "react-bootstrap";
import Meta from "../../components/Meta.tsx";
import MainContainer from "../../components/MainContainer.tsx";
import Sidebar, { SidebarItem } from "../../components/SideBar.tsx";
import {
  IoIosAddCircleOutline,
  IoIosPlay,
  IoLogoGameControllerB,
} from "react-icons/io";
import { IoStatsChartSharp } from "react-icons/io5";
import MainBox from "../../components/MainBox.tsx";
import styles from "./History.module.scss";
import MainTitle from "../../components/MainTitle.tsx";
import { useUser } from "../../store/userSlice.ts";
import getApi from "../../api/axios.ts";
import { GameHistoryPlayerItem } from "@shared/game.js";

const History: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: IoIosAddCircleOutline, label: "Stwórz Grę", href: "/create-game" },
    { icon: IoIosPlay, label: "Dołącz do gry", href: "/join-game" },
    { icon: IoLogoGameControllerB, label: "Historia Gier", href: "/history" },
    { icon: IoStatsChartSharp, label: "Statystyki", href: "/stats" },
  ];

  const userId = useUser()?.id;
  const [gameHistory, setGameHistory] = useState<GameHistoryPlayerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    const fetchGameHistory = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getApi().get(`history/user/${userId}`);
        const sortedData = response.data.sort(
          (a: GameHistoryPlayerItem, b: GameHistoryPlayerItem) =>
            new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );
        setGameHistory(sortedData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchGameHistory();
  }, [userId]);

  return (
    <>
      <Meta title={"Historia Gier"} />
      <Breadcrumb title="Historia Gier" />
      <Sidebar items={sidebarItems} />
      <MainContainer className={styles.sidebarContainer}>
        <MainBox>
          <MainTitle>Historia Gier</MainTitle>
          <div className={styles.gameHistoryBox}>
            <div className={styles.titleRow}>
              <div className={styles.leftTitles}>
                <div>Data</div>
                <div>Miejsce</div>
              </div>
              <div className={styles.rightTitles}>
                <div className={styles.trybMargin}>Tryb</div>
                <div>Punkty</div>
              </div>
            </div>
            <hr className={styles.line} />
            <div className={styles.grayHistoryBox}>
              {loading && <div>Loading...</div>}
              {error && <div>Error: {error}</div>}
              {gameHistory.map((history, index) => (
                <div className={styles.singleHistory} key={index}>
                  <div className={styles.leftTitles}>
                    <div>{new Date(history.dateTime).toLocaleDateString()}</div>
                    <div>{history.place}</div>
                  </div>
                  <div className={styles.rightTitles}>
                    <div>{history.gameType}</div>
                    <div className={styles.pointsMargin}>{history.score}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </MainBox>
      </MainContainer>
    </>
  );
};

export default History;
