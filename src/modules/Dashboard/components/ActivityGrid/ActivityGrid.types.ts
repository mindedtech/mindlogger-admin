import { MenuActionProps, Row } from 'shared/components';
import { Activity } from 'redux/modules';
import { Roles } from 'shared/consts';
import { DatavizActivity } from 'api';
import { Order } from 'shared/types';

export type ActivityGridProps = {
  rows?: Row[];
  order: Order;
  orderBy: string;
  isLoading: boolean;
  'data-testid': string;
};

export type ActivityActionProps = {
  activityId: string;
  appletId: string;
  participantId?: string;
};

export type ActivitiesData = {
  result: Activity[] | DatavizActivity[];
  count: number;
};

export type ActivityActions = {
  actions: ActionsObject;
  dataTestid: string;
  appletId: string;
  activityId: string;
  roles?: Roles[];
};

export type ActionsObject = {
  editActivity?: (props: MenuActionProps<ActivityActionProps>) => void;
  exportData?: (props: MenuActionProps<ActivityActionProps>) => void;
  assignActivity?: (props: MenuActionProps<ActivityActionProps>) => void;
  takeNow?: (props: MenuActionProps<ActivityActionProps>) => void;
};
