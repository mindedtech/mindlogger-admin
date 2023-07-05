import { ConditionType, ItemResponseType } from 'shared/consts';

export const CONDITION_TYPES_TO_HAVE_OPTION_ID = [
  ConditionType.IncludesOption,
  ConditionType.NotIncludesOption,
  ConditionType.EqualToOption,
  ConditionType.NotEqualToOption,
];

export const defaultFlankerBtnObj = { text: '', image: '' };

export const ALLOWED_TYPES_IN_VARIABLES = [
  ItemResponseType.SingleSelection,
  ItemResponseType.MultipleSelection,
  ItemResponseType.Slider,
  ItemResponseType.Date,
  ItemResponseType.NumberSelection,
  ItemResponseType.TimeRange,
  ItemResponseType.Text,
];

export const ordinalStrings = ['First', 'Second', 'Third', 'Fourth'];

export const enum ItemTestFunctions {
  UniqueItemName = '',
  VariableInTheSameItem = 'variable-in-the-same-item-error',
  VariableIsNotSupported = 'variable-is-not-supported-error',
  VariableReferringToSkippedItem = 'variable-referring-to-skipped-item-error',
}
