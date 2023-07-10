import { matchPath } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ColorResult } from 'react-color';
import get from 'lodash.get';
import { TestContext } from 'yup';

import i18n from 'i18n';
import { page } from 'resources';
import { Svg } from 'shared/components';
import {
  Activity,
  ActivityFlow,
  AudioPlayerResponseValues,
  Condition,
  ConditionalLogic,
  Config,
  DrawingResponseValues,
  Item,
  ItemAlert,
  NumberItemResponseValues,
  OptionCondition,
  ScoreCondition,
  SingleAndMultipleSelectionOption,
  SingleAndMultipleSelectItemResponseValues,
  SingleAndMultipleSelectRowsResponseValues,
  SingleApplet,
  SliderItemResponseValues,
  SliderRowsResponseValues,
  SubscaleSetting,
} from 'shared/state';
import {
  createArray,
  getDictionaryText,
  getEntityKey,
  getObjectFromList,
  getTextBetweenBrackets,
  Path,
} from 'shared/utils';
import {
  ConditionType,
  DEFAULT_LAMBDA_SLOPE,
  DEFAULT_LENGTH_OF_TEST,
  DEFAULT_MILLISECONDS_DURATION,
  DEFAULT_NUMBER_OF_TRIALS,
  DEFAULT_THRESHOLD_DURATION,
  GyroscopeOrTouch,
  ItemResponseType,
  PerfTaskType,
  ScoreConditionType,
} from 'shared/consts';
import {
  ActivityFormValues,
  AppletFormValues,
  CorrectPress,
  DeviceType,
  FlankerItemNames,
  FlankerNextButton,
  FlankerSamplingMethod,
  GetActivitySubscaleItems,
  GetActivitySubscaleSettingDuplicated,
  GetNewActivity,
  GetNewPerformanceTask,
  GyroscopeItemNames,
  ItemFormValues,
  OrderName,
  RoundTypeEnum,
  TouchItemNames,
} from 'modules/Builder/types';
import { ItemConfigurationSettings } from 'modules/Builder/features/ActivityItems/ItemConfiguration';

import {
  ALLOWED_TYPES_IN_VARIABLES,
  CONDITION_TYPES_TO_HAVE_OPTION_ID,
  defaultFlankerBtnObj,
  ordinalStrings,
  SAMPLE_SIZE,
} from './BuilderApplet.const';

const { t } = i18n;

export const isAppletRoute = (path: string) => matchPath(`${page.builderApplet}/*`, path);

export const isTouchOrGyroscopeRespType = (responseType: ItemResponseType) =>
  responseType === ItemResponseType.StabilityTracker ||
  responseType === ItemResponseType.TouchTest ||
  responseType === ItemResponseType.TouchPractice;

export const isPerfTaskResponseType = (responseType: ItemResponseType) =>
  isTouchOrGyroscopeRespType(responseType) ||
  responseType === ItemResponseType.Flanker ||
  responseType === ItemResponseType.ABTrails;

export const getNewActivityItem = (item?: ItemFormValues) => ({
  responseType: '',
  name: t('newItem'),
  question: '',
  config: {} as Config,
  isHidden: false,
  allowEdit: true,
  ...item,
  id: undefined,
  key: uuidv4(),
  ...((item?.responseType === ItemResponseType.SingleSelection ||
    item?.responseType === ItemResponseType.MultipleSelection) && {
    responseValues: {
      ...item.responseValues,
      options: (item.responseValues as SingleAndMultipleSelectItemResponseValues)?.options?.map(
        (option: SingleAndMultipleSelectionOption) => ({
          ...option,
          id: uuidv4(),
        }),
      ),
    },
  }),
  ...(item?.responseType === ItemResponseType.Slider && {
    responseValues: {
      ...item.responseValues,
      id: uuidv4(),
    },
  }),
});

export const getDuplicatedConditions = (
  oldItems: ItemFormValues[],
  newItems: Record<string, unknown>[],
  conditions?: Condition[],
) =>
  conditions?.map((condition) => {
    const optionValue = (condition as OptionCondition)?.payload.optionValue;
    const itemIndex = oldItems.findIndex((item) => condition.itemName === getEntityKey(item));
    const result = {
      ...condition,
      itemName: getEntityKey(newItems[itemIndex]) ?? '',
      key: uuidv4(),
    };

    if (!optionValue) return result;

    const optionIndex = (
      oldItems[itemIndex]?.responseValues as SingleAndMultipleSelectItemResponseValues
    ).options?.findIndex((option) => option.id === optionValue);

    return {
      ...result,
      payload: {
        optionValue:
          (newItems[itemIndex]?.responseValues as SingleAndMultipleSelectItemResponseValues)
            ?.options?.[optionIndex]?.id ?? '',
      },
    };
  });

