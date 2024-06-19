import { ReactNode } from 'react';

import { ConditionType } from 'shared/consts';

import {
  ConditionItem,
  ConditionProps,
  NumberSelectionConditionItem,
  ScoreConditionItem,
  SliderConditionItem,
} from '../Condition.types';

export type SwitchConditionProps = {
  selectedItem?: ConditionItem;
  dataTestid: ConditionProps['data-testid'];
  children: ReactNode;
} & Pick<ConditionProps, 'payloadName' | 'state' | 'valueOptions'>;

export type GetConditionMinMaxRangeValuesProps = {
  item?: SliderConditionItem | NumberSelectionConditionItem | ScoreConditionItem;
  minValue: number;
  maxValue: number;
};

export type GetConditionMinMaxValuesProps = {
  item?: SliderConditionItem | NumberSelectionConditionItem | ScoreConditionItem;
  state: ConditionType;
};
