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
  const { changeSideModalStatus, sideModalOpen } = configStore(
    (state) => state
  );

  console.log('sideModalOpen', sideModalOpen);

  return (
    <div className='primary-blue-bg h-16 items-center flex pl-4 shadow-md justify-between'>
      <div className='flex items-center gap-1'>
        <FaBars
          onClick={() => changeSideModalStatus(!sideModalOpen)}
          className='w-10 h-10 p-2 cursor-pointer flex md:hidden'
        />
        {isChannel && <FaHashtag color={'white'} />}
        <h3 className='text-white'>{title}</h3>
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
