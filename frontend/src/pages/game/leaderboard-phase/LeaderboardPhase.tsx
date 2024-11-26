import { Breadcrumb } from "react-bootstrap";
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
import { ElementType } from "react";

const allHelpers: { type: HelperType; icon: ElementType }[] = [
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

  const topPlayers = game?.players?.filter(
    (player) => (player.score ?? 0) === topPlayer?.score
  );

  const topPlayersUsernames = topPlayers?.map((player) => player.username);

  return (
    <div>
      <Meta title={"Leaderboard"} />
      <Breadcrumb title="Leaderboard" />
      <MainContainer>
        <div className={styles.boxWithTimebar}>
          <MainBox before={<TimeBar />} className={styles.time}>
            <MainTitle>Tablica Wyników</MainTitle>
            <div className={styles.playersBox}>
              {game?.players && game.players.length > 0 ? (
                game.players.map((player, index) => (
                  <div
                    className={`${styles.singlePlayer} ${player.username === user.username ? styles.currentPlayer : ""}`}
                  >
                    <div>
                      {index + 1}. {player.username}
                      {topPlayersUsernames?.includes(player.username) && (
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
          </MainBox>
        </div>
      </MainContainer>
    </div>
  );
};

export default LeaderboardPhase;