export const getDuplicatedConditional = (
  oldItems: ItemFormValues[],
  newItems: Record<string, unknown>[],
  conditionalLogic?: ConditionalLogic[],
) =>
  conditionalLogic?.map((conditional) => {
    const itemKey = conditional.itemKey;

    if (itemKey) {
      const itemIndex = oldItems?.findIndex((item) => itemKey === getEntityKey(item));

      return {
        ...conditional,
        key: uuidv4(),
        itemKey: getEntityKey(newItems?.[itemIndex]) ?? '',
        conditions: getDuplicatedConditions(oldItems, newItems, conditional.conditions),
      };
    }

    return {
      ...conditional,
      itemKey,
    };
  }) ?? [];

export const getNewActivity = ({ name, activity }: GetNewActivity) => {
  const items = activity?.items?.map((item) => getNewActivityItem(item)) || [];
  const conditionalLogic = getDuplicatedConditional(
    activity?.items ?? [],
    items,
    activity?.conditionalLogic,
  );
  const subscaleSetting = getActivitySubscaleSettingDuplicated({
    oldSubscaleSetting: activity?.subscaleSetting,
    oldItems: activity?.items as ItemFormValues[],
    newItems: items as ItemFormValues[],
  });

  return {
    name: name ?? t('newActivity'),
    description: '',
    showAllAtOnce: false,
    isSkippable: false,
    isReviewable: false,
    responseIsEditable: true,
    ...activity,
    items,
    conditionalLogic,
    subscaleSetting,
    id: undefined,
    key: uuidv4(),
  } as ActivityFormValues;
};

const defaultMessageConfig = {
  removeBackButton: true,
  timer: null,
};

const getMessageItem = (name: string, question: string) => ({
  name,
  config: defaultMessageConfig,
  question,
  responseType: ItemResponseType.Message,
});

const getGyroscopeOrTouchItems = (type: GyroscopeOrTouch) => {
  const commonConfigProps = {
    trialsNumber: DEFAULT_NUMBER_OF_TRIALS,
    durationMinutes: DEFAULT_LENGTH_OF_TEST,
    lambdaSlope: DEFAULT_LAMBDA_SLOPE,
  };
  const isGyroscope = type === GyroscopeOrTouch.Gyroscope;

  return [
    getMessageItem(
      isGyroscope ? GyroscopeItemNames.GeneralInstruction : TouchItemNames.GeneralInstruction,
      t('gyroscopeAndTouchInstructions.overview.instruction'),
    ),
    getMessageItem(
      isGyroscope ? GyroscopeItemNames.PracticeInstruction : TouchItemNames.PracticeInstruction,
      t('gyroscopeAndTouchInstructions.practice.instruction'),
    ),
    {
      name: isGyroscope ? GyroscopeItemNames.PracticeRound : TouchItemNames.PracticeRound,
      config: {
        ...commonConfigProps,
        userInputType: isGyroscope ? GyroscopeOrTouch.Gyroscope : GyroscopeOrTouch.Touch,
        phase: RoundTypeEnum.Practice,
      },
      responseType: ItemResponseType.StabilityTracker,
    },
    getMessageItem(
      isGyroscope ? GyroscopeItemNames.TestInstruction : TouchItemNames.TestInstruction,
      t('gyroscopeAndTouchInstructions.test.instruction'),
    ),
    {
      name: isGyroscope ? GyroscopeItemNames.TestRound : TouchItemNames.TestRound,
      config: {
        ...commonConfigProps,
        userInputType: isGyroscope ? GyroscopeOrTouch.Gyroscope : GyroscopeOrTouch.Touch,
        phase: RoundTypeEnum.Test,
      },
      responseType: ItemResponseType.StabilityTracker,
    },
  ];
};

