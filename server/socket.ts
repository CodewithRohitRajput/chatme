import type { Server as HttpServer } from "http";
import { Server } from "socket.io";

const setupSocket = (server: HttpServer) => {
    const io = new Server(server);
    const onlineUsers = new Set<string>();

    io.on('connection', (socket) => {
        const userId = socket.handshake.auth?.userId as string | undefined;
        if (!userId) {
            socket.disconnect(true);
            return;
        }

        onlineUsers.forEach((id) => {
            socket.emit('presence', { userId: id, status: 'online' });
        });

        onlineUsers.add(userId);
        io.emit('presence', { userId, status: 'online' });

        socket.on('join', (roomUserId) => {
            if (roomUserId) socket.join(roomUserId);
        });

        socket.on('sendMessage', async ({ receiverId, senderId, text }) => {
            io.to(receiverId).emit('receiveMsg', text);
        });

        socket.on('disconnect', () => {
            onlineUsers.delete(userId);
            io.emit('presence', { userId, status: 'offline' });
        });
    });
};

export default setupSocket;