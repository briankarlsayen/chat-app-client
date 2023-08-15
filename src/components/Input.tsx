import { InputHTMLAttributes } from 'react';

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value: string;
  hasLenLimit?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  label,
  value,
  onChange,
  hasLenLimit,
  ...rest
}: IInput) {
  const MAX_LIMIT = 24;
  const lenLimitErr = value?.length > MAX_LIMIT && hasLenLimit;
  let err = `${label} has limit of ${MAX_LIMIT} characters`;
  return (
    <div>
      <div className={`border-2 w-full ${lenLimitErr && 'border-red-300'}`}>
        <input
          type='text'
          value={value}
          placeholder={label}
          onChange={onChange}
          className='w-full p-2 rounded-md outline-none'
          pattern={lenLimitErr ? '^[a-zA-Z0-9]{1,24}$' : undefined} // * dont submit when has limitErr
          title={err}
          {...rest}
        />
      </div>
      {lenLimitErr && (
        <span className='flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1'>
          {err}
        </span>
      )}
    </div>
  );
}
