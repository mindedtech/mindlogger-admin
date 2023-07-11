import { ItemResponseType } from 'shared/consts';
import { ActivityItemAnswer } from 'shared/types';
import { getAnswerValue } from 'shared/utils';

export const getDefaultValue = (responseType: ItemResponseType): string | number[] | null => {
  switch (responseType) {
    case ItemResponseType.Slider:
      return null;
    case ItemResponseType.MultipleSelection:
      return [];
    default:
      return '';
  }
};

export const getDefaultFormValues = (assessment: ActivityItemAnswer[]) => ({
  newNote: '',
  assessmentItems:
    assessment?.map(({ activityItem, answer }) => ({
      itemId: activityItem.id,
      answers: getAnswerValue(answer) || getDefaultValue(activityItem.responseType),
    })) ?? [],
});
