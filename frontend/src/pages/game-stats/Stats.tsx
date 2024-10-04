import React from "react";
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

  return (
    <>
      <Meta title={"Dołącz do gry"} />
      <Breadcrumb title="Dołącz do gry" />
      <Sidebar items={sidebarItems} />
      <MainContainer className={styles.sidebarContainer}>
        <MainBox>
          <MainTitle>Statystyki</MainTitle>
          <div className={styles.statsBox}>
            <RankingVisualization />
            <div className={styles.singleRanking}>
              <div className={styles.titleAndNumber}>
                <div>Liczba zagranych gier</div>
                <div>332</div>
              </div>
              <button className={styles.rankingIcon}>
                <IoIosStats />
              </button>
            </div>
            <div className={styles.singleRanking}>
              <div className={styles.titleAndNumber}>
                <div>Liczba zdobytych punktów</div>
                <div>4 442</div>
              </div>
              <button className={styles.rankingIcon}>
                <IoIosStats />
              </button>
            </div>
            <div className={styles.singleRanking}>
              <div className={styles.titleAndNumber}>
                <div>Średnia liczba punktów na grę</div>
                <div>55.3</div>
              </div>
              <button className={styles.rankingIcon}>
                <IoIosStats />
              </button>
            </div>
            <div className={styles.singleRanking}>
              <div className={styles.titleAndNumber}>
                <div>Największa liczba punktów w grze</div>
                <div>322</div>
              </div>
              <button className={styles.rankingIcon}>
                <IoIosStats />
              </button>
            </div>
            <div className={styles.rankingButtons}>
              <button className={styles.rankingButton}>
                Statystyki kategorii
              </button>
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
