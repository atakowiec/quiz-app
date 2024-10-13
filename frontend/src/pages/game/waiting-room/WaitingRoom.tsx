import React, { useEffect, useState } from "react";
import Sidebar, { SidebarItem } from "../../../components/SideBar.tsx";
import { IoHomeSharp, IoSettingsSharp } from "react-icons/io5";
import Meta from "../../../components/Meta.tsx";
import {
  Breadcrumb,
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
import { FaCheck, FaLink, FaUser } from "react-icons/fa6";
import MainContainer from "../../../components/MainContainer.tsx";
import MainBox from "../../../components/MainBox.tsx";
import MainTitle from "../../../components/MainTitle.tsx";
import TimeBar from "../components/time-bar/TimeBar.tsx";
import useProfileModal from "../../../hooks/profile-modal/useProfileModal.ts";
import ConfirmationModal from "../../../components/ConfirmationModal.tsx";

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
  const { showModal: showProfileModal } = useProfileModal();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

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
    setShowConfirmModal(true);
  }

  function confirmGiveOwner() {
    if (selectedPlayer) {
      giveOwner(selectedPlayer);
    }
    setShowConfirmModal(false);
  }

  async function copyId() {
    const id = game?.id;
    if (!id || copyAnimationStage !== "none") {
      return;
    }

    await navigator.clipboard.writeText(
      `http://localhost:5173/join-game?code=${id}`
    ); // todo change to production url some day

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

  return (
    <>
      <Meta title={"Poczekalnia"}/>
      <Breadcrumb title="Poczekalnia"/>
      <Sidebar items={sidebarItems}/>
      <MainContainer className={styles.sidebarContainer}>
        <MainBox before={game?.owner == null && <TimeBar/>}>
          <MainTitle>Poczekalnia</MainTitle>
          <div className={`${styles.code} ${styles[copyAnimationStage]}`}>
            {["ending", "copied"].includes(copyAnimationStage) ? (
              <>
                <FaCheck/> Skopiowano!
              </>
            ) : (
              <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
              >
                <span onClick={copyId}>
                  Kod: {game?.id} <FaLink/>
                </span>
              </OverlayTrigger>
            )}
          </div>
          <hr className={styles.line}/>
          <div className={styles.playersBox}>
            {game?.owner && game?.owner?.username && (
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
                <div>
                  <LuCrown className={styles.playerAction}/>

                  {game.owner?.id && (
                    <button
                      className={styles.showProfileBtn}
                      onClick={() => showProfileModal(game.owner?.id)}
                    >
                      <FaUser className={styles.playerAction}/>
                    </button>
                  )}
                </div>
              </div>
            )}
            {game?.players && game.players.length > 0 && (
              <>
                {game.players
                  .filter((player) => !player.owner)
                  .map((player) => (
                    <div className={styles.singlePlayer} key={player.username}>
                      <span
                        className={
                          player.username === user.username
                            ? styles.currentPlayer
                            : ""
                        }
                      >
                        {player.username}
                      </span>
                      {game.owner && user.username === game.owner?.username && (
                        <div>
                          <button
                            className={styles.giveBtn}
                            onClick={() =>
                              handleGiveOwnerClick(player.username!)
                            }
                          >
                            <IoMdArrowUp className={styles.playerAction2}/>
                          </button>

                          <button
                            className={styles.kickBtn}
                            onClick={() => kickPlayer(player.username!)}
                          >
                            <RxCross2 className={styles.playerAction}/>
                          </button>

                          {player?.id && (
                            <button
                              className={styles.showProfileBtn}
                              onClick={() => showProfileModal(player.id)}
                            >
                              <FaUser className={styles.playerAction}/>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </>
            )}
          </div>
          <div className={styles.actionButtons}>
            {game?.owner && user.username === game.owner?.username && (
              <div className={styles.buttonStart} onClick={startGame}>
                Rozpocznij grę
              </div>
            )}

            <div className={styles.buttonLeave} onClick={leaveGame}>
              Opuść grę
            </div>
          </div>
        </MainBox>
      </MainContainer>
      <ConfirmationModal show={showConfirmModal}
                         setShow={setShowConfirmModal}
                         onConfirm={confirmGiveOwner}
                         confirmText={"Tak, zmień właściciela"}
                         title={"Zmiana właściciela"}>
        Czy na pewno chcesz zmienić właściciela pokoju na {selectedPlayer}?
      </ConfirmationModal>
    </>
  );
};

export default WaitingRoom;
