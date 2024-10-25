import React, { useEffect, useState } from "react";
import Sidebar, { SidebarItem } from "../../components/SideBar.tsx";
import {
  IoIosAddCircleOutline,
  IoIosPlay,
  IoLogoGameControllerB,
} from "react-icons/io";
import { IoStatsChartSharp } from "react-icons/io5";
import { useUser } from "../../store/userSlice.ts";
import Meta from "../../components/Meta.tsx";
import { Breadcrumb } from "react-bootstrap";
import MainContainer from "../../components/MainContainer.tsx";
import MainBox from "../../components/MainBox.tsx";
import MainTitle from "../../components/MainTitle.tsx";
import styles from "./Stats.module.scss";
import RankingVisualization from "./RankingVisualization.tsx";
import { IoIosStats } from "react-icons/io";
import StatsModal from "./StatsModal.tsx";
import { ProfileStats } from "@shared/game.js";
import getApi from "../../api/axios.ts";

const Stats: React.FC = () => {
  const user = useUser();

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
      : []),
  ];

  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const [profileStats, setProfileStats] = useState<ProfileStats>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    const fetchProfileStats = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getApi().get(`history/stats/${user?.id}`);
        setProfileStats(response.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfileStats();
  }, [user]);

  return (
    <>
      <Meta title={"Dołącz do gry"} />
      <Breadcrumb title="Dołącz do gry" />
      <Sidebar items={sidebarItems} />
      <MainContainer className={styles.sidebarContainer}>
        <MainBox className={styles.sBox}>
          <MainTitle>Statystyki</MainTitle>
          <div className={styles.statsBox}>
            {loading && <div>Ładowanie...</div>}
            {error && <div>{error}</div>}
            <RankingVisualization rankingData={profileStats.rankingPlaces} />
            <div className={styles.singleRanking}>
              <div className={styles.titleAndNumber}>
                <div>Liczba zagranych gier</div>
                <div>{profileStats.gamesPlayed}</div>
              </div>
              <button className={styles.rankingIcon}>
                <IoIosStats />
              </button>
            </div>
            <div className={styles.singleRanking}>
              <div className={styles.titleAndNumber}>
                <div>Liczba zdobytych punktów</div>
                <div>{profileStats.totalScore}</div>
              </div>
              <button className={styles.rankingIcon}>
                <IoIosStats />
              </button>
            </div>
            <div className={styles.singleRanking}>
              <div className={styles.titleAndNumber}>
                <div>Średnia liczba punktów na grę</div>
                <div>{profileStats.averageScore}</div>
              </div>
              <button className={styles.rankingIcon}>
                <IoIosStats />
              </button>
            </div>
            <div className={styles.singleRanking}>
              <div className={styles.titleAndNumber}>
                <div>Największa liczba punktów w grze</div>
                <div>{profileStats.maxScore}</div>
              </div>
              <button className={styles.rankingIcon}>
                <IoIosStats />
              </button>
            </div>
            <div className={styles.rankingButtons}>
              <button className={styles.rankingButton} onClick={openModal}>
                Statystyki kategorii
              </button>
              <StatsModal
                show={showModal}
                handleClose={closeModal}
                userId={user?.id}
              />
              <button className={styles.rankingButton}>
                Statystyki jakies
              </button>
            </div>
          </div>
        </MainBox>
      </MainContainer>
    </>
  );
};

export default Stats;
