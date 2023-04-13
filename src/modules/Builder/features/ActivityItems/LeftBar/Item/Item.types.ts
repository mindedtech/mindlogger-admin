import { ItemFormValues } from 'modules/Builder/pages/BuilderApplet';

import { LeftBarProps } from '../LeftBar.types';

export type ItemProps = { item: ItemFormValues; name: string } & Omit<
  LeftBarProps,
  'items' | 'onAddItem'
>;

export type ActionsType = {
  onRemoveItem: LeftBarProps['onRemoveItem'];
  onChangeVisibility: () => void;
};
