import Game from "./game";
import { GameRoundPacket, IQuestion } from "@shared/game";
import { Question } from "../../questions/entities/question.model";
import { Category } from "../../questions/entities/category.model";
import { ConfigService } from "@nestjs/config";
import { GameMember } from "./game-member";
import { Logger } from "@nestjs/common";

/**
 * Represents a single round in the game - voting, selecting category, question phase
 * One round consists of multiple questions but only one category
 * Game consists of multiple rounds
 */
export default class Round {
  private logger: Logger;
  private configService: ConfigService;
  private game: Game;

  public categories: Category[];
  public questions: Question[];
  public questionIndex: number = -1;

  public chosenCategory?: Category;
  public chosenQuestion?: Question;

  public timeStart: number = -1;
  public timeEnd: number = -1;
  public onTimerEnd?: () => void;

  constructor(game: Game) {
    this.game = game;
    this.configService = game.gameService.configService;
    this.logger = game.logger;
  }

  /**
   * Handles ticking the round timer and every players' timers - in question phase
   */
  public async tick() {
    //this.logger.debug("tick, status: " + this.game.gameStatus);
    if (this.game.gameStatus === "question_phase") {
      // check if every player answered the question - if so, end the question phase
      const time = Date.now();
      const allAnswered = this.game.getAllPlayers().every((player) => {
        return player.chosenAnswer != null || player.answerEndTime <= time;
      });

      if (allAnswered) {
        this.endQuestionPhase();
      }

      return;
    }

    if (this.timeEnd == -1) {
      return;
    }

    if (this.timeEnd > Date.now()) {
      return;
    }

    this.timeEnd = -1;
    this.onTimerEnd?.();
  }

  public setTimer(time: number, callback: () => void) {
    time = parseInt(time.toString());

    this.timeStart = Date.now();
    this.timeEnd = this.timeStart + time * 1000;
    this.onTimerEnd = callback;

    this.logger.debug(
      `Timer set for ${time} seconds, start: ${this.timeStart}, end: ${this.timeEnd}, cb: ${callback}`
    );
  }

  /**
   * Starts the round - voting phase
   */
  public start() {
    this.startVoting();
  }

  /**
   * Starts the voting phase - players choose the category
   */
  public async startVoting() {
    this.logger.debug("Starting voting phase");
    await this.generateCategories();

    this.game.getAllPlayers().forEach((player) => {
      player.chosenCategory = -1;
      player.answersHistory = [];
    });
    this.game.gameStatus = "voting_phase";

    // first set timer, then send game packet - players need to know the time
    this.setTimer(
      this.configService.get("VOTING_TIME"),
      this.endVoting.bind(this)
    );

    this.game.send();
  }

  /**
   * Ends the voting phase - evaluates the chosen category and starts the first selected category phase
   * If no category was chosen randomly select one
   */
  public async endVoting() {
    this.logger.debug("End voting phase");
    this.chosenCategory = this.evaluateChosenCategory();
    this.questions = await this.generateRandomQuestions();

    // when the category is chosen start the selected category phase
    // players see the chosen category and can prepare for the questions
    this.game.gameStatus = "selected_category_phase";
    this.setTimer(
      this.configService.get("SELECTED_CATEGORY_TIME_FIRST"),
      this.startQuestionPhase.bind(this)
    );

    this.game.send();
  }

  /**
   * Starts the question phase - players answer the questions
   */
  public startQuestionPhase() {
    this.logger.debug("Starting question phase");
    // get the next question
    this.chosenQuestion = this.questions[++this.questionIndex];

    // every game member should have its own question object with its own randomized answers
    this.game.getAllPlayers().forEach((player) => {
      player.chosenAnswer = null;
      player.hiddenAnswers = [];
      player.showOtherPlayersAnswers = false;
      player.question = this.getRandomizedIQuestion();
    });

    this.game.gameStatus = "question_phase";

    // we set the timer for each player in the question phase - they have the same time to answer for now
    // the timer for the question phase is handled in the tick method
    this.game.getAllPlayers().forEach((player) => {
      player.timeToAnswer = this.game.settings.time_for_answer;
      player.answerEndTime =
        Date.now() + this.game.settings.time_for_answer * 1000;
      this.timeStart = Date.now();
    });

    this.game.send();
  }

  /**
   * Ends the question phase - shows the results, updates the scores, starts the next selected category phase or ends the round
   */
  public endQuestionPhase() {
    this.logger.debug("End question phase");
    this.game.gameStatus = "question_result_phase";

    // todo calculate the scores
    this.game.getAllPlayers().forEach((player) => {
      const correct = player.chosenAnswer == this.chosenQuestion.correctAnswer;

      if (correct) {
        player.score +=
          100 +
          ((player.answerEndTime - Date.now()) / (player.timeToAnswer * 1000)) *
            100; // todo check if this is correct
        player.score = Math.round(player.score);
      }

      player.answersHistory.push(correct);
    });

    if (
      this.questionIndex ==
      this.game.settings.number_of_questions_per_round - 1
    ) {
      this.setTimer(
        this.configService.get("QUESTION_RESULT_TIME"),
        this.startLeaderboardPhase.bind(this)
      );
    } else {
      this.setTimer(
        this.configService.get("QUESTION_RESULT_TIME"),
        this.startSelectedCategoryPhase.bind(this)
      );
    }
    this.game.send();
  }

