import { SingleApplet } from 'redux/modules';

export type DisconnectionPopup = {
  open: boolean;
  applet: SingleApplet;
  onClose: () => void;
  updateAppletData: (applet: SingleApplet) => void;
};
