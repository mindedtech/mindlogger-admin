import { Encryption } from 'redux/modules';
import { AppletPasswordForm } from 'features/Applet/Password/EnterAppletPassword/EnterAppletPassword.types';

export enum AppletPasswordPopupType {
  Create = 'create',
  Enter = 'enter',
}

export type AppletPasswordProps = {
  popupType?: AppletPasswordPopupType;
  popupVisible: boolean;
  onClose: () => void;
  appletId?: string;
  encryption?: Encryption;
  submitCallback?: (formValue: AppletPasswordForm) => void;
};
