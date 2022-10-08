import { getIp, httpGet, httpPost } from "../utilities/utilities";
import { io, Socket } from "socket.io-client";
import type {
  Answer,
  CreateGameResult,
  GameRound,
  GameState,
  Player,
} from "./dtos";
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
    console.log("Initializing service");
    this.ip = await getIp();
    await this.connect();
    console.log("IP is: " + this.ip);
  }

  //#region http endpoints

  async createGame() {
    const result = (await httpPost(this.baseUrl + "/games", {
      ip: this.ip,
    })) as CreateGameResult;
    console.log("Created game: " + result.gameId);
    return result.gameId;
  }

  async joinGame(gameId: string, userName: string): Promise<void> {
    const player: Player = {
      name: userName,
      ip: this.ip,
      gifUrl: "",
    };
    await httpPost(`${this.baseUrl}/games/${gameId}/join`, player);
    console.log("Joined game: " + gameId);
  }

  async getGameState(gameId: string) {
    const state = (await httpGet(
      `${this.baseUrl}/games/${gameId}/state`
    )) as GameState;
    console.log("Game state", state);
    return state;
  }
  //#endregion

  //#region socket
  async connect(): Promise<IServiceSocket> {
    return new Promise((resolve, reject) => {
      if (!this.io) {
        console.log("Connecting to socket...");
        const socket = io(this.baseUrl + `?ip=${this.ip}`).connect();
        socket.on("connect", () => {
          console.log("Connection established");
          resolve(this.io);
        });
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

  nextRound(gameId: string) {
    this.io.emit("nextRound", gameId);
  }

  submitAnswer(gameId: string, playerIp: string, option: number) {
    this.io.emit("submitAnswer", { gameId, playerIp, option });
  }

  // showFinalResult() {
  //     this.io.emit("showFinalResult")
  // }

  onPlayerJoined(callback: (x: Player) => void): void {
    this.io.on("playerJoined", callback);
  }

  onRoundStarted(callback: (x: GameRound) => void) {
    this.io.on("roundStarted", callback);
  }

  onRoundEnded(callback: (x: GameRound) => void) {
    this.io.on("roundEnded", callback);
  }

  onPlayerAnswered(callback: (x: Answer) => void) {
    this.io.on("playerAnswered", callback);
  }
}

export const service: IService = new Service();
