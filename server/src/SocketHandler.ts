import { Server, Socket } from 'socket.io';
import { User } from './User';
import { LobbyHandler } from './LobbyHandler';

const sockets = new Map<string, SocketHandler>();

export class SocketHandler {
    private io: Server;
    private socket: Socket;
    private user: User;

    constructor(io: Server, socket: Socket) {
        this.io = io;
        this.socket = socket;
        this.user = new User(socket.id);

        sockets.set(socket.id, this);

        this.socket.on('disconnect', () => {
            console.log(`Client disconnected: ${this.socket.id}`);
            this.user.deleteUser();
            sockets.delete(this.socket.id);
        });

        this.socket.on('createLobby', (username: string) => {
            if(!this.user.setUsername(username)) {
                
            }
            const lobby = new LobbyHandler(this.user);
            const lobbyId = lobby.getLobbyId();
            console.log(`User ${username} created a lobby with ID: ${lobbyId}`);
            this.socket.join(lobbyId);
            this.io.to(this.socket.id).emit('lobbyCreated', this.socket.id);
        })

        this.socket.on('joinLobby', (username: string, lobbyId: string) => {

        })
    }
}