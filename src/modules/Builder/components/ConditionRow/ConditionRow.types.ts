import { ConditionRowType } from 'modules/Builder/types';

import { ConditionItemType } from './Condition';

export type ConditionRowProps = {
  name: string;
  index: number;
  onRemove: () => void;
  type?: ConditionRowType;
  scoreKey?: string;
  autoTrigger?: boolean;
  showError?: boolean;
  'data-testid'?: string;
};

export type OptionListItem = { labelKey: string; value: string; type: ConditionItemType };
