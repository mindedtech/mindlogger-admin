import { AppletId } from 'api';
import { apiClient, authApiClient } from 'shared/api/api.client';

import { PublishedApplet } from '../state';
import { PublishedAppletsType } from './api.types';

export const getPublishedAppletsApi = (
  { page, search, limit }: PublishedAppletsType,
  signal?: AbortSignal,
) =>
  apiClient.get('/library', {
    params: {
      search,
      page,
      limit,
    },
    signal,
  });

export const getPublishedAppletApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  apiClient.get(`/library/${appletId}`, {
    signal,
  });

export const postAppletsToCartApi = (cartItems: PublishedApplet[], signal?: AbortSignal) =>
  authApiClient.post(
    '/library/cart',
    {
      cartItems,
    },
    { signal },
  );

export const getAppletsFromCartApi = (signal?: AbortSignal) =>
  authApiClient.get('/library/cart', { signal });
