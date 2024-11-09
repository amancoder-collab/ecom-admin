// import { TextField, TextFieldProps } from '@mui/material';
// import { Controller } from 'react-hook-form';

// export const CustomTextField = ({
//   name,
//   label,
//   placeholder,
//   type = 'text',
//   variant = 'outlined',
//   ...otherProps
// }: TextFieldProps) => {
//   const { InputLabelProps, ...rest } = otherProps;

//   return (
//     <TextField
//       helperText={error ? error.message : null}
//       error={!!error}
//       onChange={
//         type === 'number'
//           ? (e: React.ChangeEvent<HTMLInputElement>) => {
//               const value = e.target.value;
//               onChange(value ? Number(value) : null);
//             }
//           : onChange
//       }
//       value={value}
//       fullWidth
//       placeholder={placeholder}
//       label={label}
//       type={type}
//       {...rest}
//       variant="outlined"
//       InputLabelProps={{
//         shrink: true,
//         ...InputLabelProps,
//       }}
//     />
//   );
// };
