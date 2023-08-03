import { create } from 'zustand';
import { IMessage } from '../App';
import { messageChannelData } from '../api/mock';
import moment from 'moment';

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
  console.log('value', value);
  let chMessages = get().channelMessages;
  console.log('chMessages', chMessages);
  const idx = findChannelIndx({ channel: value?.channel, chMessages });
  console.log('idx', idx);
  if (idx > -1) {
    const msgList = chMessages[idx].messages;
    const newMsgs = [...msgList, value?.message];
    const newChMessages = [...chMessages];
    newChMessages[idx].messages = newMsgs;
    return set({ channelMessages: [...newChMessages] });
  } else {
    const newChanel = {
      channel: value?.channel,
      messages: [
        {
          name: value?.message?.name,
          message: value?.message?.message,
          _id: '121',
          createdAt: moment(value?.message?.createdAt).format('HH:mm'),
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

const accountLoginStoreObject = (set: any, get: any) => ({
  channelMessages,
  createMessage: (value: IValue) => createMessage({ set, get, value }),
  displayChannelMessages: (value: string) => displayChMessages({ get, value }),
});

export const channelMessagesStore = create(accountLoginStoreObject);
