import { Breadcrumb, Button } from "react-bootstrap";
import MainContainer from "../../../components/MainContainer.tsx";
import TimeBar from "../components/time-bar/TimeBar.tsx";
import Meta from "../../../components/Meta.tsx";
import MainBox from "../../../components/MainBox.tsx";
import MainTitle from "../../../components/MainTitle.tsx";
import styles from "./Leaderboard.module.scss";
import { useSelector } from "react-redux";
import { GameState } from "../../../store/gameSlice.ts";
import { State } from "../../../store";
import { UserState } from "../../../store/userSlice.ts";
import { PiMedalFill } from "react-icons/pi";
import { FaRegEye } from "react-icons/fa";
import { MdOutlineMoreTime } from "react-icons/md";
import { MdQueryStats } from "react-icons/md";
import { HelperType } from "@shared/game";

const allHelpers: { type: HelperType; icon: React.ElementType }[] = [
  { type: "cheat_from_others", icon: FaRegEye },
  { type: "extend_time", icon: MdOutlineMoreTime },
  { type: "fifty_fifty", icon: MdQueryStats },
];

const LeaderboardPhase = () => {
  const game: GameState = useSelector((state: State) => state.game);
  const user: UserState = useSelector((state: State) => state.user);

  // Znalezienie gracza z największą liczbą punktów
  const topPlayer = game?.players?.length
    ? game.players.reduce((prevPlayer, currentPlayer) => {
        const prevScore = prevPlayer.score ?? 0;
        const currentScore = currentPlayer.score ?? 0;
        return currentScore > prevScore ? currentPlayer : prevPlayer;
      }, game.players[0])
    : null;

  return (
    <div>
      <Meta title={"Leaderboard"} />
      <Breadcrumb title="Leaderboard" />
      <MainContainer>
        <MainBox before={<TimeBar />}>
          <MainTitle>Tablica Wyników</MainTitle>
          <hr className={styles.line} />
          <div className={styles.playersBox}>
            {game?.players && game.players.length > 0 ? (
              game.players.map((player, index) => (
                <div
                  className={`${styles.singlePlayer} ${player.username === user.username ? styles.currentPlayer : ""}`}
                >
                  <div>
                    {index + 1}. {player.username}
                    {player.username === topPlayer?.username && (
                      <PiMedalFill
                        style={{ color: "gold", marginLeft: "8px" }}
                        className={styles.medal}
                      />
                    )}
                  </div>

                  <div className={styles.helpersPoints}>
                    <div className={styles.usedHelpers}>
                      {allHelpers
                        .filter(
                          (helper) =>
                            !player.availableHelpers?.includes(helper.type)
                        )
                        .map((helper) => {
                          const HelperIcon = helper.icon;
                          return (
                            <HelperIcon
                              key={helper.type}
                              className={styles.helperIcon}
                              title={`Użyto ${helper.type}`}
                            />
                          );
                        })}
                    </div>{" "}
                    <div className={styles.points}>{player.score} pkt</div>
                  </div>
                </div>
              ))
            ) : (
              <p>Brak graczy</p>
            )}
          </div>
          <div className={styles.buttons}>
            <button className={styles.playButton}>Zagraj ponownie</button>
            <button className={styles.cancelButton}>Opuść grę</button>
          </div>
        </MainBox>
      </MainContainer>
    </div>
  );
};

export default LeaderboardPhase;
