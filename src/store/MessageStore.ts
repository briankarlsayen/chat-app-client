import { create } from 'zustand';
import { IMessage } from '../App';
import { messageChannelData } from '../api/mock';
import { formatHourSec } from '../utilities/formatTime';

interface IChannelMessage {
  channel?: string;
  messages?: IMessage[];
  chMessages?: IChannelMessage[];
}

interface IValue {
  channel: string;
  message?: IMessage;
  name?: string;
}

interface IZustand {
  set?: any;
  get?: any;
}

interface ICreateMessage extends IZustand {
  value?: IValue;
}

interface IDisplayChannelMessages extends IZustand {
  value?: string;
}

const channelMessages: IChannelMessage[] = [...messageChannelData];

const findChannelIndx = ({ channel, chMessages }: IChannelMessage) => {
  return chMessages?.findIndex((item) => item.channel === channel) ?? -1;
};

const createMessage = ({ set, get, value }: ICreateMessage) => {
  const formattedMsg = {
    ...value?.message,
    createdAt: formatHourSec(value?.message?.createdAt),
  };
  let chMessages = get().channelMessages;
  const idx = findChannelIndx({ channel: value?.channel, chMessages });
  if (idx > -1) {
    const msgList = chMessages[idx].messages;
    const newMsgs = [...msgList, formattedMsg];
    const newChMessages = [...chMessages];
    newChMessages[idx].messages = newMsgs;
    return set({ channelMessages: [...newChMessages] });
  } else {
    const newChanel = {
      channel: value?.channel,
      messages: [
        {
          ...formattedMsg,
          // createdAt: moment(value?.message?.createdAt).format('HH:mm'),
        },
      ],
    };
    const newest = [...chMessages, newChanel];
    console.log('newest', newest);
    return set({ channelMessages: [...newest] });
  }
};

const displayChMessages = ({ get, value }: IDisplayChannelMessages) => {
  let chMessages = get().channelMessages;
  const idx = findChannelIndx({ channel: value, chMessages });
  return idx > -1 ? chMessages[idx]?.messages : null;
};

const messageStoreObject = (set: any, get: any) => ({
  channelMessages,
  createMessage: (value: IValue) => createMessage({ set, get, value }),
  displayChannelMessages: (value?: string) => displayChMessages({ get, value }),
});

export const channelMessagesStore = create(messageStoreObject);
