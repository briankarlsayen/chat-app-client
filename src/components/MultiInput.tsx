interface IMultiInput {
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function MultiInput({
  value,
  onChange,
  placeholder,
}: IMultiInput) {
  return (
    <div className=' w-full '>
      <textarea
        id='message'
        rows={4}
        placeholder={placeholder}
        className='w-full outline-none p-2 bg-inherit'
        value={value}
        onChange={onChange}
      ></textarea>
    </div>
  );
}
