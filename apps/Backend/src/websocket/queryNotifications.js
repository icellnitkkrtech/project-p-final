export const setupQueryWebsocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('join', ({ studentId }) => {
      socket.join(`student-${studentId}`);
    });

    socket.on('leave', ({ studentId }) => {
      socket.leave(`student-${studentId}`);
    });
  });

  return {
    notifyStudent: (studentId, notification) => {
      io.to(`student-${studentId}`).emit('queryUpdate', notification);
    }
  };
};