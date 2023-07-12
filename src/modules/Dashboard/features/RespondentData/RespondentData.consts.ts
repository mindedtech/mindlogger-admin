import { ItemResponseType } from 'shared/consts';

export const UNSUPPORTED_ITEMS = [
  ItemResponseType.Date,
  ItemResponseType.Audio,
  ItemResponseType.AudioPlayer,
  ItemResponseType.Drawing,
  ItemResponseType.Geolocation,
  ItemResponseType.Photo,
  ItemResponseType.Video,
  ItemResponseType.Time,
  ItemResponseType.TimeRange,
  ItemResponseType.MultipleSelectionPerRow,
  ItemResponseType.SingleSelectionPerRow,
  ItemResponseType.SliderRows,
  ItemResponseType.NumberSelection,
  ItemResponseType.Message,
  ItemResponseType.Flanker,
  ItemResponseType.StabilityTracker,
  ItemResponseType.TouchPractice,
  ItemResponseType.TouchTest,
  ItemResponseType.ABTrails,
];