  /**
   * Starts the next selected category phase - players see the chosen category
   */
  public startSelectedCategoryPhase() {
    this.logger.debug("Starting selected category phase");
    this.chosenQuestion = null;
    this.game.gameStatus = "selected_category_phase";
    this.setTimer(
      this.configService.get("SELECTED_CATEGORY_TIME"),
      this.startQuestionPhase.bind(this)
    );

    this.game.send();
  }

  /**
   * After all questions are answered, show the leaderboard for a few seconds and start the next round
   */
  private startLeaderboardPhase() {
    this.logger.debug("Starting leaderboard phase");
    this.game.gameStatus = "leaderboard";

    // Fixed time
    this.setTimer(5, this.endRound.bind(this));

    this.game.send();
  }

  private endRound() {
    this.logger.debug("End round");

    if (this.game.roundNumber == this.game.settings.number_of_rounds) {
      this.game.endGame();
      return;
    }
    this.game.nextRound();
  }

  /**
   * Gets the current question as a IQuestion object with randomized answers
   */
  public getRandomizedIQuestion(): IQuestion {
    const answers = [
      ...this.chosenQuestion.distractors.map((answer) => answer.content),
      this.chosenQuestion.correctAnswer,
    ];

    // randomize the answers
    answers.sort(() => Math.random() - 0.5);

    return {
      text: this.chosenQuestion.question,
      photo: this.chosenQuestion.photo,
      answers: answers,
    };
  }

  public evaluateChosenCategory(): Category {
    const votes = new Map<number, number>();

    this.game.getAllPlayers().forEach((player) => {
      if (player.chosenCategory == -1) return;

      if (!votes.has(player.chosenCategory)) {
        votes.set(player.chosenCategory, 1);
      } else {
        votes.set(player.chosenCategory, votes.get(player.chosenCategory) + 1);
      }
    });

    let maxVotes = 0;
    let selectedCategoryId = -1;

    votes.forEach((votes, category) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        selectedCategoryId = category;
      }
    });

    const chosenCategory = this.categories.find(
      (category) => category.id == selectedCategoryId
    );

    // if no category was chosen randomly select one
    if (!chosenCategory) {
      return this.categories[
        Math.floor(Math.random() * this.categories.length)
      ];
    }

    return chosenCategory;
  }

  public async generateCategories() {
    const allCategories = await this.game.gameService.getCategories();

    let availableCategories = allCategories;

    // if whitelist is set, only use the categories from the whitelist
    if (
      this.game.settings.category_whitelist &&
      this.game.settings.category_whitelist.length > 0
    ) {
      availableCategories = allCategories.filter((category) =>
        this.game.settings.category_whitelist.includes(category.id)
      );
    }

    this.categories = [];

    // if there are fewer categories than the number of categories per voting, use all of them
    if (
      availableCategories.length <=
      this.game.settings.number_of_categories_per_voting
    ) {
      this.categories = availableCategories;
      return;
    }

    // if there are more categories than the number of categories per voting, randomly select the categories
    for (
      let i = 0;
      i < this.game.settings.number_of_categories_per_voting;
      i++
    ) {
      const randomIndex = Math.floor(
        Math.random() * availableCategories.length
      );
      const category = availableCategories[randomIndex];
      this.categories.push(category);
      availableCategories.splice(randomIndex, 1);
    }
  }

  public getPacket(member: GameMember): GameRoundPacket {
    const commonData = {
      questionNumber: this.questionIndex + 1,
      timerStart: this.timeStart,
      timerEnd:
        this.game.gameStatus == "question_phase"
          ? member.answerEndTime
          : this.timeEnd,
    };

    if (this.game.gameStatus == "voting_phase") {
      // categories are sent in the voting phase
      return {
        categories: this.categories.map((category) => category.id),
        ...commonData,
      };
    }

    if (this.game.gameStatus == "question_result_phase") {
      commonData["correctAnswer"] = this.chosenQuestion.correctAnswer;
    }

    return {
      category: this.chosenCategory,
      question: member.question,
      ...commonData,
    };
  }

  private async generateRandomQuestions(): Promise<Question[]> {
    const questions =
      await this.game.gameService.questionsService.getQuestionsByCategory(
        this.chosenCategory
      );

    // if there are fewer questions than the number of questions per round, use all of them - should not happen
    if (questions.length <= this.game.settings.number_of_questions_per_round) {
      return questions;
    }

    const selectedQuestions = [];

    // if there are more questions than the number of questions per round, randomly select the questions
    for (let i = 0; i < this.game.settings.number_of_questions_per_round; i++) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      const question = questions[randomIndex];

      // prevent duplicates
      if (selectedQuestions.some((q) => q.id === question.id)) {
        i--;
        continue;
      }

      selectedQuestions.push(question);
      questions.splice(randomIndex, 1);
    }

    return selectedQuestions;
  }

  extendTime(player: GameMember) {
    player.answerEndTime += 10 * 1000;
    player.timeToAnswer += 10;
  }
}
