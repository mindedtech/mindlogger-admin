import { AxiosError } from 'axios';
import { ActionReducerMapBuilder, PayloadAction } from '@reduxjs/toolkit';

import { getApiError } from 'utils/getApiError';

import { AppletsSchema } from './Applets.schema';
import { getApplets } from './Applets.thunk';
import { state as initialState } from './Applets.state';

export const extraReducers = (builder: ActionReducerMapBuilder<AppletsSchema>): void => {
  builder.addCase(getApplets.pending, ({ applets }, action) => {
    if (applets.status !== 'loading') {
      applets.requestId = action.meta.requestId;
      applets.status = 'loading';
    }
  });

  builder.addCase(getApplets.fulfilled, ({ applets }, action) => {
    if (applets.status === 'loading' && applets.requestId === action.meta.requestId) {
      applets.requestId = initialState.applets.requestId;
      applets.status = 'success';
      applets.data = action.payload.data;
    }
  });

  builder.addCase(getApplets.rejected, ({ applets }, action) => {
    if (applets.status === 'loading' && applets.requestId === action.meta.requestId) {
      applets.requestId = initialState.applets.requestId;
      applets.status = 'error';
      applets.error = getApiError(action as PayloadAction<AxiosError>);
    }
  });
};
