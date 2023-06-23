import {
  DecryptedActivityData,
  DecryptedAnswerData,
  ExportActivity,
  ExtendedExportAnswer,
  ExtendedExportAnswerWithoutEncryption,
} from 'shared/types';
import { getObjectFromList } from 'shared/utils/builderHelpers';

import { getParsedAnswers } from '../getParsedAnswers';
import { getReportCSVObject } from './getReportCSVObject';
import { getJourneyCSVObject } from './getJourneyCSVObject';

const getDecryptedAnswersObject = (
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => getObjectFromList(decryptedAnswers, (item) => `${item.activityId}/${item.activityItem.id}`);

export const prepareData = (
  data: { activities: ExportActivity[]; answers: ExtendedExportAnswer[] },
  getDecryptedAnswers: (
    data: ExtendedExportAnswer,
  ) => DecryptedActivityData<ExtendedExportAnswerWithoutEncryption>,
) => {
  const parsedAnswers = getParsedAnswers(data, getDecryptedAnswers);

  return parsedAnswers.reduce(
    (acc, data) => {
      const rawAnswersObject = getObjectFromList(
        data.decryptedAnswers,
        (item) => item.activityItem.name,
      );
      const answers = data.decryptedAnswers.reduce((filteredAcc, item) => {
        if (item.activityItem?.config?.skippableItem) return filteredAcc;

        return filteredAcc.concat(
          getReportCSVObject({
            item,
            rawAnswersObject,
          }),
        );
      }, [] as ReturnType<typeof getReportCSVObject>[]);
      const reportData = acc.reportData.concat(...answers);

      const decryptedAnswersObject = getDecryptedAnswersObject(data.decryptedAnswers);
      const events = data.decryptedEvents.map((event) =>
        getJourneyCSVObject({
          event: {
            ...event,
            ...decryptedAnswersObject[event.screen],
          },
          rawAnswersObject,
        }),
      );
      const activityJourneyData = acc.activityJourneyData.concat(...events);

      return {
        reportData,
        activityJourneyData,
      };
    },
    {
      reportData: [],
      activityJourneyData: [],
    } as {
      reportData: ReturnType<typeof getReportCSVObject>[];
      activityJourneyData: ReturnType<typeof getJourneyCSVObject>[];
    },
  );
};
