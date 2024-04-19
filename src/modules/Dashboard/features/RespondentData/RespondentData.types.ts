import { DatavizActivity, Version } from 'api';
import { AutocompleteOption } from 'shared/components/FormComponents';
import { ActivityItemAnswer } from 'shared/types';
import { SubscaleSetting } from 'shared/state';
import { ItemResponseType } from 'shared/consts';

export type TimeRangeAnswerValue = {
  from: string;
  to: string;
};

export type FormattedAnswer<T> = {
  value: T | null;
  text: string | null;
};

export type Answer<T> = {
  answer: FormattedAnswer<T>;
  date: string;
};

export type ItemOption = {
  id: string;
  text: string | number;
  value: number;
};

export type PerRowSelectionItemRow = {
  id: string;
  rowImage: string | null;
  rowName: string;
  tooltip: string | null;
};

export type SliderRowsRow = {
  id: string;
  label: string;
  maxImage: string | null;
  maxLabel: string | null;
  maxValue: number;
  minImage: string | null;
  minLabel: string | null;
  minValue: number;
};

export type PerRowSelectionItemOption = {
  id: string;
  image: string | null;
  text: string;
  tooltip: string | null;
  value?: string | number | null;
};

export type SingleMultiSelectionSliderItemResponseValues = {
  options: ItemOption[];
};

export type NumberSelectionItemResponseValues = {
  minValue: number;
  maxValue: number;
};

export type SingleMultiSelectionPerRowItemResponseValues = {
  options: PerRowSelectionItemOption[];
  rows: PerRowSelectionItemRow[];
};

export type SliderRowsItemResponseValues = {
  rows: SliderRowsRow[];
};

export type FormattedActivityItem<T> = {
  id: string;
  name: string;
  question: Record<string, string>;
  responseType: ItemResponseType;
  responseValues: T;
  responseDataIdentifier?: boolean;
  order: number;
};

export type Identifier = {
  encryptedValue: string;
  decryptedValue: string;
};

export type ActivityCompletion = {
  decryptedAnswer: ActivityItemAnswer[];
  answerId: string;
  endDatetime: string;
  startDatetime: string;
  version: string;
  subscaleSetting?: SubscaleSetting;
};

export type SingleMultiSelectionSliderAnswer = Answer<number>;
export type DateAnswer = Answer<string>;
export type TextAnswer = Answer<string>;
export type TimeAnswer = Answer<number>;
export type NumberSelectionAnswer = Answer<number>;
export type TimeRangeAnswer = Answer<TimeRangeAnswerValue>;
export type SingleMultiSelectionPerRowAnswer = Record<string, Answer<string>[]>;
export type SliderRowsAnswer = Record<string, Answer<number>[]>;

export type CreateFormattedReposense<I, A> = {
  activityItem: FormattedActivityItem<I>;
  answers: A;
  dataTestid?: string;
};

export type SingleMultiSelectionSliderFormattedResponses = CreateFormattedReposense<
  SingleMultiSelectionSliderItemResponseValues,
  SingleMultiSelectionSliderAnswer[]
>;
export type TextFormattedResponses = CreateFormattedReposense<null, TextAnswer[]>;
export type NumberSelectionFormattedResponses = CreateFormattedReposense<
  NumberSelectionItemResponseValues,
  NumberSelectionAnswer[]
>;
export type TimeRangeFormattedResponses = CreateFormattedReposense<null, TimeRangeAnswer[]>;
export type DateFormattedResponses = CreateFormattedReposense<null, DateAnswer[]>;
export type TimeFormattedResponses = CreateFormattedReposense<null, TimeAnswer[]>;
export type SingleMultiSelectionPerRowFormattedResponses = CreateFormattedReposense<
  SingleMultiSelectionPerRowItemResponseValues,
  SingleMultiSelectionPerRowAnswer
>;
export type SliderRowsFormattedResponses = CreateFormattedReposense<
  SliderRowsItemResponseValues,
  SliderRowsAnswer
>;

export type FormattedResponses =
  | SingleMultiSelectionSliderFormattedResponses
  | TextFormattedResponses
  | NumberSelectionFormattedResponses
  | TimeRangeFormattedResponses
  | DateFormattedResponses
  | TimeFormattedResponses
  | SingleMultiSelectionPerRowFormattedResponses
  | SliderRowsFormattedResponses;

export type RespondentsDataFormValues = {
  startDate: Date;
  endDate: Date;
  moreFiltersVisible: boolean;
  startTime: string;
  endTime: string;
  filterByIdentifier?: boolean;
  identifier?: AutocompleteOption[];
  versions: AutocompleteOption[];
  summaryActivities: DatavizActivity[];
  selectedActivity: DatavizActivity | null;
  identifiers: Identifier[];
  apiVersions: Version[];
  answers: ActivityCompletion[];
  responseOptions: Record<string, FormattedResponses[]> | null;
  subscalesFrequency: number;
  responseDate: null | Date;
};
