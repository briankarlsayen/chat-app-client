import MultiInput from './MultiInput';
import moment from 'moment';
import { useState } from 'react';
import { IMessage } from '../App';
import { channelMessagesStore } from '../store/MessageStore';

export default function ChannelContent({
  conn,
  selectedChannel,
  messages,
  handleSendMessage,
}: any) {
  const { channelMessages, displayChannelMessages } = channelMessagesStore(
    (state) => state
  );

  const [message, setMessage] = useState('');
  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleSendMessage(message);
    setMessage('');
  };
  console.log('messages in ch', channelMessages);

  return (
    <div className='flex flex-col w-full h-[calc(100vh-4rem)]'>
      <Content messages={displayChannelMessages(selectedChannel.label)} />
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
  const time = moment(createdAt).format('HH:mm');
  return (
    <div className='pb-2'>
      <p className='text-blue-500'>
        @{name}
        <span className='pl-2 text-gray-400 text-sm'>{time}</span>
      </p>
      <p>{message}</p>
    </div>
  );
};
