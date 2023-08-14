import { FaHashtag } from 'react-icons/fa';
import { IChannelMessageDetails } from '../store/MessageStore';

interface IChannel {
  label: string;
  displayChannelDetails: (
    value?: string | undefined
  ) => IChannelMessageDetails | null;
}

export default function Channel({ label, displayChannelDetails }: IChannel) {
  const num = displayChannelDetails(label)?.unread ?? 0;
  return (
    <div className='sidebar-item flex justify-between items-center'>
      <div className='flex items-center overflow-auto'>
        <span>
          <FaHashtag size={15} />
        </span>
        <p className='limit-text-lenght'>{label}</p>
      </div>
      {num > 0 && (
        <span className='bg-red-500 px-2 rounded-md text-white'>{num}</span>
      )}
    </div>
  );
}
