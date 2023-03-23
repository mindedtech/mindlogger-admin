import * as yup from 'yup';

import i18n from 'i18n';

import { SELECTION_ROW_OPTION_LABEL_MAX_LENGTH } from './ItemConfiguration.const';

export const SelectionRowsItemScheme = () => {
  const { t } = i18n;

  const numberValueIsRequired = t('numberValueIsRequired');

  const maxLengthLabel = ({ max }: { max: number }) =>
    t('visibilityDecreasesOverMaxCharacters', { max });

  return yup.object({
    label: yup.string().max(SELECTION_ROW_OPTION_LABEL_MAX_LENGTH, maxLengthLabel),
    tooltip: yup.string(),
    image: yup.string(),
    scores: yup.array().of(yup.number().required(numberValueIsRequired)),
  });
};

export const SelectionRowsOptionScheme = () => {
  const { t } = i18n;

  const maxLengthLabel = ({ max }: { max: number }) =>
    t('visibilityDecreasesOverMaxCharacters', { max });

  return yup.object({
    label: yup.string().max(SELECTION_ROW_OPTION_LABEL_MAX_LENGTH, maxLengthLabel),
    tooltip: yup.string(),
    image: yup.string(),
  });
};

export const SelectionRowsScheme = () =>
  yup.object({
    items: yup.array().of(SelectionRowsItemScheme()),
    options: yup.array().of(SelectionRowsOptionScheme()),
    type: yup.string(),
  });

export const itemConfigurationFormSchema = () => {
  const { t } = i18n;
  const itemNameRequired = t('itemNameRequired');
  const itemNameSymbols = t('itemNameSymbols');
  const minValueLessThanMax = t('minValueLessThanMax');
  const minValuePositiveInt = t('minValuePositiveInt');
  const maxValueBiggerThanMin = t('maxValueBiggerThanMin');
  const maxValuePositiveInt = t('maxValuePositiveInt');

  return yup
    .object({
      name: yup
        .string()
        .required(itemNameRequired)
        .matches(/^[a-zA-Z0-9_]+$/, itemNameSymbols),
      minNumber: yup
        .number()
        .typeError(minValuePositiveInt)
        .lessThan(yup.ref('maxNumber'), minValueLessThanMax),
      maxNumber: yup
        .number()
        .typeError(maxValuePositiveInt)
        .moreThan(yup.ref('minNumber'), maxValueBiggerThanMin),
      selectionRows: SelectionRowsScheme(),
    })
    .required();
};
