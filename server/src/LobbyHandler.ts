import { User } from './User';
import { generateGameCode } from './utils';

const lobbies = new Map<string, LobbyHandler>();

export class LobbyHandler {
    private lobbyId: string;
    private user1: User | null = null;
    private user2: User | null = null;

    constructor(User1: User) {
        while (!LobbyHandler.getLobbyById(this.lobbyId = generateGameCode())) {
            lobbies.set(this.lobbyId, this);
        }
        this.user1 = User1;
    }

    static getLobbyById(lobbyId: string): LobbyHandler | undefined {
        return lobbies.get(lobbyId);
    }

    getLobbyId(): string {
        return this.lobbyId;
    }

    deleteLobby() {
        if (this.user1) {
            this.user1.leaveGame();
        }
        if (this.user2) {
            this.user2.leaveGame();
        }
        lobbies.delete(this.lobbyId);
    }

    joinLobby(user: User): boolean {
        if (this.user2) {
            return false;
        }
        if (user.getGameId()) {
            return false;
        }
        this.user2 = user;
        user.joinGame(this.lobbyId);
        return true;
    }

    createGame() {
        
    }
}