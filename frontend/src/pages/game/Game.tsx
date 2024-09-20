import { GameState } from "../../store/gameSlice.ts";
import { State } from "../../store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Game() {
  const game = useSelector<State, GameState>((state) => state.game);
  const navigate = useNavigate();
  const shouldRedirect = !game?.status || game.status === "waiting_for_players";

  useEffect(() => {
    if(shouldRedirect) {
      toast.error("Nie jesteś w grze lub gra nie została jeszcze rozpoczęta");
      navigate('/profile');
    }
  }, []);

  if(shouldRedirect) {
    return null;
  }

  return <>game</>
}