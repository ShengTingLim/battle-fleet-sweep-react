const users = new Map<string, User>();

export class User {
    socketId: string;
    username: string | null = null;
    gameId: string | null = null;

    constructor(socketId: string) {
        this.socketId = socketId;
        users.set(socketId, this);
    }

    deleteUser() {
        users.delete(this.socketId);
    }

    setUsername(username: string) {
        this.username = username;
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
        for (const [id, user] of users.entries()) {
            if (user.username === username) {
                return id;
            }
        }
        return undefined;
    }

    static isValidUsername(username: string): boolean {
        // Check if the username is already taken or if it meets the criteria
        return (!Array.from(users.values()).some(user => user.username === username)) || 
            typeof(username) == 'string' &&              // Ensure input is string type
            new RegExp('^[a-zA-Z]+$').test(username) &&     // Only letters allowed
            username.length > 2 &&                          // Minimum 3 characters
            username.length < 17;
    }
}