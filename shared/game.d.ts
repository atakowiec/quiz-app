export type GameStatus =
  | "waiting_for_players"
  | "voting_phase"
  | "selected_category_phase"
  | "question_phase"
  | "question_result_phase"
  | "leaderboard";
export type HelperType = "fifty_fifty" | "extend_time" | "cheat_from_others";

export type GameType = "single" | "multi" | "ranked";

/**
 * Represents a category object that is sent to the client
 */
export interface ICategory {
  id: number;
  name: string;
  description?: string;
  img?: string;
}

/**
 * Represents a question object that is sent to the client
 */
export interface IQuestion {
  text: string;
  answers: IAnswer[];
}

/**
 * Represents an answer object that is sent to the client - without the correct flag
 */
export type IAnswer = string;
/**
 * Represents a game member object that is sent to the client
 */
export interface IGameMember {
  username: string;
  owner: boolean;
  score: number;
  availableHelpers: HelperType[];
  chosenCategory: number;
  chosenAnswer: IAnswer;
  hiddenAnswers: IAnswer[];
  areAllAnswersHidden: boolean;
  answerEndTime: number;
}

export interface GameSettings {
  number_of_rounds: number;
  number_of_questions_per_round: number;
  number_of_categories_per_voting: number;
  category_whitelist?: number[];
  time_for_answer: number;
  helpers_whitelist?: HelperType[];
  max_number_of_players: number;
}

export type SettingType = keyof GameSettings;

export interface IGamePacket {
  id: string;
  status: GameStatus;
  gameType: GameType;
  settings: GameSettings;
  round?: GameRoundPacket;
  owner: IGameMember;
  player: IGameMember;
  players?: Partial<IGameMember>[];
  winner?: Partial<IGameMember>;
}

export interface GameUpdatePacket {
  status?: GameStatus;
  owner?: Partial<IGameMember>;
  player?: Partial<IGameMember>;
  round?: GameRoundPacket;
  players?: Partial<IGameMember>[];
  winner?: Partial<IGameMember>;
  settings?: Partial<GameSettings>;
}

/**
 * Holds volatile informaction strictly about the game round
 */
export interface GameRoundPacket {
  categories?: ICategory[];
  category?: ICategory;
  question?: IQuestion;
  timerEnd?: number;
}
