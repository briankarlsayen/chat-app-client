import Channel from './components/Channel';
import Header from './components/Header';
import { useState, useEffect } from 'react';
import SelectChannelForm from './components/SelectChannelForm';
import ChannelContent from './components/ChannelContent';
import connectToSocket from './config/socket';
import { channelMessagesStore } from './store/MessageStore';
import { initializeUserToken } from './config/userToken';
import { channelStore } from './store/ChannelStore';
interface Socket {
  on(event: string, callback: (data: any) => void): any;
  emit(event: string, data: any): any;
  connected: boolean;
}

interface SocketConnect {
  message?: string;
  success?: boolean;
  data?: Socket;
}

export interface IMessage {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
}

function App() {
  const {
    storeChannels,
    channels,
    pickChannel,
    selectedChannel,
    leaveChannel,
  } = channelStore((state) => state);
  const [connection, setConnection] = useState<SocketConnect>();
  const { createMessage } = channelMessagesStore((state) => state);

  const connected = async () => {
    const sc: SocketConnect = await connectToSocket();
    setConnection(undefined);
    setConnection(sc);
    if (sc?.data?.connected) {
      sc?.data?.on('message', (socketMessage) => {
        createMessage({
          channel: socketMessage.channel,
          message: { ...socketMessage },
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
      const list = channels.map((channel: any) => channel?.label);
      connection?.data?.emit('join-room', list);
    }
  };

  useEffect(() => {
    console.log('connecting socket');
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
    };
    connection?.data?.emit('send-chat', formatMessage);
  };

  const handleLeaveChannel = async () => {
    if (selectedChannel?.label) {
      await leaveChannel();
      connection?.data?.emit('leave-room', selectedChannel?.label);
    }
  };

  return (
    <div className='flex h-screen'>
      <SideBar
        channels={channels}
        pickChannel={pickChannel}
        selectedChannel={selectedChannel}
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

const SideBar = ({ channels, pickChannel, selectedChannel }: any) => {
  return (
    <div className='max-w-xs border-r-2 w-full'>
      <Header title={'CHATAPP'} />

      {channels ? (
        <ul>
          <li className='sidebar-item' onClick={() => pickChannel(null)}>
            Enter a channel
          </li>
          {channels.map((channel: any) => (
            <li
              key={channel._id}
              onClick={() => pickChannel(channel)}
              className={
                channel.label === selectedChannel?.label ? 'bg-gray-200' : ''
              }
            >
              <Channel {...channel} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

const Content = ({
  connection,
  handleSendMessage,
  selectedChannel,
  handleLeaveChannel,
}: any) => {
  console.log('selectedChannel', selectedChannel);
  return (
    <div className='w-full h-screen'>
      <Header
        title={selectedChannel?.label ?? 'Enter a channel'}
        isChannel={true}
        handleLeaveChannel={handleLeaveChannel}
      />
      {selectedChannel ? (
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
