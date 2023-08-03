import { useState } from 'react';
import Input from './Input';
import { routesPostApi } from '../api/apis';
import { userToken } from '../utilities/token';

export default function SelectChannelForm({ connection }: any) {
  const defaultInput = {
    username: '',
    channel: '',
  };
  const [input, setInput] = useState(defaultInput);

  const handleEnter = async (e: any) => {
    e.preventDefault();
    try {
      const params = {
        label: input.channel,
        token: userToken,
        name: input.username,
      };
      setInput(defaultInput);
      await routesPostApi({
        routeName: '/channels',
        params,
      });
      connection.data.emit('join-room', input.channel);
    } catch (error) {
      console.log('error', error);
    }
  };
  return (
    <div>
      <div className='pt-20 flex justify-center w-full h-full items-center'>
        <form
          onSubmit={handleEnter}
          className='flex flex-col gap-4 p-4 shadow-lg w-full max-w-xl rounded-md'
        >
          <Input
            label='Username'
            value={input.username}
            onChange={(e: string) => setInput({ ...input, username: e })}
            required={true}
          />
          <Input
            label='Channel'
            value={input.channel}
            onChange={(e: string) => setInput({ ...input, channel: e })}
            required={true}
          />

          <button type='submit' className='btn-blue'>
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
