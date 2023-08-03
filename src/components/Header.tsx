import React from 'react';

export default function Header({ title, isChannel, handleLeaveChannel }: any) {
  return (
    <div className='bg-blue-600 h-16 items-center flex pl-4 shadow-md justify-between'>
      <h3 className='text-white'>{title}</h3>
      {isChannel && (
        <div className='bg-white text-black p-2 mr-4 rounded-md'>
          <button onClick={handleLeaveChannel}>Leave</button>
        </div>
      )}
    </div>
  );
}
