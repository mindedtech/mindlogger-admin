import { ReactNode } from 'react';
import { DefaultTFuncReturn } from 'i18next';

export enum ActivitySettingsOptionsItems {
  ScoresAndReports = 'scoresAndReports',
  SubscalesConfiguration = 'subscalesConfiguration',
}

export type ActivitySettingsOptions = {
  name: string;
  title: string | DefaultTFuncReturn | JSX.Element;
  icon: ReactNode;
  path: string;
};
