import { FaHashtag } from 'react-icons/fa';
export default function Channel({ label, displayChannelDetails }: any) {
  const num = displayChannelDetails(label)?.unread;
  return (
    <div className='sidebar-item flex justify-between items-center'>
      <div className='flex items-center'>
        <FaHashtag size={15} />
        <p>{label}</p>
      </div>
      {num > 0 && (
        <span className='bg-red-500 px-2 rounded-md text-white'>{num}</span>
      )}
    </div>
  );
}
