import { FaHashtag } from 'react-icons/fa';
import { IoExit } from 'react-icons/io5';

export default function Header({ title, isChannel, handleLeaveChannel }: any) {
  return (
    <div className='primary-blue-bg h-16 items-center flex pl-4 shadow-md justify-between'>
      <div className='flex items-center gap-1'>
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
