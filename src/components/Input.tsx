import { InputHTMLAttributes } from 'react';

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ label, value, onChange, ...rest }: IInput) {
  return (
    <div className='border-2 w-full'>
      <input
        type='text'
        value={value}
        placeholder={label}
        onChange={onChange}
        className='w-full p-2 rounded-md outline-none'
        {...rest}
      />
    </div>
  );
}
