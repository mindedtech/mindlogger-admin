import { SingleApplet } from 'redux/modules';

export type ConfigurationPopup = {
  open: boolean;
  applet: SingleApplet;
  onClose: () => void;
  updateAppletData: (applet: SingleApplet) => void;
};
