export const TABS_HEIGHT = '6.1rem';
export const TOP_BAR_HEIGHT = '6rem';
export const FOOTER_HEIGHT = '4.8rem';
export const SEARCH_HEIGHT = '4rem';

export const APPLET_PAGES = {
  respondents: 'respondents',
  managers: 'managers',
  schedule: 'schedule',
  settings: 'settings',
  addUser: 'add-user',
};

export enum DateFormats {
  Year = 'yyy',
  DayMonthYear = 'dd MMM yyyy',
  WeekDayMonthYear = 'E, dd MMM yyyy',
  FullWeekDayFullMonthYear = 'eeee, dd MMMM yyyy',
  DayFullMonth = 'dd MMMM',
  DayFullMonthYear = 'dd MMMM yyy',
  Time = 'HH:mm',
  YearMonthDayHoursMinutesSeconds = 'yyyy-MM-dd HH:mm:ss',
}

export enum Roles {
  User = 'user',
  Manager = 'manager',
  Coordinator = 'coordinator',
  Editor = 'editor',
  Reviewer = 'reviewer',
}
