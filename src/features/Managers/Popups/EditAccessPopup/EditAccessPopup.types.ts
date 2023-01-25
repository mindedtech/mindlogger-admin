import { Roles } from 'consts';
import { User } from 'features/Managers';

export type EditAccessPopupProps = {
  onClose: () => void;
  editAccessPopupVisible: boolean;
  user: User;
};

export type Role = {
  label: Roles;
  icon: JSX.Element | undefined;
};

export type Applet = {
  id: string;
  title: string;
  img: string;
  roles: Role[];
  selectedRespondents?: string[];
};
