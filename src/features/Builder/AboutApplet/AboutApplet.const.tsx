import { Svg } from 'components';

export const defaultValues = {
  name: '',
  description: '',
  colorTheme: 'default',
  aboutApplet: '',
  appletImage: '',
  appletWatermark: '',
};

export const colorThemeOptions = [
  {
    value: 'default',
    labelKey: 'default',
    icon: <Svg id="circle-primary" />,
  },
];