const defaultFlankerCommonConfig = {
  stimulusTrials: [],
  blocks: [],
  buttons: [defaultFlankerBtnObj, { ...defaultFlankerBtnObj, value: CorrectPress.Right }],
  showFixation: false,
  fixationScreen: null,
  fixationDuration: null,
  samplingMethod: FlankerSamplingMethod.Randomize,
  showResults: true,
  trialDuration: DEFAULT_MILLISECONDS_DURATION,
  sampleSize: SAMPLE_SIZE,
};

const defaultFlankerPracticeConfig = {
  showFeedback: true,
  minimumAccuracy: DEFAULT_THRESHOLD_DURATION,
  isLastTest: false,
  blockType: RoundTypeEnum.Practice,
  nextButton: FlankerNextButton.Ok,
};

const defaultFlankerTestConfig = {
  showFeedback: false,
  isFirstPractice: false,
  isLastPractice: false,
  blockType: RoundTypeEnum.Test,
};

const flankerItems = [
  getMessageItem(FlankerItemNames.GeneralInstruction, t('flankerInstructions.general')), //0 General Instruction
  getMessageItem(FlankerItemNames.PracticeInstructionFirst, t('flankerInstructions.practice')), //1 Practice Instruction
  {
    name: FlankerItemNames.PracticeFirst,
    config: {
      ...defaultFlankerCommonConfig,
      ...defaultFlankerPracticeConfig,
      isFirstPractice: true,
      isLastPractice: false,
    },
    responseType: ItemResponseType.Flanker,
  }, //2
  getMessageItem(FlankerItemNames.PracticeInstructionSecond, t('flankerInstructions.next')), //3
  {
    name: FlankerItemNames.PracticeSecond,
    config: {
      ...defaultFlankerCommonConfig,
      ...defaultFlankerPracticeConfig,
      isFirstPractice: false,
      isLastPractice: false,
    },
    responseType: ItemResponseType.Flanker,
  }, //4
  getMessageItem(FlankerItemNames.PracticeInstructionThird, t('flankerInstructions.next')), //5
  {
    name: FlankerItemNames.PracticeThird,
    config: {
      ...defaultFlankerCommonConfig,
      ...defaultFlankerPracticeConfig,
      isFirstPractice: false,
      isLastPractice: true,
    },
    responseType: ItemResponseType.Flanker,
  }, //6
  getMessageItem(FlankerItemNames.TestInstructionFirst, t('flankerInstructions.test')), //7 Test Instruction
  {
    name: FlankerItemNames.TestFirst,
    config: {
      ...defaultFlankerCommonConfig,
      ...defaultFlankerTestConfig,
      isLastTest: false,
    },
    responseType: ItemResponseType.Flanker,
  }, //8
  getMessageItem(FlankerItemNames.TestInstructionSecond, t('flankerInstructions.next')), //9
  {
    name: FlankerItemNames.TestSecond,
    config: {
      ...defaultFlankerCommonConfig,
      ...defaultFlankerTestConfig,
      isLastTest: false,
    },
    responseType: ItemResponseType.Flanker,
  }, //10
  getMessageItem(FlankerItemNames.TestInstructionThird, t('flankerInstructions.next')), //11
  {
    name: FlankerItemNames.TestThird,
    config: {
      ...defaultFlankerCommonConfig,
      ...defaultFlankerTestConfig,
      isLastTest: true,
    },
    responseType: ItemResponseType.Flanker,
  }, //12
];

const getABTrailsItems = (deviceType: DeviceType) =>
  createArray(4, (index) => ({
    id: undefined,
    key: uuidv4(),
    responseType: ItemResponseType.ABTrails,
    name: `${ItemResponseType.ABTrails}_${deviceType}_${index + 1}`,
    config: {
      deviceType,
      orderName: OrderName[ordinalStrings[index] as keyof typeof OrderName],
    },
  }));

export const getNewPerformanceTask = ({
  name,
  description,
  performanceTask,
  performanceTaskType,
}: GetNewPerformanceTask) => {
  const itemsByType = {
    [PerfTaskType.Flanker]: flankerItems,
    [PerfTaskType.Gyroscope]: getGyroscopeOrTouchItems(GyroscopeOrTouch.Gyroscope),
    [PerfTaskType.Touch]: getGyroscopeOrTouchItems(GyroscopeOrTouch.Touch),
    [PerfTaskType.ABTrailsMobile]: getABTrailsItems(DeviceType.Mobile),
    [PerfTaskType.ABTrailsTablet]: getABTrailsItems(DeviceType.Tablet),
  };

  const { items, ...restPerfTaskParams } = performanceTask || {};

  const getItems = () => {
    if (items?.length) {
      return items.map((item) => ({
        ...item,
        id: undefined,
      }));
    }

    return performanceTaskType ? itemsByType[performanceTaskType] : [];
  };

  return {
    name,
    description,
    isHidden: false,
    items: getItems(),
    isPerformanceTask: true,
    performanceTaskType,
    ...restPerfTaskParams,
    id: undefined,
    key: uuidv4(),
  };
};

