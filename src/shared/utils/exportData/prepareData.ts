import { AppletExportData, ExportDataResult } from 'shared/types/answer';
import { useDecryptedActivityData } from 'modules/Dashboard/hooks';

import { getObjectFromList } from '../getObjectFromList';
import {
  getAnswersWithPublicUrls,
  getParsedAnswers,
  remapFailedAnswers,
} from '../getParsedAnswers';
import {
  getABTrailsItemsData,
  getDrawingItemsData,
  getFlankerItemsData,
  getStabilityTrackerItemsData,
} from './getItemsData';
import { getActivityJourneyData, getMediaData, getReportData } from './getReportAndMediaData';
import { logDataInDebugMode } from '../logger';

export interface ExportDataFilters {
  activityId?: string;
  flowId?: string;
  targetSubjectId?: string;
}

export const getDefaultExportData = (): AppletExportData => ({
  reportData: [],
  activityJourneyData: [],
  mediaData: [],
  drawingItemsData: [],
  stabilityTrackerItemsData: [],
  abTrailsItemsData: [],
  flankerItemsData: [],
});

export const getParsedAnswersFilterFn = (filters?: ExportDataFilters) => {
  const filterKeys = Object.keys(filters ?? {}) as (keyof typeof filters)[];

  return ({ decryptedAnswers }: Awaited<ReturnType<typeof getParsedAnswers>>[number]) =>
    decryptedAnswers.some((decryptedAnswers) =>
      filterKeys.reduce((acc, filterKey) => {
        if (acc === false) {
          return acc;
        }

        const filterValue = filters?.[filterKey];

        return !filterValue ? acc : decryptedAnswers[filterKey] === filterValue;
      }, true),
    );
};

export const prepareData = async (
  data: ExportDataResult,
  getDecryptedAnswers: ReturnType<typeof useDecryptedActivityData>,
  filters?: ExportDataFilters,
) => {
  const parsedAnswers = await getParsedAnswers(data, getDecryptedAnswers);
  logDataInDebugMode({ parsedAnswersWithoutHiddenItems: parsedAnswers });
  const filteredParsedAnswers = parsedAnswers.filter(getParsedAnswersFilterFn(filters));
  const remappedParsedAnswers = remapFailedAnswers(filteredParsedAnswers);
  const parsedAnswersWithPublicUrls = await getAnswersWithPublicUrls(remappedParsedAnswers);
  let acc: AppletExportData = getDefaultExportData();

  for await (const data of parsedAnswersWithPublicUrls) {
    const rawAnswersObject = getObjectFromList(
      data.decryptedAnswers,
      (item) => item.activityItem.name,
    );

    const reportData = getReportData(acc.reportData, rawAnswersObject, data.decryptedAnswers);
    const mediaData = getMediaData(acc.mediaData, data.decryptedAnswers);
    const activityJourneyData = getActivityJourneyData(
      acc.activityJourneyData,
      rawAnswersObject,
      data.decryptedAnswers,
      data.decryptedEvents,
    );
    const drawingItemsData = await getDrawingItemsData(acc.drawingItemsData, data.decryptedAnswers);
    const stabilityTrackerItemsData = await getStabilityTrackerItemsData(
      acc.stabilityTrackerItemsData,
      data.decryptedAnswers,
    );
    const abTrailsItemsData = await getABTrailsItemsData(
      acc.abTrailsItemsData,
      data.decryptedAnswers,
    );
    const flankerItemsData = await getFlankerItemsData(acc.flankerItemsData, data.decryptedAnswers);

    acc = {
      reportData,
      activityJourneyData,
      mediaData,
      drawingItemsData,
      stabilityTrackerItemsData,
      abTrailsItemsData,
      flankerItemsData,
    };
  }

  return acc;
};
