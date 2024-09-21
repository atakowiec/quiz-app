import { GameState } from "../../store/gameSlice.ts";
import { State } from "../../store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import CategoryVotingPhase from "./CategoryVotingPhase.tsx";
import SelectedCategoryPhase from "./SelectedCategoryPhase.tsx";
import QuestionPhase from "./QuestionPhase.tsx";
import LeaderboardPhase from "./LeaderboardPhase.tsx";

export default function Game() {
  const game = useSelector<State, GameState>((state) => state.game);
  const navigate = useNavigate();
  const shouldRedirect = !game?.status || game.status === "waiting_for_players";

  useEffect(() => {
    if (shouldRedirect) {
      toast.error("Nie jesteś w grze lub gra nie została jeszcze rozpoczęta");
      navigate('/profile');
    }
  }, []);

  if (shouldRedirect) {
    return null;
  }

  // todo some better handling of switching between phases, add some slide in/out animations
  switch (game.status) {
    case "voting_phase":
      return <CategoryVotingPhase/>;
    case "selected_category_phase":
      return <SelectedCategoryPhase/>;
    case "question_phase":
    case "question_result_phase":
      return <QuestionPhase/>
    case "leaderboard":
      return <LeaderboardPhase/>;
  }
}