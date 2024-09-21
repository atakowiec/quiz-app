import React, { useEffect, useState } from "react";
import Sidebar, { SidebarItem } from "../components/SideBar";
import { IoHomeSharp, IoSettingsSharp } from "react-icons/io5";
import Meta from "../components/Meta";
import { Breadcrumb, Button, Container, Modal } from "react-bootstrap";
import styles from "../styles/WaitingRoom.module.scss";
import { LuCrown } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { State } from "../store";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../socket/useSocket";
import { IoMdArrowUp } from "react-icons/io";
import { GameState } from "../store/gameSlice.ts";
import { UserState } from "../store/userSlice.ts";

const WaitingRoom: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: IoHomeSharp, label: "Powrót", href: "/" },
    { icon: IoSettingsSharp, label: "Ustawienia", href: "/settings" },
  ];
  const game: GameState = useSelector((state: State) => state.game);
  const user: UserState = useSelector((state: State) => state.user);
  const navigate = useNavigate();
  const socket = useSocket();

  const [showModal, setShowModal] = useState(false); // Kontroluje widoczność modala
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null); // Przechowuje wybranego gracza

  useEffect(() => {
    if (!game) {
      navigate("/profile");
    } else if (game.status !== "waiting_for_players") {
      navigate(`/profile`);
    }
  }, [game]);

  if (!game) return null;

  //TODO: make settings for an owner of the room
  //TODO: make invite link/ player
  //TODO: make player unable to join the same game twice and more

  function leaveGame() {
    socket.emit("leave_game");
  }

  function kickPlayer(username: string) {
    socket.emit("kick", username);
  }

  function giveOwner(username: string) {
    socket.emit("give_owner", username);
  }

  function startGame() {
    socket.emit("start_game");
  }

  function handleGiveOwnerClick(playerUsername: string) {
    setSelectedPlayer(playerUsername);
    setShowModal(true);
  }

  function confirmGiveOwner() {
    if (selectedPlayer) {
      giveOwner(selectedPlayer);
    }
    setShowModal(false);
  }

  return (
    <>
      <Meta title={"Poczekalnia"} />
      <Breadcrumb title="Poczekalnia" />
      <Sidebar items={sidebarItems} />
      <Container className={styles.mainContainer}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-4">
            <div className={styles.mainBox}>
              <div className={styles.mainText}>Poczekalnia</div>
              <div className={styles.code}>Kod: {game?.id}</div>
              <hr className={styles.line} />
              <div className={styles.playersBox}>
                <div className={styles.singlePlayer}>
                  {game?.owner.username}
                  <LuCrown className={styles.playerAction} />
                </div>
                {game?.players && game.players.length > 0 && (
                  <>
                    {game.players.filter(player => !player.owner).map((player) => (
                      <div
                        className={styles.singlePlayer}
                        key={player.username}
                      >
                        {player.username}
                        {user.username === game.owner.username && (
                          <div>
                            <button
                              className={styles.giveBtn}
                              onClick={() =>
                                handleGiveOwnerClick(player.username!)
                              }
                            >
                              <IoMdArrowUp className={styles.playerAction2} />
                            </button>

                            <button
                              className={styles.kickBtn}
                              onClick={() => kickPlayer(player.username!)}
                            >
                              <RxCross2 className={styles.playerAction} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
              <div className={styles.actionButtons}>
                {user.username === game.owner.username && (
                  <div className={styles.buttonStart} onClick={startGame}>
                    Rozpocznij grę
                  </div>
                )}

                <div className={styles.buttonLeave} onClick={leaveGame}>
                  Opuść grę
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className={styles.modalCenter}
      >
        <Modal.Header closeButton>
          <Modal.Title>Zmiana właściciela pokoju</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Czy na pewno chcesz zmienić właściciela pokoju na {selectedPlayer}?
        </Modal.Body>
        <Modal.Footer className={styles.modalButtons}>
          <Button variant="primary" onClick={confirmGiveOwner}>
            Tak, zmień właściciela
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Anuluj
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WaitingRoom;
