import { configureStore } from '@reduxjs/toolkit';

import reducer from './reducers';

export const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // TODO: remove serializable check and fix errors
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
