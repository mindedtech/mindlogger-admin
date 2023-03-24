import { TextFieldProps } from '@mui/material/TextField';
import { FieldValues, UseControllerProps } from 'react-hook-form';

type FormInputProps = {
  textAdornment?: string;
  tooltip?: string;
  maxLength?: number;
  minNumberValue?: number;
  maxNumberValue?: number;
  isEmptyStringAllowed?: boolean;
  onAddNumber?: (value: number) => void;
  onDistractNumber?: (value: number) => void;
} & TextFieldProps;

export type InputControllerProps<T extends FieldValues> = FormInputProps & UseControllerProps<T>;
