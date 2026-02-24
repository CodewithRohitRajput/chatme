import type { Server as HttpServer } from "http";
import { Server } from "socket.io";

const setupSocket = (server: HttpServer) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('user connection', socket.id);

        socket.on('join', (userId) => {
            socket.join(userId);
        });

        socket.on('sendMessage', async ({ receiverId, senderId, text }) => {
            io.to(receiverId).emit('receiveMsg', text);
            io.to(senderId).emit('receiveMsg', text);
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
};

export default setupSocket;