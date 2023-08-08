import { create } from 'zustand';
import { IMessage } from '../App';
import { formatHourSec } from '../utilities/formatTime';

interface IChannelMessageProps extends IChannelMessageDetails {
  chMessages?: IChannelMessageDetails[];
}

interface IChannelMessageDetails {
  channel?: string;
  messages?: IMessage[];
  unread?: number;
}

interface IValue {
  channel: string;
  message?: IMessage;
  name?: string;
  selectedChannel?: any;
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

const channelMessages: IChannelMessageDetails[] = [];

const findChannelIndx = ({ channel, chMessages }: IChannelMessageProps) => {
  return chMessages?.findIndex((item) => item.channel === channel) ?? -1;
};

const createMessage = ({ set, get, value }: ICreateMessage) => {
  const formattedMsg = {
    ...value?.message,
    createdAt: formatHourSec(value?.message?.createdAt),
  };
  let chMessages = get().channelMessages;
  const idx = findChannelIndx({ channel: value?.channel, chMessages });
  const isInRoom = value?.channel === value?.selectedChannel?.label;
  // * channel already exist
  if (idx > -1) {
    const msgList = chMessages[idx].messages;
    const newMsgs = [...msgList, formattedMsg];
    const newChMessages = [...chMessages];
    newChMessages[idx].messages = newMsgs;
    newChMessages[idx].unread = !isInRoom ? newChMessages[idx]?.unread + 1 : 0;
    return set({ channelMessages: [...newChMessages] });
  } else {
    const newChanel = {
      channel: value?.channel,
      messages: [
        {
          ...formattedMsg,
        },
      ],
    };
    const newest = [...chMessages, newChanel];
    return set({ channelMessages: [...newest] });
  }
};

interface InitializeValue {
  label?: string;
  _id?: string;
}

interface IInitialChProps extends IZustand {
  value: InitializeValue[];
}

const initializeChannels = ({ set, value }: IInitialChProps) => {
  const initialChList = value?.map((val) => {
    return {
      channel: val?.label,
      unread: 0,
      messages: [],
    };
  });
  set({ channelMessages: initialChList });
};

const displayChDetails = ({ get, value }: IDisplayChannelMessages) => {
  let chMessages = get().channelMessages;
  const idx = findChannelIndx({ channel: value, chMessages });
  return idx > -1 ? chMessages[idx] : null;
};

const readChMessages = ({ set, get, value }: IDisplayChannelMessages) => {
  let chMessages = get().channelMessages;
  if (!value) return;
  const newChMessages = [...chMessages];
  const idx = findChannelIndx({ channel: value, chMessages: newChMessages });
  const data = newChMessages[idx];
  const newData = {
    channel: data?.channel,
    messages: data?.messages,
    unread: Number(0),
  };
  newChMessages[idx] = newData;
  set({ channelMessages: newChMessages });
};

const messageStoreObject = (set: any, get: any) => ({
  channelMessages,
  createMessage: (value: IValue) => createMessage({ set, get, value }),
  displayChannelDetails: (value?: string) => displayChDetails({ get, value }),
  initializeChannels: (value: InitializeValue[]) =>
    initializeChannels({ set, value }),
  readChMessages: (value?: string) => readChMessages({ set, get, value }),
});

export const channelMessagesStore = create(messageStoreObject);
