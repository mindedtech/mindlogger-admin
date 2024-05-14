import { waitFor, screen, fireEvent } from '@testing-library/react';
import mockAxios from 'jest-mock-axios';
import { generatePath } from 'react-router-dom';

import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  mockedApplet,
  mockedAppletId,
  mockedCurrentWorkspace,
  mockedOwnerId,
  mockedRespondent,
  mockedRespondentId,
  mockedSubjectId1,
} from 'shared/mock';
import { Roles } from 'shared/consts';
import { initialStateData } from 'shared/state';
import { page } from 'resources';
import { ApiResponseCodes } from 'api';

import { Participants } from './Participants';

const route = `/dashboard/${mockedAppletId}/participants`;
const routePath = page.appletParticipants;
const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: {
      ...initialStateData,
      data: {
        [mockedAppletId]: [Roles.Manager],
      },
    },
    applet: mockedApplet,
    workspacesRoles: initialStateData,
  },
  applet: {
    applet: {
      ...initialStateData,
      data: { result: mockedApplet },
    },
  },
};

const mockedUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

jest.mock('shared/hooks/useFeatureFlags', () => ({
  useFeatureFlags: jest.fn(),
}));

const mockUseFeatureFlags = useFeatureFlags as jest.Mock;

const getMockedGetWithParticipants = (isAnonymousRespondent = false) => ({
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: isAnonymousRespondent
      ? [{ ...mockedRespondent, isAnonymousRespondent: true }]
      : [mockedRespondent],
    count: 1,
  },
});

const clickActionDots = async () => {
  const actionsDots = await waitFor(() =>
    screen.getByTestId('dashboard-participants-table-actions-dots'),
  );
  fireEvent.click(actionsDots);
};

describe('Participants component tests', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: { enableActivityAssign: true },
    });
  });

  test('should render empty table', async () => {
    const successfulGetMock = {
      status: ApiResponseCodes.SuccessfulResponse,
      data: null,
    };
    mockAxios.get.mockResolvedValueOnce(successfulGetMock);
    renderWithProviders(<Participants />, { preloadedState, route, routePath });

    await waitFor(() => {
      const result = screen.getByTestId('empty-dashboard-table');
      expect(result).toBeInTheDocument();
    });
  });

  test('should render no permission table', async () => {
    const mockedGet = {
      payload: {
        response: {
          status: ApiResponseCodes.Forbidden,
          data: null,
        },
      },
    };
    mockAxios.get.mockResolvedValue(mockedGet);
    renderWithProviders(<Participants />, { preloadedState, route, routePath });

    await waitFor(() => {
      expect(
        screen.getByText('You do not have permission to view this content.'),
      ).toBeInTheDocument();
    });
  });

  test('should render table with participants', async () => {
    mockAxios.get.mockResolvedValueOnce(getMockedGetWithParticipants());
    renderWithProviders(<Participants />, { preloadedState, route, routePath });
    const tableColumnNames = [
      'ID',
      'Nickname',
      'Tag',
      'Account Type',
      'Latest Activity',
      'Schedule',
    ];
    const participantColumns = ['mockedSecretId', 'Mocked Respondent', 'Schedule', 'Child'];

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-participants-table')).toBeInTheDocument();
      tableColumnNames.forEach((column) => expect(screen.getByText(column)).toBeInTheDocument());
      participantColumns.forEach((column) => expect(screen.getByText(column)).toBeInTheDocument());
    });
  });

  test('participant row should link to participant details page', async () => {
    mockAxios.get.mockResolvedValue(getMockedGetWithParticipants());
    renderWithProviders(<Participants />, { preloadedState, route, routePath });
    const firstParticipantSecretIdCell = await waitFor(() =>
      screen.getByTestId('dashboard-participants-table-0-cell-secretIds'),
    );
    fireEvent.click(firstParticipantSecretIdCell);

    expect(mockedUseNavigate).toHaveBeenCalledWith(
      generatePath(page.appletParticipantActivities, {
        appletId: mockedAppletId,
        subjectId: mockedSubjectId1,
      }),
    );
  });

  test('should pin participant', async () => {
    mockAxios.get.mockResolvedValueOnce(getMockedGetWithParticipants());
    renderWithProviders(<Participants />, { preloadedState, route, routePath });

    const participantPin = await waitFor(() => screen.getByTestId('dashboard-participants-pin'));
    fireEvent.click(participantPin);

    await waitFor(() => {
      expect(mockAxios.post).nthCalledWith(
        1,
        `/workspaces/${mockedOwnerId}/respondents/${mockedRespondentId}/pin`,
        {},
        { signal: undefined },
      );
    });
  });

  test('participant actions should appear on participant actions button click', async () => {
    mockAxios.get.mockResolvedValue(getMockedGetWithParticipants());
    renderWithProviders(<Participants />, { preloadedState, route, routePath });

    await clickActionDots();
    const actionsDataTestIds = [
      'dashboard-participants-edit',
      'dashboard-participants-export-data',
      'dashboard-participants-remove',
      'dashboard-participants-assign-activity',
    ];

    await waitFor(() => {
      actionsDataTestIds.forEach((dataTestId) =>
        expect(screen.getByTestId(dataTestId)).toBeInTheDocument(),
      );
    });
  });

  test('actions should appear for anonymous participant', async () => {
    mockAxios.get.mockResolvedValue(getMockedGetWithParticipants(true));
    renderWithProviders(<Participants />, { preloadedState, route, routePath });

    await clickActionDots();
    const actionsDataTestIds = [
      'dashboard-participants-edit',
      'dashboard-participants-export-data',
      'dashboard-participants-remove',
      'dashboard-participants-assign-activity',
    ];

    await waitFor(() => {
      actionsDataTestIds.forEach((dataTestId) =>
        expect(screen.getByTestId(dataTestId)).toBeInTheDocument(),
      );
    });
  });

  describe('popup should appear when click on participant action for ', () => {
    test.each`
      actionDataTestId                        | popupDataTestId                                        | description
      ${'dashboard-participants-edit'}        | ${'dashboard-respondents-edit-popup'}                  | ${'edit participants'}
      ${'dashboard-participants-export-data'} | ${'dashboard-participants-export-data-popup-password'} | ${'export data'}
      ${'dashboard-participants-remove'}      | ${'dashboard-respondents-remove-access-popup'}         | ${'remove participant'}
    `('$description', async ({ actionDataTestId, popupDataTestId }) => {
      mockAxios.get.mockResolvedValue(getMockedGetWithParticipants());
      renderWithProviders(<Participants />, { preloadedState, route, routePath });

      await clickActionDots();
      const action = await waitFor(() => screen.getByTestId(actionDataTestId));
      fireEvent.click(action);

      await waitFor(() => {
        expect(screen.getByTestId(popupDataTestId)).toBeInTheDocument();
      });
    });
  });

  test('should search participants', async () => {
    mockAxios.get.mockResolvedValueOnce(getMockedGetWithParticipants());
    renderWithProviders(<Participants />, { preloadedState, route, routePath });
    const mockedSearchValue = 'mockedSearchValue';

    const search = await waitFor(() => screen.getByTestId('dashboard-participants-search'));
    const searchInput = search.querySelector('input');
    searchInput && fireEvent.change(searchInput, { target: { value: mockedSearchValue } });

    await waitFor(() => {
      expect(mockAxios.get).toBeCalledWith(
        `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`,
        {
          params: {
            limit: 20,
            page: 1,
            search: mockedSearchValue,
          },
          signal: undefined,
        },
      );
    });
  });
});
