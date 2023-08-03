interface IMultiInput {
  value: string;
  onChange: (e: any) => void;
}

export default function MultiInput({ value, onChange }: IMultiInput) {
  return (
    <div className='border-2 w-full '>
      <textarea
        id='message'
        rows={4}
        placeholder='Your message...'
        className='w-full outline-none p-2'
        value={value}
        onChange={onChange}
      ></textarea>
    </div>
  );
}
