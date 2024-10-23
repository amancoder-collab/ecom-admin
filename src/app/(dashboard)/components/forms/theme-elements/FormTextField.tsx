import {
  OutlinedTextFieldProps,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { Controller } from 'react-hook-form';

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
  variant = 'outlined',
  ...otherProps
}: FormTextFieldProps & TextFieldProps) => {
  const { InputLabelProps, ...rest } = otherProps;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
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
          {...rest}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
            ...InputLabelProps,
          }}
        />
      )}
    />
  );
};
