import {
  DecryptedActivityData,
  ExportActivity,
  ExportDataResult,
  ExtendedExportAnswer,
  ExtendedExportAnswerWithoutEncryption,
} from 'shared/types';
import { getObjectFromList } from './getObjectFromList';

export const getParsedAnswers = (
  result: ExportDataResult,
  getDecryptedActivityData: (
    data: ExtendedExportAnswer,
  ) => DecryptedActivityData<ExtendedExportAnswerWithoutEncryption>,
) => {
  const activitiesObject = getObjectFromList(
    result.activities,
    (activity: ExportActivity) => activity.idVersion,
  );

  return result.answers.map((answer: ExtendedExportAnswer) =>
    getDecryptedActivityData({
      ...answer,
      items: activitiesObject[answer.activityHistoryId].items,
      activityName: activitiesObject[answer.activityHistoryId].name,
      subscaleSetting: activitiesObject[answer.activityHistoryId].subscaleSetting,
    }),
  );
};
