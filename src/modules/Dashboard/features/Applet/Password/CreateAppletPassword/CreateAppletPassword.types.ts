export type CreateAppletPasswordForm = {
  appletPassword: string;
  appletPasswordConfirmation: string;
};

export type CreateAppletPasswordProps = {
  submitCallback: (encryptionInfo?: any) => void;
};
