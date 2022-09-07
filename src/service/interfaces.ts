import type { GameState, Player, Question, QuestionResult } from "./dtos";

export interface IService {
    ip: string;
    io: IServiceSocket;
    createGame(): Promise<string>;
    joinGame(gameId: string, userName: string): Promise<void>;
    connect(gameId: string): Promise<IServiceSocket>
    // getGameState(gameId: string): Promise<GameState>;
}

export interface IServiceSocket {
    testEmit(message: string): void;
    onTestResponse(callback: (res: string) => void): void;
    // nextQuestion(duration: number): void;
    // submitAnswer(index: number): void;
    // onQuestionStart(callback: (question: Question) => void): void;
    // onQuestionComplete(callback: (questionResult: QuestionResult) => void): void;
    // onPlayerJoined(callback: (player: Player) => void): void;
}