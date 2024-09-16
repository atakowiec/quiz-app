export type GameStatus =
  | "waiting_for_players"
  | "voting_phase"
  | "question_phase"
  | "game_over";
export type HelperType = "fifty_fifty" | "extend_time" | "cheat_from_others";

export type Category = {
  id: number;
  name: string;
  description: string;
};

export type Answer = {
  questionId?: number;
  text: string;
  distractionId?: number;
};

export interface IGameMember {
  nickname: string;
  owner: boolean;
  score: number;
  available_helpers: HelperType[];
  choosen_category: Category;
  choosen_answer: Answer;
  is_answer_correct: boolean;
  hidden_answers: Answer[];
  are_all_answers_hidden: boolean;
  time_to_answer: number;
}

export interface GameSettings {
  number_of_rounds: number;
  number_of_questions_per_round: number;
  number_of_categories_per_voting: number;
  category_whitelist?: Category[];
  time_for_answer: number;
  helpers_whitelist?: HelperType[];
  max_number_of_players: number;
}

export type SettingType = keyof GameSettings;

export interface IGamePacket {
  status: GameStatus;
  settings: GameSettings;
  owner: IGameMember;
  players?: Partial<IGameMember>[];
  winner?: Partial<IGameMember>;
}
