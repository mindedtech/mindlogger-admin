import { FieldValues, UseControllerProps } from 'react-hook-form';
import { TextFieldProps } from '@mui/material/TextField';

import { SelectEvent } from 'shared/types/event';

export type Option = {
  value: string | boolean;
  labelKey: string;
  icon?: JSX.Element;
  disabled?: boolean;
  tooltip?: string;
  hidden?: boolean;
};

export type GetMenuItem = {
  labelKey: string;
  value: string | boolean;
  itemDisabled: boolean;
  icon?: JSX.Element;
  withoutKey?: boolean;
  hidden?: boolean;
};

export enum SelectUiType {
  Primary = 'primary',
  Secondary = 'secondary',
}

export type FormInputProps = {
  options: Option[];
  value?: string;
  customChange?: (e: SelectEvent) => void;
  withChecked?: boolean;
  isLabelNeedTranslation?: boolean;
  uiType?: SelectUiType;
} & TextFieldProps;

export type SelectControllerProps<T extends FieldValues> = FormInputProps & UseControllerProps<T>;
