import React from "react";
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

const History: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: IoIosAddCircleOutline, label: "Stwórz Grę", href: "/create-game" },
    { icon: IoIosPlay, label: "Dołącz do gry", href: "/join-game" },
    { icon: IoLogoGameControllerB, label: "Historia Gier", href: "/history" },
    { icon: IoStatsChartSharp, label: "Statystyki", href: "/stats" },
  ];

  return (
    <>
      <Meta title={"Historia Gier"} />
      <Breadcrumb title="Historia Gier" />
      <Sidebar items={sidebarItems} />
      <MainContainer>
        <MainBox>
          <MainTitle>Historia Gier</MainTitle>
          <div className={styles.gameHistoryBox}>
            <div className={styles.titleRow}>
              <div className={styles.leftTitles}>
                <div>Data</div>
                <div>Miejsce</div>
              </div>
              <div className={styles.rightTitles}>
                <div>Tryb</div>
                <div>Punkty</div>
              </div>
            </div>
            <hr className={styles.line} />
            <div className={styles.grayHistoryBox}>
              <div className={styles.singleHistory}>
                <div className={styles.leftTitles}>
                  <div>12.12.2021</div>
                  <div>3.</div>
                </div>
                <div className={styles.rightTitles}>
                  <div>Wieloosobowy</div>
                  <div>540</div>
                </div>
              </div>
            </div>
          </div>
        </MainBox>
      </MainContainer>
    </>
  );
};

export default History;
