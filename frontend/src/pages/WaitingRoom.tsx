import React from "react";
import Sidebar, { SidebarItem } from "../components/SideBar";
import {
  IoHomeSharp,
  IoSettingsSharp,
  IoPaperPlaneSharp,
} from "react-icons/io5";
import Meta from "../components/Meta";
import { Breadcrumb, Container } from "react-bootstrap";
import styles from "../styles/WaitingRoom.module.scss";
import { LuCrown } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";

const WaitingRoom: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: IoHomeSharp, label: "Powrót", href: "/lobby" },
    { icon: IoSettingsSharp, label: "Ustawienia", href: "/settings" },
    { icon: IoPaperPlaneSharp, label: "Statystyki", href: "/stats" },
  ];

  //TODO: make settings for an owner of the room
  //TODO: make invite link/ player
  return (
    <>
      <Meta title={"Poczekalnia"} />
      <Breadcrumb title="Poczekalnia" />
      <Sidebar items={sidebarItems} />
      <Container className={styles.queueContainer}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">
            <div className={styles.queueBox}>
              <div className={styles.queueText}>Poczekalnia</div>
              <div className={styles.code}>Kod: abc</div>
              <hr className={styles.line} />
              <div className={styles.playersBox}>
                <div className={styles.singlePlayer}>
                  Player1 <LuCrown className={styles.playerAction} />
                </div>
                <div className={styles.singlePlayer}>
                  Player2
                  <RxCross2 className={styles.playerAction} />
                </div>
                <div className={styles.singlePlayer}>
                  Player3
                  <RxCross2 className={styles.playerAction} />
                </div>
                <div className={styles.singlePlayer}>
                  Player4
                  <RxCross2 className={styles.playerAction} />
                </div>
              </div>
              <div className={styles.actionButtons}>
                <div className={styles.buttonStart}>Rozpocznij grę</div>
                <div className={styles.buttonLeave}>Opuść grę</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default WaitingRoom;
