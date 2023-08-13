import { FaBars, FaHashtag } from 'react-icons/fa';
import { IoExit } from 'react-icons/io5';
import { configStore } from '../store/ConfigStore';

interface IHeader {
  title: string;
  isChannel: boolean;
  handleLeaveChannel: () => void;
}

export default function Header({
  title,
  isChannel,
  handleLeaveChannel,
}: IHeader) {
  const { changeSideModalStatus, sideModalOpen, isSmallScreen } = configStore(
    (state) => state
  );

  console.log('isSmallScreen', isSmallScreen);

  return (
    <div className='primary-blue-bg h-16 items-center flex pl-4 shadow-md justify-between w-full'>
      {isSmallScreen && (
        <div>
          <FaBars
            onClick={() => changeSideModalStatus(!sideModalOpen)}
            className='w-5 h-5 cursor-pointer flex md:hidden mr-2 icon-primary-color'
          />
        </div>
      )}
      <div className='flex items-center gap-1 overflow-auto'>
        {isChannel && (
          <span>
            <FaHashtag color={'white'} />
          </span>
        )}
        <p className='text-white limit-text-lenght'>{title}</p>
      </div>
      {isChannel && (
        <div className=' text-black p mr-4 rounded-md'>
          <button
            onClick={handleLeaveChannel}
            className='flex gap-2 items-center text-white hover:text-slate-200'
          >
            <IoExit size='1.6rem' />
          </button>
        </div>
      )}
    </div>
  );
}
