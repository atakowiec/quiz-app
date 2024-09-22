import { Container } from "react-bootstrap";
import TimeBar from "../../components/TimeBar.tsx";
import { useGame } from "../../store/gameSlice.ts";

const SelectedCategoryPhase = () => {
  const game = useGame();

  if(game?.round?.category == null)
    return null;

  // todo entire component
  return (
    <div>
      <Container>
        <h1>Selected Category</h1>
        <p>
          {game.round.category.name}
        </p>
        <ul>
          {Array.from({length: game.settings.number_of_questions_per_round }, (_, i) => i).map((i) => {
            const history = game.answersHistory;
            const answered = history.length > i;

            return (
              <li key={i}>
                Question - {answered ? history[i] ? "git" : "niegit" : "-"}
              </li>
            )
          })}
        </ul>
      </Container>
      <TimeBar/>
    </div>
  );
}

export default SelectedCategoryPhase;