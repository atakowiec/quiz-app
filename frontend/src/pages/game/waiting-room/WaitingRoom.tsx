import React, { useEffect, useState } from "react";
import Sidebar, { SidebarItem } from "../../../components/SideBar.tsx";
import { IoHomeSharp, IoSettingsSharp } from "react-icons/io5";
import Meta from "../../../components/Meta.tsx";
import {
  Breadcrumb,
  Button,
  Container,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import styles from "./WaitingRoom.module.scss";
import { LuCrown } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { State } from "../../../store";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../../socket/useSocket.ts";
import { IoMdArrowUp } from "react-icons/io";
import { GameState } from "../../../store/gameSlice.ts";
import { UserState } from "../../../store/userSlice.ts";
import { FaCheck, FaLink } from "react-icons/fa6";

const WaitingRoom: React.FC = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: IoHomeSharp, label: "Powrót", href: "/" },
    { icon: IoSettingsSharp, label: "Ustawienia", href: "/settings" },
  ];
  const [copyAnimationStage, setCopyAnimationStage] = useState(
    "none" as "none" | "copying" | "copied" | "ending"
  );

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

  function copyId() {
    const id = game?.id;
    if (!id || copyAnimationStage !== "none") {
      return;
    }

    navigator.clipboard.writeText(`http://localhost:5173/join-game?code=${id}`);

    setCopyAnimationStage("copying");

    setTimeout(() => {
      setCopyAnimationStage("copied");
    }, 300);

    setTimeout(() => {
      setCopyAnimationStage("ending");
    }, 2000);

    setTimeout(() => {
      setCopyAnimationStage("none");
    }, 2300);
  }

  function renderTooltip(props: any) {
    return (
      <Tooltip id="button-tooltip" {...props}>
        Kliknij, aby skopiować link do pokoju
      </Tooltip>
    );
  }

  console.log(user);

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
              <div className={`${styles.code} ${styles[copyAnimationStage]}`}>
                {["ending", "copied"].includes(copyAnimationStage) ? (
                  <>
                    <FaCheck /> Skopiowano!
                  </>
                ) : (
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                  >
                    <span onClick={copyId}>
                      Kod: {game?.id} <FaLink />
                    </span>
                  </OverlayTrigger>
                )}
              </div>
              <hr className={styles.line} />
              <div className={styles.playersBox}>
                <div className={styles.singlePlayer}>
                  <span
                    className={
                      game?.owner.username === user.username
                        ? styles.currentPlayer
                        : ""
                    }
                  >
                    {game?.owner.username}
                  </span>
                  <LuCrown className={styles.playerAction} />
                </div>
                {game?.players && game.players.length > 0 && (
                  <>
                    {game.players
                      .filter((player) => !player.owner)
                      .map((player) => (
                        <div
                          className={styles.singlePlayer}
                          key={player.username}
                        >
                          <span
                            className={
                              player.username === user.username
                                ? styles.currentPlayer
                                : ""
                            }
                          >
                            {player.username}
                          </span>
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