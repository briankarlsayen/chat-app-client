import { io } from 'socket.io-client';

const delay = (delayInms: number) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

export default async function connectSocket() {
  const socketUrl = 'http://localhost:5900';
  const socketRes = io(socketUrl, {
    transports: ['websocket', 'polling'],
  });
  console.log('connecting...');
  await delay(3000);
  if (!socketRes.connected) {
    socketRes.disconnect();
    return new Error('Unable to connect to socket');
  }
  const defaultRooms = ['room1', 'room2', 'room3'];
  socketRes.emit('join-room', defaultRooms);
  return {
    success: true,
    data: socketRes,
  };
}
