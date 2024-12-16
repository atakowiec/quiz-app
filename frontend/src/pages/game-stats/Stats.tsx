import React, { useEffect, useState } from "react";
import Sidebar from "../../components/main-components/sidebar/SideBar.tsx";
import { useUser } from "../../store/userSlice.ts";
import Meta from "../../components/main-components/Meta.tsx";
import { Breadcrumb } from "react-bootstrap";
import MainContainer from "../../components/main-components/MainContainer.tsx";
import MainBox from "../../components/main-components/MainBox.tsx";
import MainTitle from "../../components/main-components/MainTitle.tsx";
import styles from "./Stats.module.scss";
import RankingVisualization from "./components/RankingVisualization.tsx";
import StatsModal from "./components/StatsModal.tsx";
import { ProfileStats } from "@shared/game.js";
import getApi from "../../api/axios.ts";
import AverageScoreChartModal from "./components/AvgScoreModal.tsx";
import { useSidebarItems } from "../../hooks/useSidebarItems.ts";

const Stats: React.FC = () => {
  const user = useUser();

  const sidebarItems = useSidebarItems();

  const [showModal, setShowModal] = useState(false);
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const [showChartModal, setShowChartModal] = useState(false);
  const openChartModal = () => setShowChartModal(true);
  const closeChartModal = () => setShowChartModal(false);

  const [profileStats, setProfileStats] = useState<ProfileStats>({
    rankingPlaces: [],
    gamesPlayed: 0,
    totalScore: 0,
    averageScore: 0,
    maxScore: 0,
  });
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
      <Meta title={"Statystyki"} />
      <Breadcrumb title="Statystyki" />
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
            </div>
            <div className={styles.singleRanking}>
              <div className={styles.titleAndNumber}>
                <div>Liczba zdobytych punktów</div>
                <div>{profileStats.totalScore || 0}</div>
              </div>
            </div>
            <div className={styles.singleRanking}>
              <div className={styles.titleAndNumber}>
                <div>Średnia liczba punktów na grę</div>
                <div>{profileStats.averageScore || 0}</div>
              </div>
            </div>
            <div className={styles.singleRanking}>
              <div className={styles.titleAndNumber}>
                <div>Największa liczba punktów w grze</div>
                <div>{profileStats.maxScore || 0}</div>
              </div>
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
              <button className={styles.rankingButton} onClick={openChartModal}>
                Wykres punktów
              </button>
              <AverageScoreChartModal
                show={showChartModal}
                handleClose={closeChartModal}
                userId={user?.id}
              />{" "}
            </div>
          </div>
        </MainBox>
      </MainContainer>
    </>
  );
};

export default Stats;
