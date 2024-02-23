import { fireEvent, waitFor, screen } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { initialStateData } from 'shared/state';
import { mockedApplet } from 'shared/mock';
import { expectBanner, renderWithProviders } from 'shared/utils';

import { PublishConcealAppletPopup } from '.';

const getPreloadedState = (isPublished: boolean) => ({
  applet: {
    applet: {
      ...initialStateData,
      data: {
        result: {
          ...mockedApplet,
          isPublished,
        },
      },
    },
  },
  popups: {
    data: {
      encryption: null,
      popupProps: undefined,
      deletePopupVisible: false,
      duplicatePopupsVisible: false,
      transferOwnershipPopupVisible: false,
      publishConcealPopupVisible: true,
    },
  },
});

describe('PublishConcealAppletPopup', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test('should show publish success banner', async () => {
    mockAxios.post.mockResolvedValueOnce(null);

    const { store } = renderWithProviders(<PublishConcealAppletPopup />, {
      preloadedState: getPreloadedState(true),
    });

    fireEvent.click(screen.getByText('Yes'));
    await waitFor(() => {
      expectBanner(store, 'dashboard-applets-publish-success-banner');
    });
  });

  test('should show conceal success banner', async () => {
    mockAxios.post.mockResolvedValueOnce(null);

    const { store } = renderWithProviders(<PublishConcealAppletPopup />, {
      preloadedState: getPreloadedState(false),
    });

    fireEvent.click(screen.getByText('Yes'));
    await waitFor(() => {
      expectBanner(store, 'dashboard-applets-conceal-success-banner');
    });
  });
});
