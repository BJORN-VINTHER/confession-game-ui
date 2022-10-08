
export interface GameState {
    gameId: string,
    hostIp: string,
    currentRounds: number,
    totalRounds: number,
    timePerRound: number,
    players: Player[]
}

export interface PlayerScore {
    playerIP: string,
    userName: string,
    score: number
}

export interface Question {
    text: string,
    options: string[]
}

export interface GameRound {
    index: number,
    master: Player,
    question: Question,
    answers: Answer[] | undefined
}

export interface Answer {
    player: Player,
    option: number
}

export interface CreateGameResult {
    gameId: string
}

export interface Player {
    ip: string,
    name: string,
    gifUrl: string
}