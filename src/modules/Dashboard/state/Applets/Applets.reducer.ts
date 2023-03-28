import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

import { AppletsSchema } from './Applets.schema';
import { getApplet, getEvents, getWorkspaceApplets } from './Applets.thunk';

import {
  deleteApplet,
  createAppletsPendingData,
  createAppletsFulfilledData,
  createAppletsRejectedData,
} from './Applets.utils';

export const reducers = { deleteApplet };

export const extraReducers = (builder: ActionReducerMapBuilder<AppletsSchema>): void => {
  createAppletsPendingData({ builder, thunk: getApplet, key: 'applet' });
  createAppletsPendingData({ builder, thunk: getWorkspaceApplets, key: 'applets' });
  createAppletsPendingData({ builder, thunk: getEvents, key: 'events' });

  createAppletsFulfilledData({ builder, thunk: getWorkspaceApplets, key: 'applets' });
  createAppletsFulfilledData({ builder, thunk: getApplet, key: 'applet' });
  createAppletsFulfilledData({ builder, thunk: getEvents, key: 'events' });

  createAppletsRejectedData({ builder, thunk: getApplet, key: 'applet' });
  createAppletsRejectedData({ builder, thunk: getWorkspaceApplets, key: 'applets' });
  createAppletsRejectedData({ builder, thunk: getEvents, key: 'events' });
};
