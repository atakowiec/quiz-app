import { GameState } from "../../store/gameSlice.ts";
import { State } from "../../store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CategoryVotingPhase from "./category-phase/CategoryVotingPhase.tsx";
import SelectedCategoryPhase from "./category-phase/SelectedCategoryPhase.tsx";
import QuestionPhase from "./question-phase/QuestionPhase.tsx";
import LeaderboardPhase from "./leaderboard-phase/LeaderboardPhase.tsx";
import GameOverPhase from "./game-over-phase/GameOverPhase.tsx";
import GameAnimatedWrapper from "./components/animated-wrapper/GameAnimatedWrapper.tsx";
import LeaveGameButton from "./components/leave-game-button/LeaveGameButton.tsx";

export default function Game() {
  const game = useSelector<State, GameState>((state) => state.game);
  const navigate = useNavigate();
  const shouldRedirect = !game?.status || game.status === "waiting_for_players";

  useEffect(() => {
    if (shouldRedirect) {
      navigate("/");
    }
  }, []);

  if (shouldRedirect) {
    return null;
  }

  const simplifiedStatus =
    game?.status === "question_result_phase" ? "question_phase" : game?.status;

  function renderView() {
    if (!game?.status) return null;

    switch (game.status) {
      case "voting_phase":
        return <CategoryVotingPhase />;
      case "selected_category_phase":
        return <SelectedCategoryPhase />;
      case "question_phase":
      case "question_result_phase":
        return <QuestionPhase />;
      case "leaderboard":
        return <LeaderboardPhase />;
      case "game_over":
        return <GameOverPhase />;
    }
  }

  return (
    <>
      <GameAnimatedWrapper keyProp={simplifiedStatus}>
        {renderView()}
      </GameAnimatedWrapper>
      <LeaveGameButton />
    </>
  );
}
