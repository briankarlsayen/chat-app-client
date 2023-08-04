import MultiInput from './MultiInput';
import { useState } from 'react';
import { IMessage } from '../App';
import { channelMessagesStore } from '../store/MessageStore';
import { channelStore } from '../store/ChannelStore';

export default function ChannelContent({ handleSendMessage }: any) {
  const { displayChannelMessages } = channelMessagesStore((state) => state);
  const { selectedChannel } = channelStore((state) => state);

  const [message, setMessage] = useState('');
  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleSendMessage(message);
    setMessage('');
  };

  return (
    <div className='flex flex-col w-full h-[calc(100vh-4rem)]'>
      <Content messages={displayChannelMessages(selectedChannel?.label)} />
      <div>
        <form onSubmit={handleSubmit} className='w-full flex'>
          <MultiInput
            value={message}
            onChange={(e: any) => setMessage(e.target.value)}
          />
          <button type='submit' className='bg-blue-600 px-4 text-white'>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

interface IContent {
  messages?: IMessage[];
}

const Content = ({ messages }: IContent) => {
  return (
    <div className='h-full flex-1 p-4'>
      {messages ? (
        messages.map((message) => <Message key={message._id} {...message} />)
      ) : (
        <></>
      )}
    </div>
  );
};

const Message = ({ name, message, createdAt }: any) => {
  return (
    <div className='pb-2'>
      <p className='text-blue-500'>
        @{name}
        <span className='pl-2 text-gray-400 text-sm'>{createdAt}</span>
      </p>
      <p>{message}</p>
    </div>
  );
};
