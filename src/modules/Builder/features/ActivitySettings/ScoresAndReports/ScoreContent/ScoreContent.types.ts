import { FieldValues, UseFormSetValue } from 'react-hook-form';

import { ActivityFormValues, ItemFormValuesCommonType } from 'modules/Builder/types';
import { MultiSelectItem, ScoreOrSection, SingleSelectItem, SliderItem } from 'shared/state';
import { DataTableItem } from 'shared/components';
import { CalculationType } from 'shared/consts';

export type ScoreContentProps = {
  name: string;
  title: string;
  index: number;
  'data-testid'?: string;
  items: DataTableItem[];
  tableItems: DataTableItem[];
  scoreItems: ItemsWithScore[];
};

export type GetScoreRangeLabel = {
  minScore: number;
  maxScore: number;
};

export type ItemsWithScore =
  | SingleSelectItem<ItemFormValuesCommonType>
  | MultiSelectItem<ItemFormValuesCommonType>
  | SliderItem<ItemFormValuesCommonType>;

export type UpdateMessagesWithVariable = {
  setValue: UseFormSetValue<FieldValues>;
  reportsName: string;
  reports: ScoreOrSection[];
  oldScoreId: string;
  newScoreId: string;
};

export type UpdateMessage = {
  setValue: UseFormSetValue<FieldValues>;
  fieldName: string;
  id: string;
  newScoreId: string;
  showMessage: boolean;
  message?: string;
};

export type GetScoreRange = {
  items: ItemsWithScore[];
  calculationType: CalculationType;
  activity?: ActivityFormValues;
};
