
export interface GameState {
    gameId: string,
    hostIp: string,
    currentRounds: number,
    totalRounds: number,
    players: Player[]
}

export interface PlayerScore {
    playerIP: string,
    userName: string,
    score: number
}

export interface Question {
    index: number,
    questionText: string,
    playerIP: string,
    currentTurnPlayerName: string,
    choices: string[]
}

export interface QuestionResult {
    correctAnswerIndex: number,
    answers: Answer[],
    scores: PlayerScore[]
}

export interface Answer {
    playerIP: string,
    userName: string,
    answer: number
}

export interface CreateGameResult {
    gameId: string
}

export interface Player {
    ip: string,
    name: string,
    gifUrl: string
}