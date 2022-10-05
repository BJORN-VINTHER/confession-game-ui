import type { GameRound, GameRoundResult, GameState, Player, Question, QuestionResult } from "./dtos";

export interface IService {
    ip: string;
    io: IServiceSocket;
    createGame(): Promise<string>;
    joinGame(gameId: string, userName: string): Promise<void>;
    getGameState(gameId: string): Promise<GameState>;
}

export interface IServiceSocket {
    testEmit(message: string): void;
    onTestResponse(callback: (res: string) => void): void;
    nextRound(gameId: string): void;
    // submitAnswer(index: number): void;
    onRoundStarted(callback: (x: GameRound) => void): void;
    onRoundEnded(callback: (x: GameRoundResult) => void): void;
    onPlayerJoined(callback: (x: Player) => void): void;
}