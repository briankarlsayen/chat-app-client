import { useState } from 'react';
import Input from './Input';
import { userToken } from '../config/userToken';
import { channelStore } from '../store/ChannelStore';
import { SocketConnect } from '../App';

interface ISelectedChannelForm {
  connection?: SocketConnect;
}

export default function SelectChannelForm({
  connection,
}: ISelectedChannelForm) {
  const defaultInput = {
    username: '',
    channel: '',
  };
  const [input, setInput] = useState(defaultInput);

  const { joinChannel } = channelStore((state) => state);

  const handleEnter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const params = {
        label: input.channel,
        token: userToken,
        name: input.username,
      };
      setInput(defaultInput);
      joinChannel({ ...params });

      const formatMessage = {
        message: `${input.username} has joined`,
        user: input.username,
        channel: input.channel,
        type: 'notification',
      };
      connection?.data?.emit('send-chat', formatMessage);
      connection?.data?.emit('join-room', input.channel);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  return (
    <div>
      <div className='pt-20 flex flex-col justify-center w-full h-full items-center p-4'>
        <form
          onSubmit={handleEnter}
          className='flex flex-col gap-4 p-4 shadow-lg w-full max-w-xl rounded-md'
        >
          <Input
            label='Username'
            name='username'
            value={input.username}
            onChange={handleInputChange}
            required={true}
          />
          <Input
            label='Channel'
            name='channel'
            value={input.channel}
            onChange={handleInputChange}
            required={true}
          />

          <button type='submit' className='btn-blue primary-blue-bg'>
            Enter
          </button>
        </form>
        <MessageBoard />
      </div>
    </div>
  );
}

const MessageBoard = () => {
  return (
    <div className='pt-10 max-w-xl'>
      <h2 className='pb-2'>Instruction</h2>
      <p>
        Kindly provide your desired room username and specify the channel you
        wish to join. Share this channel information with the individuals you
        want to engage in a conversation with, as only users on the same channel
        can communicate with each other. It's important to note that we do not
        store any messages in our database;{' '}
        <span className='italic'>
          Note: messages are only accessible to online users in real-time.
        </span>
      </p>
    </div>
  );
};
