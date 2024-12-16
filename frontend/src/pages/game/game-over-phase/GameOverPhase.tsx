import { useUser } from "../../../store/userSlice.ts";
import { useSocket } from "../../../socket/useSocket.ts";
import { useDispatch } from "react-redux";
import { gameActions, useGame } from "../../../store/gameSlice.ts";
import styles from "../leaderboard-phase/Leaderboard.module.scss";
import Meta from "../../../components/main-components/Meta.tsx";
import MainContainer from "../../../components/main-components/MainContainer.tsx";
import MainBox from "../../../components/main-components/MainBox.tsx";
import MainTitle from "../../../components/main-components/MainTitle.tsx";
import { Breadcrumb } from "react-bootstrap";
import { PiMedalFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { setInQueue } from "../../../store/queueSlice.ts";
import { toast } from "react-toastify";

export default function GameOverPhase() {
  const user = useUser();
  const socket = useSocket();
  const dispatch = useDispatch();
  const game = useGame();
  const navigate = useNavigate();
  // Znalezienie gracza z największą liczbą punktów
  const winners = game?.winners ?? [];

  function leaveGame() {
    socket.emit("leave_game");
    dispatch(gameActions.setGame(null));
    navigate("/");
  }

  function playAgain() {
    if (game?.gameType !== "matchmaking") {
      socket.emit("play_again", () => {
        navigate(`/waiting-room`);
      });
    } else {
      socket.emit("join_queue", (gameId: string) => {
        if (gameId === "NO_GAME") {
          dispatch(setInQueue(true));
          toast.info("Dołączono do kolejki");
        }
      });
      dispatch(gameActions.setGame(null));
      navigate(`/`);
    }
  }

  return (
    <div>
      <Meta title={"Ranking"} />
      <Breadcrumb title="Ranking" />
      <MainContainer>
        <MainBox>
          <MainTitle>Tablica Wyników</MainTitle>
          <div className={styles.playersBox}>
            {game?.players && game.players.length > 0 ? (
              game.players.map((player, index) => (
                <div
                  key={player.username}
                  className={`${styles.singlePlayer} ${player.username === user.username ? styles.currentPlayer : ""}`}
                >
                  <div>
                    {index + 1}. {player.username}
                    {winners.includes(player?.username ?? "") && (
                      <PiMedalFill
                        style={{ color: "gold", marginLeft: "8px" }}
                        className={styles.medal}
                      />
                    )}
                  </div>
                  <div className={styles.points}>{player.score} pkt</div>
                </div>
              ))
            ) : (
              <p>Brak graczy</p>
            )}
          </div>
          <div className={styles.buttons}>
            {game?.owner?.username === user.username ||
            game?.gameType === "matchmaking" ? (
              <button className={styles.playButton} onClick={playAgain}>
                Zagraj ponownie
              </button>
            ) : null}
            <button className={styles.cancelButton} onClick={leaveGame}>
              Opuść grę
            </button>
          </div>
        </MainBox>
      </MainContainer>
    </div>
  );
}
