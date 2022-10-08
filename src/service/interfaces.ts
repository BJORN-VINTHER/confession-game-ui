import type { GameRound, GameState, Player } from "./dtos";

export interface IService {
    ip: string;
    io: IServiceSocket;
    createGame(): Promise<string>;
    joinGame(gameId: string, userName: string): Promise<void>;
    getGameState(gameId: string): Promise<GameState>;
}

export interface IServiceSocket {
    nextRound(gameId: string): void;
    submitAnswer(gameId: string, playerIp: string, option: number): void;
    onRoundStarted(callback: (x: GameRound) => void): void;
    onRoundEnded(callback: (x: GameRound) => void): void;
    onPlayerJoined(callback: (x: Player) => void): void;
}