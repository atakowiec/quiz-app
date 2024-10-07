import { useEffect } from "react";
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
    if (!user.loggedIn) socket.disconnect();
    navigate("/");
  }

  useEffect(() => {
    console.log(user);
    console.log(game);
    console.log(winners);
    if (!user.loggedIn) {
      getApi()
        .post("/auth/logout")
        .then(() => {
          dispatch(userActions.setUser(null));
          socket.disconnect();
        });
    }
  }, []);
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
            <button className={styles.playButton}>Zagraj ponownie</button>
            <button className={styles.cancelButton} onClick={leaveGame}>
              Opuść grę
            </button>
          </div>
        </MainBox>
      </MainContainer>
    </div>
  );
}
