import { Server, Socket } from 'socket.io';
import { User } from './User';
import { LobbyHandler } from './LobbyHandler';

const sockets = new Map<string, SocketHandler>();

export class SocketHandler {
    private io: Server;
    private socket: Socket;
    private user: User;
    private lobby: LobbyHandler | null = null;
    private lobbyId: string | null = null;

    constructor(io: Server, socket: Socket) {
        this.io = io;
        this.socket = socket;
        this.user = new User(socket.id);

        sockets.set(socket.id, this);

        // When user disconnects from server
        this.socket.on('disconnect', () => { 
            console.log(`Client disconnected: ${this.socket.id}`);
            this.user.deleteUser();
            sockets.delete(this.socket.id);
        });

        // When user creates a new lobby
        this.socket.on('create lobby', (username: string) => {
            if(!this.user.setUsername(username)) {
                this.io.to(this.socket.id).emit('error', 'Invalid username. Must be 3-16 letters with no spaces.');
                return;
            }
            this.lobby = new LobbyHandler(this.user);
            this.lobbyId = this.lobby.getLobbyId();
            console.log(`User ${username} created a lobby with ID: ${this.lobbyId}`);
            this.socket.join(this.lobbyId);
            this.io.to(this.socket.id).emit('lobbyCreated', this.socket.id);
        })

        // When user joins an existing lobby
        this.socket.on('join lobby', (username: string, lobbyId: string) => {
            if(!this.user.setUsername(username)) {
                this.io.to(this.socket.id).emit('error', 'Invalid username. Must be 3-16 letters with no spaces.');
                return;
            }
            const lobby = LobbyHandler.getLobbyById(lobbyId);
            if (!lobby) {
                this.io.to(this.socket.id).emit('error', `That game code was not recognised. Please try again.`);
                return;
            }
            if (!lobby.joinLobby(this.user)) {
                this.io.to(this.socket.id).emit('error', `That lobby is full or you are already in a game.`);
                return;
            }
            this.socket.join(lobbyId);
            console.log(`User ${username} joined lobby with ID: ${lobbyId}`);
        })

        // When user ready ups
        this.socket.on('ready', () => {

        })

        // When user leaves the game (game finished)
        this.socket.on('leave game', () => {
            
        });

        // When user sets placements
        this.socket.on('set placements', () => {

        })

        // When user plays a turn
        this.socket.on('play turn', () => {

        })
    }

    onJoinedLobby() {

    }

    onTurnBegin() {
        this.socket.emit('turn start');
    }

    onWaitBegin() {
        this.socket.emit('wait start');
    }

    onStartGame() {

    }

    onEndGame() {
        
    }

    logError() {

    }
}