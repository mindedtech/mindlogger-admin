import { waitFor } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';

import { mockedSimpleAppletFormData } from 'shared/mock';
import { expectBanner, renderHookWithProviders } from 'shared/utils';
import { SaveAndPublishSteps } from 'modules/Builder/components/Popups/SaveAndPublishProcessPopup/SaveAndPublishProcessPopup.types';

import { useSaveAndPublishSetup } from './SaveAndPublish.hooks';
import type { SaveAndPublishSetup } from './SaveAndPublish.types';

jest.mock('modules/Builder/hooks', () => ({
  useCustomFormContext: () => ({
    trigger: () => true,
    formState: {
      dirtyFields: [],
      isDirty: true,
    },
    getValues: () => mockedSimpleAppletFormData,
  }),
  useAppletPrivateKeySetter: jest.fn(),
}));

jest.mock('redux/modules', () => ({
  auth: {
    useLogoutInProgress: () => false,
  },
  workspaces: {
    useData: () => ({ ownerId: 'mockOwnerId' }),
  },
}));

describe('useSaveAndPublishSetup hook', () => {
  afterEach(() => {
    jest.resetAllMocks();
    mockAxios.reset();
  });

  describe('handleSaveAndPublishFirstClick', () => {
    test('should show a success banner if call to save succeeds', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: {} });

      const { result, store } = renderHookWithProviders(useSaveAndPublishSetup, {
        route: '/builder/new-applet/about',
        routePath: '/builder/new-applet/about',
      });

      await (result.current as SaveAndPublishSetup).handleSaveAndPublishFirstClick();

      await waitFor(() => expectBanner(store, 'SaveSuccessBanner'));
    });

    test('should not show a success banner if call to save fails', async () => {
      mockAxios.post.mockRejectedValueOnce({});

      const { result, rerender, store } = renderHookWithProviders(useSaveAndPublishSetup, {
        route: '/builder/new-applet/about',
        routePath: '/builder/new-applet/about',
      });

      await (result.current as SaveAndPublishSetup).handleSaveAndPublishFirstClick();

      // Ensure hook internal state is updated before checking publishProcessStep
      rerender();

      expect((result.current as SaveAndPublishSetup).publishProcessStep).toBe(
        SaveAndPublishSteps.Failed,
      );

      expectBanner(store, 'SaveSuccessBanner', false);
    });
  });
});
