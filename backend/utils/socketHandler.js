const socketHandler = (io, socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join_bus_room', (busId) => {
        socket.join(busId);
        console.log(`Socket ${socket.id} joined room ${busId}`);
    });

    socket.on('leave_bus_room', (busId) => {
        socket.leave(busId);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
};

module.exports = { socketHandler };
