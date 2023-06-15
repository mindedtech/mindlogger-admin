import { ConditionRowType } from 'modules/Builder/types';

export type ConditionContentProps = {
  name: string;
  type: ConditionRowType;
  scoreId?: string;
  scoreName?: string;
};
