import {
  AnswerWithWrapper,
  AppletExportData,
  DecryptedABTrailsAnswer,
  DecryptedActivityData,
  DecryptedAnswerData,
  DecryptedDrawingAnswer,
  DecryptedFlankerAnswerItemValue,
  DecryptedMediaAnswer,
  DecryptedStabilityTrackerAnswer,
  DecryptedStabilityTrackerAnswerObject,
  EventDTO,
  ExportCsvData,
  ExportDataResult,
  ExportMediaData,
  ExtendedExportAnswer,
  ExtendedExportAnswerWithoutEncryption,
  UserActionType,
} from 'shared/types/answer';
import { ItemResponseType, ItemsWithFileResponses } from 'shared/consts';
import { FlankerConfig, Item } from 'shared/state';
import { postFilePresignApi } from 'shared/api';

import {
  getStabilityTrackerCsvName,
  getFlankerCsvName,
  getABTrailsCsvName,
  getFileExtension,
  getMediaFileName,
} from './getReportName';
import { getFlankerRecords } from './getFlankerRecords';
import { getStabilityRecords } from './getStabilityRecords';
import { getSplashScreen } from './getJourneyCSVObject';
import { getObjectFromList } from '../getObjectFromList';
import { convertJsonToCsv } from '../exportTemplate';
import { getParsedAnswers } from '../getParsedAnswers';
import { getReportCSVObject } from './getReportCSVObject';
import { getJourneyCSVObject } from './getJourneyCSVObject';
import { getSubscales } from './getSubscales';
import { getDrawingLines } from './getDrawingLines';
import { getABTrailsRecords } from './getABTrailsRecords';
import { convertDateStampToMs } from './convertDateStampToMs';
import { checkIfHasMigratedAnswers, getIdBeforeMigration } from './migratedData';

const getDecryptedAnswersObject = ({
  decryptedAnswers,
  hasMigratedAnswers,
  hasUrlEventScreen,
}: {
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[];
  hasMigratedAnswers?: boolean;
  hasUrlEventScreen?: boolean;
}) =>
  getObjectFromList(decryptedAnswers, (item) => {
    if (hasUrlEventScreen) return item.activityItem.name;
    if (hasMigratedAnswers) {
      return `${getIdBeforeMigration(item.activityId)}/${getIdBeforeMigration(
        item.activityItem.id,
      )}`;
    }

    return `${item.activityId}/${item.activityItem.id}`;
  });

