import { ConditionalLogic } from 'shared/state';
import { ItemFormValues } from 'modules/Builder/types';

export type SaveAndPublishProps = {
  hasPrompt: boolean;
};

export const enum ElementType {
  Item = 'item',
  Subscale = 'subscale',
}

export type GetItemCommonFields = {
  id?: string;
  item: ItemFormValues;
  items: ItemFormValues[];
  conditionalLogic?: ConditionalLogic[];
};
