import MultiInput from './MultiInput';
import { useEffect, useRef, useState } from 'react';
import { IMessage } from '../App';
import { channelMessagesStore } from '../store/MessageStore';
import { channelStore } from '../store/ChannelStore';
import { FaRegPaperPlane } from 'react-icons/fa';

interface IChannelContent {
  handleSendMessage: (value: string) => void;
}

export default function ChannelContent({ handleSendMessage }: IChannelContent) {
  const { displayChannelDetails } = channelMessagesStore((state) => state);
  const { selectedChannel } = channelStore((state) => state);
  const [message, setMessage] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message) {
      handleSendMessage(message);
      setMessage('');
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChannel]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayChannelDetails(selectedChannel?.label)?.messages]);

  return (
    <div className='flex flex-col w-full h-[calc(100vh-4rem)]'>
      <Content
        messages={displayChannelDetails(selectedChannel?.label)?.messages}
        containerRef={containerRef}
      />
      <div className='px-4'>
        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          className='w-full flex gap-2 border-2 bg-slate-100 rounded-md py-2 px-4'
        >
          <MultiInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={'Ctrl + Enter to send'}
          />
          {/* <button type='submit' className='primary-blue-bg px-4 text-white'>
            Send
          </button> */}
          <div className='flex pt-2'>
            <button
              type='submit'
              className='h-fit p-2 rounded-full primary-blue-bg'
            >
              <FaRegPaperPlane color='white' />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface IContent {
  messages?: IMessage[];
  containerRef: React.RefObject<HTMLDivElement>;
}

const Content = ({ messages, containerRef }: IContent) => {
  return (
    <div className='h-full flex-1 p-4 overflow-y-auto' ref={containerRef}>
      {messages ? (
        messages.map((message) => <Message key={message._id} {...message} />)
      ) : (
        <></>
      )}
    </div>
  );
};

const Message = ({ name, message, createdAt, type }: IMessage) => {
  const props = { name, message, createdAt, type };
  return type === 'chat' ? <Chat {...props} /> : <NotifMsg {...props} />;
};

const Chat = ({ name, message, createdAt }: IMessage) => {
  return (
    <div className='pb-2'>
      <p className='text-blue-500 flex items-center'>
        <span className='limit-text-lenght'>@{name}</span>
        <span className='pl-2 text-gray-400 text-sm'>{createdAt}</span>
      </p>
      <p>{message}</p>
    </div>
  );
};

const NotifMsg = ({ message }: IMessage) => {
  return (
    <div className='pb-2'>
      <p className='text-gray-500 text-sm'>{message}</p>
    </div>
  );
};
