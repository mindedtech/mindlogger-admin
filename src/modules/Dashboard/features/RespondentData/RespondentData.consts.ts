import { ItemResponseType } from 'shared/consts';

export const UNSUPPORTED_ITEMS = [
  ItemResponseType.Date,
  ItemResponseType.Audio,
  ItemResponseType.AudioPlayer,
  ItemResponseType.Drawing,
  ItemResponseType.Geolocation,
  ItemResponseType.Message,
  ItemResponseType.Photo,
  ItemResponseType.Video,
  ItemResponseType.Time,
  ItemResponseType.TimeRange,
  ItemResponseType.MultipleSelectionPerRow,
  ItemResponseType.SingleSelectionPerRow,
  ItemResponseType.SliderRows,
  ItemResponseType.NumberSelection,
  ItemResponseType.Flanker,
  ItemResponseType.StabilityTracker,
  ItemResponseType.TouchPractice,
  ItemResponseType.TouchTest,
  ItemResponseType.ABTrails,
];
