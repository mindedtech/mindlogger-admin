export type ConfigurationPopup = {
  appletId?: string;
  open: boolean;
  onClose: () => void;
  onApiTokenSubmitted: (apiTokenExists: boolean) => void;
};
