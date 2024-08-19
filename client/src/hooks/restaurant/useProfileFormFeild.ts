import { useState } from 'react';

export const useProfileFormField = (initialValue: string) => {
  const [value, setValue] = useState<string>(initialValue);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  return {
    value,
    onChange: handleChange,
  };
};
