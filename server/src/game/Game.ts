import { User } from "../User";

const games = new Map<string, Game>();

type player = {
    user: User;
    ready: boolean;
    ships: any[];
    callbacks: {
        turnBegin: (() => void) | null;
        waitBegin: (() => void) | null;
    };
}

export class Game {
    private gameID : string;
    private player1: player;
    private player2: player;
    private winner: User | null = null;
    private gameState: String;
    private isUser1Turn: boolean;

    constructor(gameID: string, player1: User, player2: User) {
        this.gameID = gameID;
        this.player1 = {
            user: player1,
            ready: false,
            ships: [],
            callbacks: {
                turnBegin: null,
                waitBegin: null
            }
        }
        this.player2 = {
            user: player2,
            ready: false,
            ships: [],
            callbacks: {
                turnBegin: null,
                waitBegin: null
            }
        }

        this.gameState = "shipPlacement";
        this.isUser1Turn = true;
        games.set(gameID, this);
    }

    static getGameById(gameID: string): Game | undefined {
        return games.get(gameID);
    }

    getGameId(): string {
        return this.gameID;
    }


}