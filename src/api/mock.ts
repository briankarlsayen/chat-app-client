import { formatHourSec } from '../utilities/formatTime';

export const messageChannelData = [
  {
    channel: 'room1',
    unread: 0,
    messages: [
      {
        _id: '1',
        name: 'popo',
        message: 'this is it',
        createdAt: '2023-08-03T06:43:04.697Z',
        type: 'chat',
      },
      {
        _id: '2',
        name: 'ssss',
        message: 'this is itaaaaaa',
        createdAt: '2023-07-04T06:43:04.697Z',
        type: 'chat',
      },
      {
        _id: '3',
        name: 'popo-asdas',
        message: 'this is iasdast',
        createdAt: '2023-08-01T06:43:04.697Z',
        type: 'chat',
      },
      {
        _id: '4',
        name: 'popo-asdas',
        message: 'popo-asdas has joined',
        createdAt: '2023-08-01T06:43:04.697Z',
        type: 'notification',
      },
    ],

  },
  {
    channel: 'room2',
    unread: 2,
    messages: [
      {
        _id: '1',
        name: 'pooop',
        message: 'this is it',
        createdAt: formatHourSec('2023-08-01T00:22:08.815Z'),
      },
      {
        _id: '2',
        name: 'yiii',
        message: 'this is itaa',
        createdAt: formatHourSec('2023-08-04T02:20:04.697Z'),
      },
      {
        _id: '3',
        name: 'boom',
        message: 'this iz is it',
        createdAt: formatHourSec('2023-08-03T02:20:04.697Z'),
      },
    ],
  },
];
