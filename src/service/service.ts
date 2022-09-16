import { getIp, httpGet, httpPost } from "../utilities/utilities";
import { io, Socket } from "socket.io-client";
import type { CreateGameResult, GameRound, GameRoundResult, GameState, Player, PlayerScore, Question, QuestionResult } from "./dtos";
import type { IService, IServiceSocket } from "./interfaces";
// import { ServiceMock } from "./serviceMock";

class Service implements IService {
    private baseUrl: string = "http://localhost:4000";
    public ip!: string;
    public io!: IServiceSocket;

    constructor() {
        this.init();
    }

    async init() {
        console.log('Initializing service');
        this.ip = await getIp();
        await this.connect();
        console.log('IP is: ' + this.ip);
    }

    //#region http endpoints

    async createGame() {
        const result = await httpPost(this.baseUrl + "/games", { ip: this.ip }) as CreateGameResult;
        console.log("Created game: " + result.gameId);
        return result.gameId;
    }

    async joinGame(gameId: string, userName: string): Promise<void> {
        const player:Player = {
            name: userName,
            ip: this.ip,
            gifUrl: ""
        }
        await httpPost(`${this.baseUrl}/games/${gameId}/join`, player);
        console.log("Joined game: " + gameId);
    }
    
    async getGameState(gameId: string) {
        const state = await httpGet(`${this.baseUrl}/games/${gameId}/state`) as GameState;
        console.log("Game state", state);
        return state;
    }
    //#endregion

    //#region socket
    async connect(): Promise<IServiceSocket> {
        return new Promise((resolve, reject) => {
            if (!this.io) {
                console.log('Connecting to socket...');
                const socket = io(this.baseUrl + `?ip=${this.ip}`).connect();
                socket.on('connect', () => {
                    console.log('Connection established');
                    resolve(this.io);
                })
                socket.on("connect_error", (err) => {
                    console.log(`BURN! ${err.message} \n ${err.stack}`);
                    reject();
                });
                this.io = new ServiceSocket(socket);
            }
            resolve(this.io);
        });
    }
    //#endregion
}

class ServiceSocket implements IServiceSocket {
    io: Socket;

    constructor(io: Socket) {
        this.io = io;
    }

    testEmit(message: string): void {
        this.io.emit("test", message);
    }

    nextRound(duration: number) {
        this.io.emit("startNextRound", duration)
    }

    // submitAnswer(index: number) {
    //     this.io.emit("submitAnswer", index)
    // }

    // showFinalResult() {
    //     this.io.emit("showFinalResult")
    // }

    onTestResponse(callback: (x: string) => void): void {
        this.io.on("testResponse", callback);
    }

    onPlayerJoined(callback: (x: Player) => void): void {
        this.io.on("playerJoined", callback);
    }

    onRoundStarted(callback: (x: GameRound) => void) {
        this.io.on("roundStarted", callback);
    }

    onRoundEnded(callback: (x: GameRoundResult) => void) {
        this.io.on("roundEnded", callback);
    }
}

export const service:IService = new Service();