export const getNewApplet = () => ({
  displayName: '',
  description: '',
  themeId: 'default',
  about: '',
  image: '',
  watermark: '',
  activities: [],
  activityFlows: [],
});

export const getNewActivityFlow = () => ({
  key: uuidv4(),
  name: '',
  description: '',
  isSingleReport: false,
  hideBadge: false,
  isHidden: false,
});

const getActivityItemResponseValues = (item: Item) => {
  switch (item.responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection:
      return {
        options: (item.responseValues as SingleAndMultipleSelectItemResponseValues)?.options?.map(
          (option) => ({
            ...option,
            color: option.color ? ({ hex: option.color } as ColorResult) : undefined,
          }),
        ),
        paletteName:
          (item.responseValues as SingleAndMultipleSelectItemResponseValues).paletteName ??
          undefined,
      };
    case ItemResponseType.SliderRows:
    case ItemResponseType.Slider:
    case ItemResponseType.AudioPlayer:
    case ItemResponseType.Audio:
    case ItemResponseType.NumberSelection:
    case ItemResponseType.Drawing:
      return {
        ...(item.responseValues as
          | SliderRowsResponseValues
          | SliderItemResponseValues
          | NumberItemResponseValues
          | DrawingResponseValues
          | AudioPlayerResponseValues),
        options: undefined,
      };
    case ItemResponseType.SingleSelectionPerRow:
    case ItemResponseType.MultipleSelectionPerRow:
      return item.responseValues;
    default:
      return null;
  }
};

const getAlerts = (item: Item) => {
  const { responseType, responseValues, config } = item;

  if (
    ~[ItemResponseType.SingleSelection, ItemResponseType.MultipleSelection].indexOf(responseType)
  ) {
    const options = (responseValues as SingleAndMultipleSelectItemResponseValues).options;
    const optionsWithAlert = options?.filter(({ alert }) => typeof alert === 'string');

    if (!optionsWithAlert?.length) return [];

    return optionsWithAlert.map(({ id, alert }) => ({
      key: uuidv4(),
      value: id,
      alert,
    }));
  }

  if (responseType === ItemResponseType.Slider) {
    const { alerts } = responseValues as SliderItemResponseValues;
    const isContinuous = get(config, ItemConfigurationSettings.IsContinuous);

    if (!alerts?.length) return [];

    return alerts.map(({ value, minValue, maxValue, alert }) => ({
      key: uuidv4(),
      ...(!isContinuous && { value: `${value}` }),
      ...(isContinuous && { minValue, maxValue }),
      alert,
    }));
  }

  if (responseType === ItemResponseType.SliderRows) {
    const { rows } = responseValues as SliderRowsResponseValues;

    return (
      rows?.flatMap(
        ({ id, alerts }) =>
          alerts?.map(({ value, alert }) => ({ key: uuidv4(), sliderId: id, value, alert })) ?? [],
      ) ?? []
    );
  }

  if (
    ~[ItemResponseType.SingleSelectionPerRow, ItemResponseType.MultipleSelectionPerRow].indexOf(
      responseType,
    )
  ) {
    const { dataMatrix } = responseValues as SingleAndMultipleSelectRowsResponseValues;

    return (
      dataMatrix?.reduce(
        (result: ItemAlert[], { rowId, options }) => [
          ...result,
          ...options.reduce((result: ItemAlert[], { alert, optionId }) => {
            if (typeof alert !== 'string') return result;

            return [...result, { key: uuidv4(), rowId, optionId, alert }];
          }, []),
        ],
        [],
      ) ?? []
    );
  }
};

