import React, { InputHTMLAttributes } from 'react';

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: string;
  onChange: (e: any) => void;
}

export default function Input({ label, value, onChange, ...rest }: IInput) {
  return (
    <div className='border-2 w-full'>
      <input
        type='text'
        value={value}
        placeholder={label}
        onChange={(e) => onChange(e.target.value)}
        className='w-full p-2 rounded-md outline-none'
        {...rest}
      />
    </div>
  );
}
