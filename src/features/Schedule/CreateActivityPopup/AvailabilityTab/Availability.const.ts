export const availabilityOptions = [
  {
    value: true,
    labelKey: 'alwaysAvailable',
  },
  {
    value: false,
    labelKey: 'scheduledAccess',
  },
];

export const enum Repeats {
  once = 'once',
  daily = 'daily',
  weekly = 'weekly',
  weekdays = 'weekdays',
  monthly = 'monthly',
}

export const repeatsButtons = [
  {
    value: Repeats.once,
    label: 'once',
  },
  {
    value: Repeats.daily,
    label: 'daily',
  },
  {
    value: Repeats.weekly,
    label: 'weekly',
  },
  {
    value: Repeats.weekdays,
    label: 'weekdays',
  },
  {
    value: Repeats.monthly,
    label: 'monthly',
  },
];
