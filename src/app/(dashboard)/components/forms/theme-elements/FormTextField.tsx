import { Controller } from 'react-hook-form';
import CustomTextField from './CustomTextField';
import { InputBaseComponentProps, TextFieldProps } from '@mui/material';

interface FormTextFieldProps {
  type?: string;
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
}

export const FormTextField = ({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  ...otherProps
}: FormTextFieldProps & TextFieldProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <CustomTextField
          helperText={error ? error.message : null}
          error={!!error}
          onChange={
            type === 'number'
              ? (e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value;
                  onChange(value ? Number(value) : null);
                }
              : onChange
          }
          value={value}
          fullWidth
          placeholder={placeholder}
          label={label}
          type={type}
          variant="outlined"
          {...otherProps}
        />
      )}
    />
  );
};
