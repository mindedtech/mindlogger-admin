import { SingleAndMultipleSelectItemResponseValues, SliderItemResponseValues } from 'shared/state';
import { ItemResponseType } from 'shared/consts';

import { joinWihComma } from '../joinWihComma';
import { createArrayFromMinToMax } from '../array';

export const parseOptions = (
  responseValues: SingleAndMultipleSelectItemResponseValues & SliderItemResponseValues,
  type: ItemResponseType,
) => {
  if (type === ItemResponseType.Slider) {
    const min = Number(responseValues?.minValue);
    const max = Number(responseValues?.maxValue);
    const scores = responseValues?.scores;
    const options = createArrayFromMinToMax(min, max);

    return joinWihComma(
      options?.map(
        (item, i) => `${item}: ${item}${scores?.length ? ` (score: ${scores[i]})` : ''}`,
      ) || [],
    );
  }

  if (responseValues?.options?.length) {
    return joinWihComma(
      responseValues?.options?.map(
        ({ text, value, score }) =>
          `${text}${value ? `: ${value}` : ''}${score ? ` (score: ${score})` : ''}`,
      ) || [],
    );
  }
};
