import React from "react";
import Meta from "../components/Meta";
import { Breadcrumb, Container } from "react-bootstrap";
import Sidebar, { SidebarItem } from "../components/SideBar";
import { FaGamepad, FaPlay } from "react-icons/fa";
import { IoStatsChartSharp } from "react-icons/io5";
import styles from "../styles/Home.module.scss";
import { IoIosAddCircleOutline } from "react-icons/io";

const Home: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: IoIosAddCircleOutline, label: "Stwórz Grę", href: "/create-game" },
    { icon: FaPlay, label: "Dołącz do gry", href: "/join-game" },
    { icon: FaGamepad, label: "Historia Gier", href: "/games" },
    { icon: IoStatsChartSharp, label: "Statystyki", href: "/stats" },
  ];
  return (
    <>
      <Meta title={"Stwórz grę"} />
      <Breadcrumb title="Stwórz grę" />
      <Sidebar items={sidebarItems} />
      <Container className={styles.createContainer}>
        <div className="row justify-content-center">
          <div className="col-2">ALALA</div>
        </div>
      </Container>
    </>
  );
};

export default Home;
