import { io } from 'socket.io-client';
import { socketUrl } from './server';

const delay = (delayInms: number) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

export default async function connectSocket() {
  console.log('socketUrl', socketUrl)
  const socketRes = io(socketUrl, {
    transports: ['websocket', 'polling'],
  });
  await delay(3000);
  if (!socketRes.connected) {
    socketRes.disconnect();
    return new Error('Unable to connect to socket');
  }
  console.log('socket connected');
  return {
    success: true,
    data: socketRes,
  };
}
