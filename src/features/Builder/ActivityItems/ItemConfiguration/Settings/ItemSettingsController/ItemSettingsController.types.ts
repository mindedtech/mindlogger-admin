import { FieldValues, UseControllerProps, Path } from 'react-hook-form';

import { ItemInputTypes, ItemConfigurationSettings } from '../../ItemConfiguration.types';

export type ItemSettingsControllerProps<T extends FieldValues> = {
  timerName: Path<T>;
  inputType: ItemInputTypes | '';
} & UseControllerProps<T>;

export type ItemSettingsOptionsGroup = {
  groupName: 'responseSettings' | 'itemSettings';
  groupOptions: ItemConfigurationSettings[];
};

export type ItemSettingsOptionsByInputType = {
  [key in ItemInputTypes]?: ItemSettingsOptionsGroup[];
};
