export type AppletSetting = {
  label: string;
  component: JSX.Element;
  param: string;
};

type NavigationSettingItem = {
  icon: JSX.Element;
  label: string;
  component: JSX.Element;
  param: string;
};

export type NavigationSetting = {
  label: string;
  items: NavigationSettingItem[];
};

export type AppletSettingsProps = {
  settings: NavigationSetting[];
  isBuilder?: boolean;
};
