import { PayloadAction } from '@reduxjs/toolkit';

import { PopupsPayload, PopupsSchema } from './Popups.schema';

export const reducers = {
  setPopupVisible: (state: PopupsSchema, action: PayloadAction<PopupsPayload>): void => {
    state.data.appletId = action.payload.appletId;
    state.data[action.payload.key] = action.payload.value;
    state.data.encryption = action.payload.encryption;
  },
};
