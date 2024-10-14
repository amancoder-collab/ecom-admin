import { Controller } from 'react-hook-form';
import CustomTextField from './CustomTextField';

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
}: FormTextFieldProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState,
      }) => (
        <CustomTextField
          helperText={error ? error.message : null}
          size="small"
          error={!!error}
          onChange={onChange}
          value={value}
          fullWidth
          placeholder={placeholder}
          label={label}
          type={type}
          variant="outlined"
        />
      )}
    />
  );
};
