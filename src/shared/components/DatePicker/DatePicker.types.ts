import { FieldValues, UseControllerProps } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';
import { SxProps } from '@mui/material';

export type DateType = Date | null;
export type DateArrayType = DateType[];

export const enum DateVariant {
  Start = 'start',
  End = 'end',
}

export const enum UiType {
  OneDate = 'oneDate',
  StartEndingDate = 'startEndingDate',
}

type DatePicker = {
  uiType?: UiType;
  inputSx?: SxProps;
  label?: string;
  minDate?: Date | null;
  maxDate?: Date | null;
} & TextFieldProps;

export type DatePickerProps<T extends FieldValues> = DatePicker & UseControllerProps<T>;
