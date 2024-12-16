import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/main-components/sidebar/SideBar.tsx";
import Meta from "../../../components/main-components/Meta.tsx";
import { Breadcrumb, OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from "./WaitingRoom.module.scss";
import { LuCrown } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { State } from "../../../store";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../../socket/useSocket.ts";
import { IoMdArrowUp } from "react-icons/io";
import { GameState, useGame } from "../../../store/gameSlice.ts";
import { UserState } from "../../../store/userSlice.ts";
import { FaCheck, FaLink, FaUser } from "react-icons/fa6";
import MainContainer from "../../../components/main-components/MainContainer.tsx";
import MainBox from "../../../components/main-components/MainBox.tsx";
import MainTitle from "../../../components/main-components/MainTitle.tsx";
import TimeBar from "../components/time-bar/TimeBar.tsx";
import useProfileModal from "../../../hooks/profile-modal/useProfileModal.ts";
import ConfirmationModal from "../../../components/main-components/ConfirmationModal.tsx";
import InviteModal from "./game-invite/InviteModal.tsx";
import { useGameSidebarItems } from "../../../hooks/useSidebarItems.ts";

const WaitingRoom: React.FC = () => {
  const sidebarItems = useGameSidebarItems(openInviteModal)

  const game: GameState = useSelector((state: State) => state.game);
  const user: UserState = useSelector((state: State) => state.user);
  const navigate = useNavigate();
  const socket = useSocket();
  const { showModal: showProfileModal } = useProfileModal();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);

  function openInviteModal() {
    setShowInviteModal(true);
  }

  function closeInviteModal() {
    setShowInviteModal(false);
  }

  useEffect(() => {
    if (!game || game.status !== "waiting_for_players") {
      navigate("/");
    }
  }, [game]);

  if (!game) return null;

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

  return (
    <>
      <Meta title={"Poczekalnia"}/>
      <Breadcrumb title="Poczekalnia"/>
      <Sidebar items={sidebarItems}/>
      <MainContainer className={styles.sidebarContainer}>
        <MainBox before={game?.owner == null && <TimeBar/>}>
          <MainTitle>Poczekalnia</MainTitle>
          <GameCode/>
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
                      <div>
                        {game.owner && user.username === game.owner?.username && (
                          <>
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
                          </>
                        )}

                        {player?.id && (
                          <button
                            className={styles.showProfileBtn}
                            onClick={() => showProfileModal(player.id)}
                          >
                            <FaUser className={styles.playerAction}/>
                          </button>
                        )}
                      </div>
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
      <ConfirmationModal
        show={showConfirmModal}
        setShow={setShowConfirmModal}
        onConfirm={confirmGiveOwner}
        confirmText={"Tak, zmień właściciela"}
        title={"Zmiana właściciela"}
      >
        Czy na pewno chcesz zmienić właściciela pokoju na {selectedPlayer}?
      </ConfirmationModal>
      <InviteModal show={showInviteModal} onClose={closeInviteModal}/>
    </>
  );
};

function GameCode() {
  const game = useGame();
  const [copyAnimationStage, setCopyAnimationStage] = useState(
    "none" as "none" | "copying" | "copied" | "ending"
  );

  if (game?.gameType != "multiplayer")
    return null;

  async function copyId() {
    const id = game?.id;
    if (!id || copyAnimationStage !== "none") {
      return;
    }
    const protocol = window.location.protocol;
    const fromURL = window.location.host;

    await navigator.clipboard?.writeText(
      `${protocol}//${fromURL}/join-game?code=${id}`
    );

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

  function renderTooltip(props: object) {
    return (
      <Tooltip id="button-tooltip" {...props}>
        Kliknij, aby skopiować link do pokoju
      </Tooltip>
    );
  }

  return (
    <>
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
    </>
  )
}

export default WaitingRoom;
