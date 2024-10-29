import { userActions, useUser } from "../../../store/userSlice.ts";
import getApi from "../../../api/axios.ts";
import { useSocket } from "../../../socket/useSocket.ts";
import { useDispatch } from "react-redux";
import { gameActions, useGame } from "../../../store/gameSlice.ts";
import styles from "../leaderboard-phase/Leaderboard.module.scss";
import Meta from "../../../components/Meta.tsx";
import MainContainer from "../../../components/MainContainer.tsx";
import MainBox from "../../../components/MainBox.tsx";
import MainTitle from "../../../components/MainTitle.tsx";
import { Breadcrumb } from "react-bootstrap";
import { PiMedalFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
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
    dispatch(gameActions.setGame(null));
    if (!user.loggedIn) {
      getApi()
        .post("/auth/logout")
        .then(() => {
          dispatch(userActions.setUser(null));
          socket.disconnect();
        });
    }
    navigate("/");
  }
  function playAgain() {
    if (game?.gameType !== "matchmaking") {
      socket.emit("play_again", () => {
        navigate(`/waiting-room`);
      });
    } else {
      dispatch(gameActions.setGame(null));
      toast.promise(
        new Promise<void>((resolve) => {
          socket.emit("join_queue", "matchmaking", () => {
            navigate("/waiting-room");
            resolve();
          });
        }),
        {
          pending: "Dołączanie do kolejki...",
          success: "Dołączono do kolejki!",
          error: "Błąd dołączania do kolejki",
        }
      );
      navigate(`/`);
    }
  }

  return (
    <div>
      <Meta title={"Leaderboard"} />
      <Breadcrumb title="Leaderboard" />
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
              (game?.gameType === "matchmaking" && (
                <button className={styles.playButton} onClick={playAgain}>
                  Zagraj ponownie
                </button>
              ))}
            <button className={styles.cancelButton} onClick={leaveGame}>
              Opuść grę
            </button>
          </div>
        </MainBox>
      </MainContainer>
    </div>
  );
}
