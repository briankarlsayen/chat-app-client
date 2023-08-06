import TimerImg from '../assets/large-timer.gif';

interface ILoading {
  loading: boolean;
}

export default function Loading({ loading }: ILoading) {
  return (
    loading && (
      <div className='absolute top-0 h-full w-full flex items-center bg-inherit transition-opacity duration-300 justify-center'>
        <img
          className='-mt-12 -mr-12 w-[150px] h-[150px]'
          src={TimerImg}
          alt='loading'
        />
      </div>
    )
  );
}
