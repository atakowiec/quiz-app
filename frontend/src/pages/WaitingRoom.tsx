import React, { useEffect } from "react";
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
import { useSelector } from "react-redux";
import { State } from "../store";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../socket/useSocket";

const WaitingRoom: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: IoHomeSharp, label: "Powrót", href: "/lobby" },
    { icon: IoSettingsSharp, label: "Ustawienia", href: "/settings" },
    { icon: IoPaperPlaneSharp, label: "Statystyki", href: "/stats" },
  ];
  const game = useSelector((state: State) => state.game);
  const navigate = useNavigate();
  const socket = useSocket();

  //TODO: make settings for an owner of the room
  //TODO: make invite link/ player
  //TODO: make player unable to join the same game twice and more

  function leaveGame() {
    socket.emit("leave_game");
  }

  useEffect(() => {
    if (!game) {
      navigate("/profile");
    } else if (game.status !== "waiting_for_players") {
      navigate(`/profile`);
    }
  }, [game]);
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
              <div className={styles.code}>Kod: {game?.id}</div>
              <hr className={styles.line} />
              <div className={styles.playersBox}>
                <div className={styles.singlePlayer}>
                  {game?.owner.username}{" "}
                  <LuCrown className={styles.playerAction} />
                </div>
                {game?.players && game.players.length > 0 && (
                  <>
                    {game.players.map((player) => (
                      <div
                        className={styles.singlePlayer}
                        key={player.username}
                      >
                        {player.username}
                        <RxCross2 className={styles.playerAction} />
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className={styles.actionButtons}>
                <div className={styles.buttonStart}>Rozpocznij grę</div>
                <div className={styles.buttonLeave} onClick={leaveGame}>
                  Opuść grę
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default WaitingRoom;
