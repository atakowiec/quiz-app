export type GameStatus =
  | "waiting_for_players"
  | "voting_phase"
  | "selected_category_phase"
  | "question_phase"
  | "question_result_phase"
  | "leaderboard"
  | "game_over";
export type HelperType = "fifty_fifty" | "extend_time" | "cheat_from_others";

export type GameType = "singleplayer" | "multiplayer" | "matchmaking";

export type GameId = string;

/**
 * Represents a category object that is sent to the client
 */
export interface ICategory {
  id: number;
  name: string;
  description?: string;
  img?: string;
  isActive?: boolean;
}

export type CategoryId = number;

/**
 * Represents a question object that is sent to the client
 */
export interface IQuestion {
  text: string;
  photo?: string;
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
  id?: number;
  username: string;
  owner: boolean;
  score: number;
  availableHelpers: HelperType[];
  chosenCategory: number;
  chosenAnswer: IAnswer;
  hiddenAnswers: IAnswer[];
  showOtherPlayersAnswers: boolean;
  cheatedAnswers?: IAnswer[];
  iconColor: string;
}

export interface GameSettings {
  number_of_rounds: number;
  number_of_questions_per_round: number;
  number_of_categories_per_voting: number;
  category_whitelist?: CategoryId[];
  time_for_answer: number;
  helpers_whitelist?: HelperType[];
  max_number_of_players: number;
  blackListedHelpers?: HelperType[];
}

/**
 * Represents a packet that stores all the information about the game for the client
 */
export interface IGamePacket {
  id: string;
  status: GameStatus;
  gameType: GameType;
  settings: GameSettings;
  round?: GameRoundPacket;
  answersHistory: boolean[];
  owner?: IGameMember;
  player: IGameMember;
  players?: Partial<IGameMember>[];
  winners?: string[];
  timer?: TimerInfo;
}

/**
 * Represents a packet that is sent to the client to update certain parts of the game state
 */
export interface GameUpdatePacket {
  status?: GameStatus;
  owner?: Partial<IGameMember>;
  player?: Partial<IGameMember>;
  round?: GameRoundPacket;
  answersHistory?: boolean[];
  players?: Partial<IGameMember>[];
  winners?: string[];
  settings?: Partial<GameSettings>;
  timer?: TimerInfo;
}

/**
 * Holds volatile informaction strictly about the game round
 */
export interface GameRoundPacket {
  categories?: number[];
  category?: ICategory;
  question?: IQuestion;
  correctAnswer?: IAnswer;
  questionNumber?: number;
}

export interface GameDatabase {
  id: string;
  gameType: string;
  dateTime: Date;
}

export interface UserGameDatabase {
  gameId: string;
  userId: number;
  score: number;
  place: number;
}

export interface UserGameCategoryScoreDatabase {
  userGameGameId: string;
  userGameUserId: number;
  categoryId: number;
  score: number;
}

export interface GameHistoryPlayerItem {
  place: number;
  gameType: string;
  score: number;
  dateTime: Date;
}

export interface ProfileStats {
  gamesPlayed: number;
  firstPlace?: number;
  secondPlace?: number;
  thirdPlace?: number;
  rankingPlaces: RankingPlace[];
  totalScore: number;
  averageScore: number;
  maxScore: number;
}

export interface RankingPlace {
  place: string;
  count: number;
  unit: string;
  percentage: number;
}

export interface CategoryScore {
  category_name: string;
  number: number;
  img?: string;
}

export interface TimerInfo {
  start: number;
  end: number;
  referenceTime: number;
}
