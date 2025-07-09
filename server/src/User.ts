const users = new Map<string, User>();

export class User {
    private socketId: string;
    private username: string | null = null;
    private gameId: string | null = null;

    constructor(socketId: string) {
        this.socketId = socketId;
        users.set(socketId, this);
    }

    deleteUser() {
        users.delete(this.socketId);
    }

    setUsername(username: string): boolean {
        if (!User.isValidUsername(username)) {
            return false;
        }
        this.username = username;
        return true;
    }

    getUsername(): string | null {
        return this.username;
    }

    getSocketId(): string {
        return this.socketId;
    }

    getGameId(): string | null {
        return this.gameId;
    }

    joinGame(gameId: string) {
        this.gameId = gameId;
    }

    leaveGame() {
        if (this.gameId == null)  {
            console.error(`User ${this.socketId} is not in a game.`);
            return;
        }
        this.gameId = null;
    }

    static getUserBySocketId(socketId: string): User | undefined {
        return users.get(socketId);
    }

    static getUserByUsername(username: string): User | undefined {
        for (const user of users.values()) {
            if (user.username === username) {
                return user;
            }
        }
        return undefined;
    }

    static getIdByUsername(username: string): string | undefined {
        for (const [socketId, user] of users.entries()) {
            if (user.username === username) {
                return socketId;
            }
        }
        return undefined;
    }

    static isValidUsername(username: string): boolean {
        if(this.getUserByUsername(username)) {
            return false;
        }
        return typeof(username) == 'string' && 
                                    /^[a-zA-Z]+$/.test(username) && 
                                    username.length > 2 && 
                                    username.length < 17;
    }
}