const getActivityItems = (items: Item[]) =>
  items
    ? items.map((item) => ({
        id: item.id ?? uuidv4(),
        name: item.name,
        question: getDictionaryText(item.question),
        responseType: item.responseType,
        responseValues: getActivityItemResponseValues(item),
        config: item.config,
        conditionalLogic: undefined,
        alerts: getAlerts(item),
        allowEdit: item.allowEdit,
      }))
    : [];

const getActivityFlows = (activityFlows: ActivityFlow[]) =>
  activityFlows.map(({ order, ...activityFlow }) => ({
    ...activityFlow,
    description: getDictionaryText(activityFlow.description),
    items: activityFlow.items?.map(({ id, activityId }) => ({
      id,
      activityKey: activityId || '',
    })),
  }));

const getConditionPayload = (item: Item, condition: Condition) => {
  if (!CONDITION_TYPES_TO_HAVE_OPTION_ID.includes(condition.type as ConditionType))
    return condition.payload;

  const options = (item?.responseValues as SingleAndMultipleSelectItemResponseValues).options;
  const optionValue = options?.find(
    ({ value }) => `${value}` === `${(condition as OptionCondition).payload.optionValue}`,
  )?.id;

  return {
    optionValue,
  };
};

const getActivityConditionalLogic = (items: Item[]) =>
  items?.reduce((result: ConditionalLogic[], item) => {
    if (item.conditionalLogic)
      return [
        ...result,
        {
          key: uuidv4(),
          itemKey: getEntityKey(item),
          match: item.conditionalLogic.match,
          conditions: item.conditionalLogic.conditions?.map((condition) => {
            const relatedItem = items.find((item) => item.name === condition.itemName);

            return {
              key: uuidv4(),
              type: condition.type,
              payload: getConditionPayload(relatedItem!, condition) as keyof Condition['payload'],
              itemName: getEntityKey(relatedItem ?? {}),
            };
          }),
        },
      ];

    return result;
  }, []);

const getScoreConditions = (items?: Item[], conditions?: Condition[]) =>
  conditions?.map((condition) => {
    const { payload: initialPayload, itemName, type } = condition;
    const relatedItem = items?.find((item) => item.name === itemName);
    const payload =
      type === ScoreConditionType
        ? { value: String((condition as ScoreCondition).payload.value) }
        : initialPayload;

    return {
      ...condition,
      payload,
      itemName: relatedItem ? getEntityKey(relatedItem) : condition.itemName,
    };
  });

const getScoresAndReports = (activity: Activity) => {
  const { items, scoresAndReports } = activity;
  if (!scoresAndReports) return;

  const { sections: initialSections, scores: initialScores } = scoresAndReports;
  const scores = initialScores.map((score) => ({
    ...score,
    conditionalLogic: score.conditionalLogic?.map((conditional) => ({
      ...conditional,
      conditions: getScoreConditions(items, conditional.conditions),
    })),
  }));
  const sections = initialSections.map((section) => ({
    ...section,
    ...(!!Object.keys(section.conditionalLogic || {}).length && {
      conditionalLogic: {
        ...section.conditionalLogic,
        conditions: getScoreConditions(items, section?.conditionalLogic?.conditions),
      },
    }),
  }));

  return {
    ...scoresAndReports,
    sections,
    scores,
  };
};

const getActivitySubscaleItems = ({
  activityItemsObject,
  subscalesObject,
  subscaleItems,
}: GetActivitySubscaleItems) =>
  subscaleItems.map(
    (item) =>
      (activityItemsObject[item.name]
        ? activityItemsObject[item.name]?.id
        : subscalesObject[item.name]?.id) ?? '',
  );

const getActivitySubscaleSettingDuplicated = ({
  oldSubscaleSetting,
  oldItems,
  newItems,
}: GetActivitySubscaleSettingDuplicated) => {
  if (!oldSubscaleSetting) return oldSubscaleSetting;

  const mappedIndexObject = oldItems.reduce(
    (acc, item, currentIndex) => ({
      ...acc,
      [getEntityKey(item)]: getEntityKey(newItems[currentIndex]),
    }),
    {} as Record<string, string>,
  );

  return {
    ...oldSubscaleSetting,
    subscales: oldSubscaleSetting?.subscales?.map((subscale) => ({
      ...subscale,
      items: subscale.items.map((subscaleItem) => mappedIndexObject[subscaleItem] ?? subscaleItem),
    })),
  };
};

