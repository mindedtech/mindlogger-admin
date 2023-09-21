import { apiClient, authApiClientWithoutRefresh } from 'shared/api/api';

import { SignIn, SignUpArgs, ResetPassword } from './api.types';

export const signInApi = ({ email, password }: SignIn, signal?: AbortSignal) =>
  apiClient.post(
    'auth/login',
    { email, password },
    {
      signal,
    },
  );

export const deleteAccessTokenApi = () => authApiClientWithoutRefresh.post('auth/logout');

export const deleteRefreshTokenApi = () => authApiClientWithoutRefresh.post('auth/logout2');

export const signUpApi = ({ body }: SignUpArgs, signal?: AbortSignal) =>
  apiClient.post(
    '/users',
    { ...body },
    {
      signal,
    },
  );

export const resetPasswordApi = ({ email }: ResetPassword, signal?: AbortSignal) =>
  apiClient.post(
    '/users/me/password/recover',
    { email },
    {
      signal,
    },
  );
