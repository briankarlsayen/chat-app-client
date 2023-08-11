import Channel from './components/Channel';
import Header from './components/Header';
import { useState, useEffect } from 'react';
import SelectChannelForm from './components/SelectChannelForm';
import ChannelContent from './components/ChannelContent';
import connectToSocket from './config/socket';
import {
  IChannelMessageDetails,
  channelMessagesStore,
} from './store/MessageStore';
import { initializeUserToken } from './config/userToken';
import { IChannel, ISelectedChannel, channelStore } from './store/ChannelStore';
import Loading from './components/Loading';
import ChatLogo from './assets/chat-app.png';
interface Socket {
  on(event: string, callback: (data: any) => void): any;
  emit(event: string, data: any): any;
  connected: boolean;
}

export interface SocketConnect {
  message?: string;
  success?: boolean;
  data?: Socket;
}

export interface IMessage {
  _id?: string;
  name: string;
  message: string;
  createdAt: string;
  type?: string;
}

function App() {
  const {
    storeChannels,
    channels,
    pickChannel,
    selectedChannel,
    leaveChannel,
    displaySelectedChannel,
  } = channelStore((state) => state);
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState<SocketConnect>();
  const {
    createMessage,
    displayChannelDetails,
    initializeChannels,
    readChMessages,
  } = channelMessagesStore((state) => state);

  const connected = async () => {
    const sc: SocketConnect = await connectToSocket();
    setConnection(undefined);
    setConnection(sc);
    if (sc?.data?.connected) {
      setLoading(false);
      sc?.data?.on('message', (socketMessage) => {
        createMessage({
          channel: socketMessage.channel,
          message: { ...socketMessage },
          selectedChannel: displaySelectedChannel(),
        });
      });
    } else {
      console.log('Unable to connect socket');
    }
  };

  const saveUserToken = async () => {
    const tokenExist = initializeUserToken();
    if (tokenExist) storeChannels();
  };

  const joinSaveChannels = () => {
    if (connection?.success) {
      const list = channels.map((channel) => channel?.label);
      connection?.data?.emit('join-room', list);
      initializeChannels(channels);
    }
  };

  useEffect(() => {
    connected();
    saveUserToken();
  }, []);

  useEffect(() => {
    joinSaveChannels();
  }, [channels, connection]);

  const handleSendMessage = (message: string) => {
    const formatMessage = {
      message,
      user: selectedChannel?.name,
      channel: selectedChannel?.label,
      type: 'chat',
    };
    connection?.data?.emit('send-chat', formatMessage);
  };

  const handleLeaveChannel = async () => {
    if (selectedChannel?.label) {
      await leaveChannel();
      connection?.data?.emit('leave-room', selectedChannel?.label);
      const formatMessage = {
        message: `${selectedChannel.name} has left`,
        user: selectedChannel.name,
        channel: selectedChannel.label,
        type: 'notification',
      };
      connection?.data?.emit('send-chat', formatMessage);
    }
  };

  return loading ? (
    <Loading loading={true} />
  ) : (
    <div className='flex h-screen'>
      <SideBar
        channels={channels}
        pickChannel={pickChannel}
        selectedChannel={selectedChannel}
        displayChannelDetails={displayChannelDetails}
        readChMessages={readChMessages}
      />
      <Content
        selectedChannel={selectedChannel}
        connection={connection}
        handleSendMessage={handleSendMessage}
        handleLeaveChannel={handleLeaveChannel}
      />
    </div>
  );
}

interface ISideBar {
  channels: IChannel[];
  pickChannel: (value?: IChannel | null) => void;
  displayChannelDetails: (
    value?: string | undefined
  ) => IChannelMessageDetails | null;
  readChMessages: (value?: string) => void;
  selectedChannel: ISelectedChannel | null;
}

const SideBar = ({
  channels,
  pickChannel,
  selectedChannel,
  displayChannelDetails,
  readChMessages,
}: ISideBar) => {
  const handleSelectChannel = (channel?: IChannel | null) => {
    pickChannel(channel);
    readChMessages(channel?.label);
  };
  return (
    <div className='max-w-xs border-r-2 w-full'>
      <div className='h-16 w-full primary-blue-bg'>
        <img src={ChatLogo} className='h-full' />
      </div>
      <ul>
        <li className='sidebar-item' onClick={() => handleSelectChannel(null)}>
          Enter a channel
        </li>
        {channels?.length
          ? channels?.map((channel) => (
              <li
                key={channel?._id}
                onClick={() => handleSelectChannel(channel)}
                className={
                  channel?.label === selectedChannel?.label ? 'bg-gray-200' : ''
                }
              >
                <Channel
                  displayChannelDetails={displayChannelDetails}
                  {...channel}
                />
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

interface IContent {
  connection?: SocketConnect;
  handleSendMessage: (value: string) => void;
  selectedChannel: ISelectedChannel | null;
  handleLeaveChannel: () => void;
}

const Content = ({
  connection,
  handleSendMessage,
  selectedChannel,
  handleLeaveChannel,
}: IContent) => {
  return (
    <div className='w-full h-screen'>
      <Header
        title={selectedChannel?.label ?? 'Enter a channel'}
        isChannel={!!selectedChannel?.label}
        handleLeaveChannel={handleLeaveChannel}
      />
      {selectedChannel?._id ? (
        <ChannelContent handleSendMessage={handleSendMessage} />
      ) : (
        <div>
          <SelectChannelForm connection={connection} />
        </div>
      )}
    </div>
  );
};

export default App;
