import Channel from './components/Channel';
import Header from './components/Header';
import { useState, useEffect } from 'react';
import SelectChannelForm from './components/SelectChannelForm';
import ChannelContent from './components/ChannelContent';
import connectToSocket from './config/socket';
import { channelMessagesStore } from './store/MessageStore';
import { initializeUserToken } from './config/userToken';
import { channelStore } from './store/ChannelStore';
import Loading from './components/Loading';
import ChatLogo from './assets/chat-app.png';
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
      console.log('selectedChannel1', displaySelectedChannel());
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
      const list = channels.map((channel: any) => channel?.label);
      connection?.data?.emit('join-room', list);
      console.log('joining room');
      console.log('channels', channels);
      initializeChannels(channels);
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

const SideBar = ({
  channels,
  pickChannel,
  selectedChannel,
  displayChannelDetails,
  readChMessages,
}: any) => {
  const handleSelectChannel = (channel: any) => {
    pickChannel(channel);
    readChMessages(channel?.label);
  };
  return (
    <div className='max-w-xs border-r-2 w-full'>
      <div className='h-16 w-full primary-blue-bg'>
        <img src={ChatLogo} className='h-full' />
      </div>
      {/* <Header title={'CHATAPP'} /> */}
      <ul>
        <li className='sidebar-item' onClick={handleSelectChannel}>
          Enter a channel
        </li>
        {channels?.length
          ? channels?.map((channel: any) => (
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

const Content = ({
  connection,
  handleSendMessage,
  selectedChannel,
  handleLeaveChannel,
}: any) => {
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
