import { Server, Socket } from 'socket.io';
import { User } from './User';

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
    }
}