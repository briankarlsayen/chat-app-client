import Channel from './components/Channel';
import Header from './components/Header';
import { useState, useEffect } from 'react';
import SelectChannelForm from './components/SelectChannelForm';
import ChannelContent from './components/ChannelContent';
import connectToSocket from './config/socket';
import { generateUUID } from './utilities/generator';
import { routesGetApi, routesPostApi, routesPutApi } from './api/apis';
import { channelMessagesStore } from './store/MessageStore';

interface IChannel {
  _id: number;
  label: string;
}

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

interface IUser {
  name: string;
  token: string;
}

interface IChannelDetails {
  channel: string;
}

export interface IMessage {
  _id: string;
  name: string;
  message: string;
  createdAt: string;
}

function App() {
  const [selectedChannel, setSelectedChannel] = useState<IChannel | null>(null);
  const [connection, setConnection] = useState<SocketConnect>();
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [channelDetails, setChannelDetails] = useState<IChannelDetails>();
  const { createMessage } = channelMessagesStore((state) => state);

  const connected = async () => {
    const sc: SocketConnect = await connectToSocket();
    setConnection(undefined);
    setConnection(sc);
    if (sc?.data?.connected) {
      sc?.data?.on('message', (socketMessage) => {
        console.log('socket message', socketMessage);
        createMessage({
          channel: socketMessage.channel,
          message: { ...socketMessage },
        });
        // setMessages((prevMsg: any) => [...prevMsg, log]);
      });
    } else {
      console.log('Unable to connect socket');
    }
  };

  const fetchChannels = async (userToken: string) => {
    return await routesGetApi({ routeName: `/channels/${userToken}` });
  };

  const saveUserToken = async () => {
    const tokenExist = localStorage.getItem('userToken');
    if (!tokenExist) {
      let token = generateUUID();
      localStorage.setItem('userToken', generateUUID());
      const { data } = await fetchChannels(token);
      setChannels(data);
    } else {
      const { data } = await fetchChannels(tokenExist);
      setChannels(data);
    }
  };

  const fetchChannelDetails = async () => {
    if (!selectedChannel) return;
    try {
      const params = {
        label: selectedChannel?.label,
        token: localStorage.getItem('userToken'),
      };
      const response = await routesPostApi({
        routeName: '/channels/details',
        params,
      });
      setChannelDetails(response.data);
    } catch (error) {
      console.log('error', error);
    }
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

  useEffect(() => {
    fetchChannelDetails();
  }, [selectedChannel]);

  const handleSendMessage = (message: string) => {
    const formatMessage = {
      message,
      user: channelDetails?.name,
      channel: channelDetails?.label,
    };
    console.log('send...');
    connection?.data?.emit('send-chat', formatMessage);
  };

  const handleLeaveChannel = async () => {
    console.log('leave room', selectedChannel?.label);
    if (selectedChannel?.label) {
      const params = {
        token: localStorage.getItem('userToken'),
      };
      connection?.data?.emit('leave-room', selectedChannel?.label);
      await routesPutApi({
        routeName: `/channels/leave/${selectedChannel?.label}`,
        params,
      });
    }
  };

  return (
    <div className='flex h-screen'>
      <SideBar channels={channels} setSelectedChannel={setSelectedChannel} />
      <Content
        messages={messages}
        channelDetails={channelDetails}
        selectedChannel={selectedChannel}
        connection={connection}
        handleSendMessage={handleSendMessage}
        handleLeaveChannel={handleLeaveChannel}
      />
    </div>
  );
}

const SideBar = ({ channels, setSelectedChannel }: any) => {
  return (
    <div className='max-w-xs border-r-2 w-full'>
      <Header title={'CHATAPP'} />

      {channels ? (
        <ul>
          <li className='sidebar-item' onClick={() => setSelectedChannel(null)}>
            Enter a channel
          </li>
          {channels.map((channel: any) => (
            <li key={channel._id} onClick={() => setSelectedChannel(channel)}>
              <Channel {...channel} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

interface IChannelDetails {
  label: string;
  name: string;
  token: string;
}

const Content = ({
  selectedChannel,
  connection,
  handleSendMessage,
  channelDetails,
  messages,
  handleLeaveChannel,
  ...props
}: any) => {
  return (
    <div className='w-full h-screen'>
      <Header
        title={channelDetails?.label ?? 'Enter a channel'}
        isChannel={true}
        handleLeaveChannel={handleLeaveChannel}
      />
      {selectedChannel ? (
        <ChannelContent
          messages={messages}
          connection={connection}
          selectedChannel={selectedChannel}
          handleSendMessage={handleSendMessage}
        />
      ) : (
        <div>
          <SelectChannelForm connection={connection} />
        </div>
      )}
    </div>
  );
};

export default App;