const getReportData = (
  reportData: AppletExportData['reportData'],
  rawAnswersObject: Record<string, DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>>,
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => {
  const answers = decryptedAnswers.reduce(
    (filteredAcc, item, index) => {
      if (item.answer === null) return filteredAcc;

      return filteredAcc.concat(
        getReportCSVObject({
          item,
          rawAnswersObject,
          index,
        }),
      );
    },
    [] as ReturnType<typeof getReportCSVObject>[],
  );

  const subscaleSetting = decryptedAnswers?.[0]?.subscaleSetting;
  if (subscaleSetting?.subscales?.length) {
    answers.splice(0, 1, {
      ...answers[0],
      ...getSubscales(subscaleSetting, rawAnswersObject),
    });
  }

  return reportData.concat(answers);
};

const checkIfDrawingMediaConditionPassed = (
  item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>,
) => item.activityItem?.responseType === ItemResponseType.Drawing && item.answer;
const shouldConvertPrivateDrawingUrl = (
  item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>,
) => checkIfDrawingMediaConditionPassed(item) && (item.answer as DecryptedDrawingAnswer).value.uri;
const checkIfNotMediaItem = (item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>) =>
  !ItemsWithFileResponses.includes(item.activityItem?.responseType) || !item.answer;
const getDrawingUrl = (item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>) => {
  const drawingAnswer = item.answer as DecryptedDrawingAnswer;
  if (drawingAnswer.value.uri) return drawingAnswer.value.uri;

  const blob = new Blob([drawingAnswer.value.svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  return url;
};
const getMediaUrl = (item: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>) =>
  (item.answer as DecryptedMediaAnswer)?.value || '';

const getAnswersWithPublicUrls = async (
  parsedAnswers: DecryptedActivityData<ExtendedExportAnswerWithoutEncryption>[],
) => {
  if (!parsedAnswers.length) return [];

  const privateUrls = parsedAnswers.reduce((acc, data) => {
    const decryptedAnswers = data.decryptedAnswers.reduce((urlsAcc, item) => {
      if (shouldConvertPrivateDrawingUrl(item)) {
        return urlsAcc.concat(getDrawingUrl(item));
      }
      if (checkIfNotMediaItem(item)) return urlsAcc;

      return urlsAcc.concat(getMediaUrl(item));
    }, [] as string[]);

    return acc.concat(decryptedAnswers);
  }, [] as string[]);

  let publicUrls: string[] = [];
  if (privateUrls.length) {
    try {
      const appletId = parsedAnswers[0].decryptedAnswers[0].appletId;
      publicUrls = (await postFilePresignApi(appletId, privateUrls)).data?.result ?? [];
    } catch (e) {
      console.warn(e);
    }
  }
  let publicUrlIndex = 0;

  return parsedAnswers.reduce((acc, data) => {
    const decryptedAnswers = data.decryptedAnswers.reduce((decryptedAnswersAcc, item) => {
      if (shouldConvertPrivateDrawingUrl(item)) {
        return decryptedAnswersAcc.concat({
          ...item,
          answer: {
            ...(item.answer as DecryptedDrawingAnswer),
            value: {
              ...(item.answer as DecryptedDrawingAnswer).value,
              uri: publicUrls[publicUrlIndex++] ?? '',
            },
          },
        });
      }
      if (checkIfNotMediaItem(item)) return decryptedAnswersAcc.concat(item);

      return decryptedAnswersAcc.concat({
        ...item,
        answer: {
          ...(item.answer as DecryptedMediaAnswer),
          value: publicUrls[publicUrlIndex++] ?? '',
        },
      });
    }, [] as DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[]);

    return acc.concat({
      ...data,
      decryptedAnswers,
    });
  }, [] as DecryptedActivityData<ExtendedExportAnswerWithoutEncryption>[]);
};

const getMediaData = (
  mediaData: AppletExportData['mediaData'],
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => {
  const mediaAnswers = decryptedAnswers.reduce((filteredAcc, item) => {
    if (checkIfDrawingMediaConditionPassed(item))
      return filteredAcc.concat({
        fileName: getMediaFileName(item, 'svg'),
        url: getDrawingUrl(item),
      });
    const responseType = item.activityItem?.responseType;
    const url = getMediaUrl(item);
    if (!ItemsWithFileResponses.includes(responseType) || !url) return filteredAcc;

    return filteredAcc.concat({
      fileName: getMediaFileName(item, getFileExtension(url)),
      url,
    });
  }, [] as ExportMediaData[]);

  return mediaData.concat(...mediaAnswers);
};

export const searchItemNameInUrlScreen = (screen: string) => screen.split('/').pop() ?? '';
export const checkIfScreenHasUrl = (screen: string) => /^https?:\/\//.test(screen);
// For ex.:
// screen: "https://raw.githubusercontent.com/ChildMindInstitute/NIMH_EMA_applet/master/activities/<activity_name>/items/<item_name>"
export const checkIfHasJsonLdEventScreen = (decryptedEvents: EventDTO[]) => {
  if (!decryptedEvents.length) return false;

  return checkIfScreenHasUrl(decryptedEvents[0]?.screen);
};
export const getEventScreenWrapper =
  ({ hasUrlEventScreen }: { hasUrlEventScreen: boolean }) =>
  (screen: string) => {
    if (!hasUrlEventScreen) return screen;

    return searchItemNameInUrlScreen(screen);
  };

const getActivityJourneyData = (
  activityJourneyData: AppletExportData['activityJourneyData'],
  rawAnswersObject: Record<string, DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>>,
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
  decryptedEvents: EventDTO[],
) => {
  const hasMigratedAnswers = checkIfHasMigratedAnswers(decryptedAnswers);
  const hasUrlEventScreen = checkIfHasJsonLdEventScreen(decryptedEvents);
  const getEventScreen = getEventScreenWrapper({ hasUrlEventScreen });
  const decryptedAnswersObject = getDecryptedAnswersObject({
    decryptedAnswers,
    hasMigratedAnswers,
    hasUrlEventScreen,
  });
  let indexForABTrailsFiles = 0;
  const events = decryptedEvents.map((event, index, events) => {
    if (index === 0 && !decryptedAnswersObject[getEventScreen(event.screen)] && events[index + 1])
      return getSplashScreen(event, {
        ...events[index + 1],
        ...decryptedAnswersObject[getEventScreen(events[index + 1].screen)],
      });

    return getJourneyCSVObject({
      event: {
        ...event,
        ...decryptedAnswersObject[getEventScreen(event.screen)],
      },
      rawAnswersObject,
      index:
        event.type === UserActionType.SetAnswer ? indexForABTrailsFiles++ : indexForABTrailsFiles,
    });
  });

  return activityJourneyData.concat(...events).filter(Boolean);
};

const getDrawingItemsData = (
  drawingItemsData: AppletExportData['drawingItemsData'],
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => {
  const drawingAnswers = decryptedAnswers.reduce((acc, item) => {
    const responseType = item.activityItem?.responseType;
    if (responseType !== ItemResponseType.Drawing || item.answer === null) return acc;
    const drawingValue = (item.answer as DecryptedDrawingAnswer).value;

    return acc.concat({
      name: getMediaFileName(item, 'csv'),
      data: convertJsonToCsv(getDrawingLines(drawingValue.lines, drawingValue.width || 100)),
    });
  }, [] as ExportCsvData[]);

  return drawingItemsData.concat(...drawingAnswers);
};

const getStabilityTrackerItemsData = (
  stabilityTrackerItemsData: AppletExportData['stabilityTrackerItemsData'],
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => {
  const stabilityTrackerAnswers = decryptedAnswers.reduce((acc, item) => {
    const responseType = item.activityItem?.responseType;
    if (responseType !== ItemResponseType.StabilityTracker) return acc;

    const answer = <DecryptedStabilityTrackerAnswer>item.answer;
    const stabilityTrackerValue = (answer as DecryptedStabilityTrackerAnswerObject).phaseType
      ? <DecryptedStabilityTrackerAnswerObject>answer
      : (answer.value as DecryptedStabilityTrackerAnswerObject);

    return acc.concat({
      name: getStabilityTrackerCsvName(item.id, stabilityTrackerValue.phaseType),
      data: convertJsonToCsv(getStabilityRecords(stabilityTrackerValue.value)),
    });
  }, [] as ExportCsvData[]);

  return stabilityTrackerItemsData.concat(...stabilityTrackerAnswers);
};

const getABTrailsItemsData = (
  abTrackerItemsData: AppletExportData['abTrailsItemsData'],
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => {
  const abTrackerAnswers = decryptedAnswers.reduce((acc, item, index) => {
    const responseType = item.activityItem?.responseType;
    if (responseType !== ItemResponseType.ABTrails) return acc;

    const abTrackerValue = (item.answer as DecryptedABTrailsAnswer).value;

    return acc.concat({
      name: getABTrailsCsvName(index, item.id),
      data: convertJsonToCsv(getABTrailsRecords(abTrackerValue.lines, abTrackerValue.width || 100)),
    });
  }, [] as ExportCsvData[]);

  return abTrackerItemsData.concat(...abTrackerAnswers);
};

const getFlankerItemsData = (
  flankerItemsData: AppletExportData['flankerItemsData'],
  decryptedAnswers: DecryptedAnswerData<ExtendedExportAnswerWithoutEncryption>[],
) => {
  const flankerAnswers = decryptedAnswers.reduce((acc, item, itemIndex) => {
    const responseType = item.activityItem?.responseType;
    if (responseType !== ItemResponseType.Flanker || !item.answer) return acc;

    const flankerValue =
      (item.answer as AnswerWithWrapper<DecryptedFlankerAnswerItemValue[]>)?.value ?? item.answer;

    return acc.concat({
      name: getFlankerCsvName(item),
      data: convertJsonToCsv(
        getFlankerRecords({
          responses: flankerValue,
          item: item.activityItem as Item<FlankerConfig>,
          experimentClock: convertDateStampToMs(item.startDatetime),
          itemIndex,
        }),
      ),
    });
  }, [] as ExportCsvData[]);

  return flankerItemsData.concat(...flankerAnswers);
};

export const prepareData = async (
  data: ExportDataResult,
  getDecryptedAnswers: (
    data: ExtendedExportAnswer,
  ) => DecryptedActivityData<ExtendedExportAnswerWithoutEncryption>,
) => {
  const parsedAnswers = getParsedAnswers(data, getDecryptedAnswers);
  const parsedAnswersWithPublicUrls = await getAnswersWithPublicUrls(parsedAnswers);

  return parsedAnswersWithPublicUrls.reduce(
    (acc, data) => {
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
      const drawingItemsData = getDrawingItemsData(acc.drawingItemsData, data.decryptedAnswers);
      const stabilityTrackerItemsData = getStabilityTrackerItemsData(
        acc.stabilityTrackerItemsData,
        data.decryptedAnswers,
      );
      const abTrailsItemsData = getABTrailsItemsData(acc.abTrailsItemsData, data.decryptedAnswers);
      const flankerItemsData = getFlankerItemsData(acc.flankerItemsData, data.decryptedAnswers);

      return {
        reportData,
        activityJourneyData,
        mediaData,
        drawingItemsData,
        stabilityTrackerItemsData,
        abTrailsItemsData,
        flankerItemsData,
      };
    },
    {
      reportData: [],
      activityJourneyData: [],
      mediaData: [],
      drawingItemsData: [],
      stabilityTrackerItemsData: [],
      abTrailsItemsData: [],
      flankerItemsData: [],
    } as AppletExportData,
  );
};