const getActivitySubscaleSetting = (
  subscaleSetting: SubscaleSetting,
  activityItems: ItemFormValues[],
) => {
  if (!subscaleSetting) return subscaleSetting;

  const processedSubscaleSetting = {
    ...subscaleSetting,
    subscales: subscaleSetting?.subscales?.map((subscale) => ({
      ...subscale,
      id: uuidv4(),
    })),
  };
  const activityItemsObject = getObjectFromList(activityItems, (item) => item.name);
  const subscalesObject = getObjectFromList(
    processedSubscaleSetting.subscales,
    (subscale) => subscale.name,
  );

  return {
    ...processedSubscaleSetting,
    subscales: processedSubscaleSetting?.subscales?.map((subscale) => ({
      ...subscale,
      items: getActivitySubscaleItems({
        activityItemsObject,
        subscalesObject,
        subscaleItems: subscale.items,
      }),
    })),
  };
};

export const getDefaultValues = (appletData?: SingleApplet) => {
  if (!appletData) return getNewApplet();

  const processedApplet = {
    ...appletData,
    description: getDictionaryText(appletData.description),
    about: getDictionaryText(appletData.about),
    themeId: appletData.themeId === null ? 'default' : appletData.themeId,
    activities: appletData.activities
      ? appletData.activities.map((activity) => ({
          ...activity,
          description: getDictionaryText(activity.description),
          items: getActivityItems(activity.items),
          //TODO: for frontend purposes - should be reviewed after refactoring phase
          conditionalLogic: getActivityConditionalLogic(activity.items),
          scoresAndReports: getScoresAndReports(activity),
        }))
      : [],
    activityFlows: getActivityFlows(appletData.activityFlows),
  };

  return {
    ...processedApplet,
    activities: processedApplet.activities
      ? processedApplet.activities.map((activity) => ({
          ...activity,
          ...(activity.subscaleSetting && {
            subscaleSetting: getActivitySubscaleSetting(activity.subscaleSetting, activity.items),
          }),
        }))
      : [],
  } as AppletFormValues;
};

export const getAppletTabs = ({
  hasAboutAppletErrors,
  hasAppletActivitiesErrors,
  hasAppletActivityFlowErrors,
}: Record<string, boolean>) => [
  {
    labelKey: 'aboutApplet',
    icon: <Svg id="more-info-outlined" />,
    activeIcon: <Svg id="more-info-filled" />,
    path: Path.About,
    hasError: hasAboutAppletErrors,
  },
  {
    labelKey: 'activities',
    icon: <Svg id="checklist-outlined" />,
    activeIcon: <Svg id="checklist-filled" />,
    path: Path.Activities,
    hasError: hasAppletActivitiesErrors,
  },
  {
    labelKey: 'activityFlow',
    icon: <Svg id="flow-outlined" />,
    activeIcon: <Svg id="flow-filled" />,
    path: Path.ActivityFlow,
    hasError: hasAppletActivityFlowErrors,
  },
  {
    labelKey: 'appletSettings',
    icon: <Svg id="settings" />,
    activeIcon: <Svg id="settings-filled" />,
    path: Path.Settings,
  },
];

//TODO: find a way to validate nested properties for objects in arrays for uniqueness
export const testFunctionForUniqueness = (field: string, value: string, context: unknown) => {
  const items = get(context, `from.1.value.${field}`);

  return items?.filter((item: { name: string }) => item.name === value).length < 2 ?? true;
};

export const testFunctionForTheSameVariable = (
  field: string,
  value: string,
  context: TestContext,
) => {
  const itemName = get(context, 'parent.name');
  const variableNames = getTextBetweenBrackets(value);

  return !variableNames.includes(itemName);
};

export const testFunctionForNotSupportedItems = (
  field: string,
  value: string,
  context: TestContext,
) => {
  const items: Item[] = get(context, 'from.1.value.items');
  const variableNames = getTextBetweenBrackets(value);
  const itemsFromVariables = items.filter((item) => variableNames.includes(item.name));

  return itemsFromVariables.every((item) => ALLOWED_TYPES_IN_VARIABLES.includes(item.responseType));
};

export const testFunctionForSkippedItems = (field: string, value: string, context: TestContext) => {
  const items: Item[] = get(context, 'from.1.value.items');
  const variableNames = getTextBetweenBrackets(value);

  return !items.some((item) => variableNames.includes(item.name) && item.config.skippableItem);
};
