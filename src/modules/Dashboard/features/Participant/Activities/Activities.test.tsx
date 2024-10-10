import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios, { HttpResponse } from 'jest-mock-axios';
import { generatePath } from 'react-router-dom';
import { PreloadedState } from '@reduxjs/toolkit';

import { ApiResponseCodes } from 'api';
import { page } from 'resources';
import { Roles } from 'shared/consts';
import {
  mockedApplet,
  mockedAppletData,
  mockedAppletId,
  mockedEncryption,
  mockedOwnerId,
  mockedOwnerRespondent,
  mockedOwnerSubject,
  mockedRespondent,
  mockedRespondent2,
  mockedUserData,
} from 'shared/mock';
import { getPreloadedState } from 'shared/tests/getPreloadedState';
import { renderWithProviders } from 'shared/utils/renderWithProviders';
import {
  mockGetRequestResponses,
  mockSchema,
  mockSuccessfulHttpResponse,
} from 'shared/utils/axios-mocks';
import { RootState } from 'redux/store';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { ParticipantsData } from 'modules/Dashboard/features/Participants';
import { ManagersData } from 'modules/Dashboard/features/Managers';
import {
  expectMixpanelTrack,
  openTakeNowModal,
  selectParticipant,
  selfReportCheckboxTestId,
  sourceSubjectDropdownTestId,
  takeNowModalTestId,
  targetSubjectDropdownTestId,
  toggleSelfReportCheckbox,
} from 'modules/Dashboard/components/TakeNowModal/TakeNowModal.test-utils';
import { MixpanelProps } from 'shared/utils';

import { Activities } from './Activities';

const successfulEmptyGetAppletActivitiesMock = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: {
      activitiesDetails: [],
      appletDetail: {
        ...mockedAppletData,
        activities: [],
      },
    },
  },
};

const successfulGetAppletActivitiesMock = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: {
      activitiesDetails: mockedAppletData.activities,
      appletDetail: mockedAppletData,
    },
  },
};

const successfulEmptyGetAppletSubjectActivitiesMock = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: {
      activities: [],
      activityFlows: [],
    },
  },
};

const successfulGetAppletSubjectActivitiesMock = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: {
      activities: mockedAppletData.activities,
      activityFlows: mockedAppletData.activityFlows,
    },
  },
};

const successfulGetAppletMock = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: { result: mockedAppletData },
};

const successfulEmptyHttpResponseMock: HttpResponse = {
  status: ApiResponseCodes.SuccessfulResponse,
  data: {
    result: [],
  },
};

const getAppletUrl = `/applets/${mockedAppletId}`;
const getAppletActivitiesUrl = `/activities/applet/${mockedAppletId}`;
const getAppletSubjectActivitiesUrl = `/activities/applet/${mockedAppletId}/subject/${mockedOwnerRespondent.details[0].subjectId}`;
const getWorkspaceRespondentsUrl = `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/respondents`;
const getWorkspaceManagersUrl = `/workspaces/${mockedOwnerId}/applets/${mockedAppletId}/managers`;

const testId = 'dashboard-applet-participant-activities';
const route = `/dashboard/${mockedAppletId}/participants/${mockedOwnerRespondent.details[0].subjectId}`;
const routePath = page.appletParticipantDetails;

const preloadedState: PreloadedState<RootState> = {
  ...getPreloadedState(),
  users: {
    respondentDetails: mockSchema(null),
    allRespondents: mockSchema(null, {
      status: 'idle',
    }),
    subjectDetails: mockSchema({
      result: mockedOwnerSubject,
    }),
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

const mockUseFeatureFlags = jest.mocked(useFeatureFlags);

describe('Dashboard > Applet > Participant > Activities screen', () => {
  beforeEach(() => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableParticipantMultiInformant: false,
        enableActivityAssign: false,
      },
      resetLDContext: jest.fn(),
    });
  });

  test('should render empty component', async () => {
    mockGetRequestResponses({
      [getAppletUrl]: successfulGetAppletMock,
      [getAppletActivitiesUrl]: successfulEmptyGetAppletActivitiesMock,
      [getAppletSubjectActivitiesUrl]: successfulEmptyGetAppletSubjectActivitiesMock,
      [getWorkspaceRespondentsUrl]: successfulEmptyHttpResponseMock,
      [getWorkspaceManagersUrl]: successfulEmptyHttpResponseMock,
    });
    renderWithProviders(<Activities />, { route, routePath, preloadedState });

    await waitFor(() => {
      expect(screen.getByText('No activities available for this participant')).toBeInTheDocument();
    });
  });

  test('should render grid with activity summary cards', async () => {
    mockGetRequestResponses({
      [getAppletUrl]: successfulGetAppletMock,
      [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
      [getAppletSubjectActivitiesUrl]: successfulGetAppletSubjectActivitiesMock,
      [getWorkspaceRespondentsUrl]: successfulEmptyHttpResponseMock,
      [getWorkspaceManagersUrl]: successfulEmptyHttpResponseMock,
    });
    renderWithProviders(<Activities />, { route, routePath, preloadedState });

    const activities = ['Existing Activity', 'Newly added activity'];

    await waitFor(() => {
      expect(screen.getByTestId(`${testId}-grid`)).toBeInTheDocument();
      expect(mockAxios.get).toHaveBeenCalledWith(getAppletActivitiesUrl, expect.any(Object));
      activities.forEach((activity) => expect(screen.getByText(activity)).toBeInTheDocument());
    });
  });

  test('should render grid with assigned activity summary cards when `enableActivityAssign` feature flag is enabled', async () => {
    mockUseFeatureFlags.mockReturnValue({
      featureFlags: {
        enableParticipantMultiInformant: false,
        enableActivityAssign: true,
      },
      resetLDContext: jest.fn(),
    });
    mockGetRequestResponses({
      [getAppletUrl]: successfulGetAppletMock,
      [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
      [getAppletSubjectActivitiesUrl]: successfulGetAppletSubjectActivitiesMock,
      [getWorkspaceRespondentsUrl]: successfulEmptyHttpResponseMock,
      [getWorkspaceManagersUrl]: successfulEmptyHttpResponseMock,
    });
    renderWithProviders(<Activities />, { route, routePath, preloadedState });

    const activities = ['Existing Activity', 'Newly added activity'];

    await waitFor(() => {
      expect(screen.getByTestId(`${testId}-grid`)).toBeInTheDocument();
      expect(mockAxios.get).toHaveBeenCalledWith(getAppletSubjectActivitiesUrl, expect.any(Object));
      activities.forEach((activity) => expect(screen.getByText(activity)).toBeInTheDocument());
    });
  });

  describe('should show or hide edit ability depending on role', () => {
    test.each`
      canEdit  | role                 | description
      ${true}  | ${Roles.Manager}     | ${'editing for Manager'}
      ${true}  | ${Roles.SuperAdmin}  | ${'editing for SuperAdmin'}
      ${true}  | ${Roles.Owner}       | ${'editing for Owner'}
      ${false} | ${Roles.Coordinator} | ${'editing for Coordinator'}
      ${true}  | ${Roles.Editor}      | ${'editing for Editor'}
      ${false} | ${Roles.Respondent}  | ${'editing for Respondent'}
      ${false} | ${Roles.Reviewer}    | ${'editing for Reviewer'}
    `('$description', async ({ canEdit, role }) => {
      mockGetRequestResponses({
        [getAppletUrl]: successfulGetAppletMock,
        [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
        [getAppletSubjectActivitiesUrl]: successfulGetAppletSubjectActivitiesMock,
        [getWorkspaceRespondentsUrl]: successfulEmptyHttpResponseMock,
        [getWorkspaceManagersUrl]: successfulEmptyHttpResponseMock,
      });
      renderWithProviders(<Activities />, {
        preloadedState: { ...preloadedState, ...getPreloadedState(role) },
        route,
        routePath,
      });

      const actionDots = screen.queryAllByTestId(`${testId}-activity-actions-dots`)[0];
      if (actionDots && canEdit) {
        userEvent.click(actionDots);
        await waitFor(() => expect(screen.getByTestId(`${testId}-activity-edit`)).toBeVisible());

        fireEvent.click(screen.getByTestId(`${testId}-activity-edit`));
        expect(mockedUseNavigate).toHaveBeenCalledWith(
          generatePath(page.builderAppletActivity, {
            appletId: mockedAppletId,
            activityId: mockedAppletData.activities[0].id,
          }),
        );
      } else {
        await waitFor(() => expect(screen.queryByTestId(`${testId}-activity-edit`)).toBe(null));
      }
    });
  });

  describe('Take Now modal', () => {
    describe('should show or hide Take Now button depending on role', () => {
      test.each`
        canDoTakeNow | role                 | description
        ${true}      | ${Roles.Manager}     | ${'Take Now for Manager'}
        ${true}      | ${Roles.SuperAdmin}  | ${'Take Now for SuperAdmin'}
        ${true}      | ${Roles.Owner}       | ${'Take Now for Owner'}
        ${false}     | ${Roles.Coordinator} | ${'Take Now for Coordinator'}
        ${false}     | ${Roles.Editor}      | ${'Take Now for Editor'}
        ${false}     | ${Roles.Respondent}  | ${'Take Now for Respondent'}
        ${false}     | ${Roles.Reviewer}    | ${'Take Now for Reviewer'}
      `('$description', async ({ canDoTakeNow, role }: { canDoTakeNow: boolean; role: Roles }) => {
        mockGetRequestResponses({
          [getAppletUrl]: successfulGetAppletMock,
          [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
          [getAppletSubjectActivitiesUrl]: successfulGetAppletSubjectActivitiesMock,
          [getWorkspaceRespondentsUrl]: successfulEmptyHttpResponseMock,
          [getWorkspaceManagersUrl]: successfulEmptyHttpResponseMock,
        });
        renderWithProviders(<Activities />, {
          preloadedState: { ...preloadedState, ...getPreloadedState(role) },
          route,
          routePath,
        });

        const actionDots = screen.queryAllByTestId(`${testId}-activity-actions-dots`)[0];
        if (actionDots && canDoTakeNow) {
          userEvent.click(actionDots);
          await waitFor(() =>
            expect(screen.getByTestId(`${testId}-activity-take-now`)).toBeVisible(),
          );
        } else {
          await waitFor(() =>
            expect(screen.queryByTestId(`${testId}-activity-take-now`)).toBe(null),
          );
        }
      });
    });

    test('should pre-populate admin and participant in Take Now modal', async () => {
      const successfulGetAppletParticipantsMock = mockSuccessfulHttpResponse<ParticipantsData>({
        result: [mockedRespondent, mockedRespondent2, mockedOwnerRespondent],
        count: 3,
      });

      const successfulGetAppletManagersMock = mockSuccessfulHttpResponse<ManagersData>({
        result: [
          {
            id: mockedOwnerRespondent.id,
            firstName: mockedUserData.firstName,
            lastName: mockedUserData.lastName,
            email: mockedOwnerRespondent.email,
            roles: [Roles.Owner],
            lastSeen: new Date().toDateString(),
            isPinned: mockedOwnerRespondent.isPinned,
            applets: [
              {
                id: mockedApplet.id,
                displayName: mockedApplet.displayName,
                image: '',
                roles: [
                  {
                    accessId: '912e17b8-195f-4685-b77b-137539b9054d',
                    role: Roles.Owner,
                  },
                ],
                encryption: mockedEncryption,
              },
            ],
            title: null,
            createdAt: new Date().toISOString(),
            titles: [],
            status: 'approved',
            invitationKey: null,
          },
        ],
        count: 1,
      });

      mockGetRequestResponses({
        [getAppletUrl]: successfulGetAppletMock,
        [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
        [getAppletSubjectActivitiesUrl]: successfulGetAppletSubjectActivitiesMock,
        [getWorkspaceRespondentsUrl]: (params) => {
          if (params.userId === mockedOwnerRespondent.id) {
            return mockSuccessfulHttpResponse<ParticipantsData>({
              result: [mockedOwnerRespondent],
              count: 1,
            });
          }

          return successfulGetAppletParticipantsMock;
        },
        [getWorkspaceManagersUrl]: successfulGetAppletManagersMock,
      });

      renderWithProviders(<Activities />, {
        preloadedState: {
          ...preloadedState,
          auth: {
            authentication: mockSchema({
              user: mockedUserData,
            }),
            isAuthorized: true,
            isLogoutInProgress: false,
          },
        },
        route,
        routePath,
      });

      await openTakeNowModal(testId);

      const sourceSubjectInputElement = screen
        .getByTestId(sourceSubjectDropdownTestId(testId))
        .querySelector('input');

      const targetSubjectInputElement = screen
        .getByTestId(targetSubjectDropdownTestId(testId))
        .querySelector('input');

      const { firstName, lastName, tag } = preloadedState?.users?.subjectDetails.data?.result ?? {};

      expect(targetSubjectInputElement).toHaveValue(`${firstName} ${lastName} (${tag})`);

      expect(sourceSubjectInputElement).toHaveValue(
        `${mockedUserData.firstName} ${mockedUserData.lastName} (${mockedOwnerSubject.tag})`,
      );
    });

    test('Full account participants cannot self-report', async () => {
      const successfulGetAppletParticipantsMock = mockSuccessfulHttpResponse<ParticipantsData>({
        result: [mockedRespondent, mockedRespondent2, mockedOwnerRespondent],
        count: 3,
      });

      const successfulGetAppletManagersMock = mockSuccessfulHttpResponse<ManagersData>({
        result: [
          {
            id: mockedOwnerRespondent.id,
            firstName: mockedUserData.firstName,
            lastName: mockedUserData.lastName,
            email: mockedOwnerRespondent.email,
            roles: [Roles.Owner],
            lastSeen: new Date().toDateString(),
            isPinned: mockedOwnerRespondent.isPinned,
            applets: [
              {
                id: mockedApplet.id,
                displayName: mockedApplet.displayName,
                image: '',
                roles: [
                  {
                    accessId: '912e17b8-195f-4685-b77b-137539b9054d',
                    role: Roles.Owner,
                  },
                ],
                encryption: mockedEncryption,
              },
            ],
            title: null,
            createdAt: new Date().toISOString(),
            titles: [],
            status: 'approved',
            invitationKey: null,
          },
        ],
        count: 1,
      });

      mockGetRequestResponses({
        [getAppletUrl]: successfulGetAppletMock,
        [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
        [getAppletSubjectActivitiesUrl]: successfulGetAppletSubjectActivitiesMock,
        [getWorkspaceRespondentsUrl]: (params) => {
          if (params.userId === mockedOwnerRespondent.id) {
            return mockSuccessfulHttpResponse<ParticipantsData>({
              result: [mockedOwnerRespondent],
              count: 1,
            });
          }

          return successfulGetAppletParticipantsMock;
        },
        [getWorkspaceManagersUrl]: successfulGetAppletManagersMock,
      });

      const { getByTestId } = renderWithProviders(<Activities />, {
        preloadedState: {
          ...preloadedState,
          auth: {
            authentication: mockSchema({
              user: mockedUserData,
            }),
            isAuthorized: true,
            isLogoutInProgress: false,
          },
        },
        route,
        routePath,
      });

      await openTakeNowModal(testId);

      const inputElement = getByTestId(sourceSubjectDropdownTestId(testId)).querySelector('input');

      if (inputElement === null) {
        throw new Error('Autocomplete dropdown element not found');
      }

      fireEvent.mouseDown(inputElement);

      const fullAccountParticipantOption = getByTestId(
        `${sourceSubjectDropdownTestId(testId)}-option-${mockedRespondent.details[0].subjectId}`,
      );

      fireEvent.click(fullAccountParticipantOption);

      const checkbox = getByTestId(selfReportCheckboxTestId(testId)).querySelector('input');

      expect(checkbox).toBeDisabled();
    });

    test('Full account participants are not present in the inputting dropdown', async () => {
      const successfulGetAppletParticipantsMock = mockSuccessfulHttpResponse<ParticipantsData>({
        result: [mockedRespondent, mockedRespondent2, mockedOwnerRespondent],
        count: 3,
      });

      const successfulGetAppletManagersMock = mockSuccessfulHttpResponse<ManagersData>({
        result: [
          {
            id: mockedOwnerRespondent.id,
            firstName: mockedUserData.firstName,
            lastName: mockedUserData.lastName,
            email: mockedOwnerRespondent.email,
            roles: [Roles.Owner],
            lastSeen: new Date().toDateString(),
            isPinned: mockedOwnerRespondent.isPinned,
            applets: [
              {
                id: mockedApplet.id,
                displayName: mockedApplet.displayName,
                image: '',
                roles: [
                  {
                    accessId: '912e17b8-195f-4685-b77b-137539b9054d',
                    role: Roles.Owner,
                  },
                ],
                encryption: mockedEncryption,
              },
            ],
            title: null,
            createdAt: new Date().toISOString(),
            titles: [],
            status: 'approved',
            invitationKey: null,
          },
        ],
        count: 1,
      });

      mockGetRequestResponses({
        [getAppletUrl]: successfulGetAppletMock,
        [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
        [getAppletSubjectActivitiesUrl]: successfulGetAppletSubjectActivitiesMock,
        [getWorkspaceRespondentsUrl]: (params) => {
          if (params.userId === mockedOwnerRespondent.id) {
            return mockSuccessfulHttpResponse<ParticipantsData>({
              result: [mockedOwnerRespondent],
              count: 1,
            });
          }

          return successfulGetAppletParticipantsMock;
        },
        [getWorkspaceManagersUrl]: successfulGetAppletManagersMock,
      });

      const { getByTestId, getByRole } = renderWithProviders(<Activities />, {
        preloadedState: {
          ...preloadedState,
          auth: {
            authentication: mockSchema({
              user: mockedUserData,
            }),
            isAuthorized: true,
            isLogoutInProgress: false,
          },
        },
        route,
        routePath,
      });

      await openTakeNowModal(testId);

      expectMixpanelTrack('Take Now click', {
        [MixpanelProps.Via]: 'Applet - Participants - Activities',
      });

      await selectParticipant(testId, 'source', mockedOwnerRespondent.details[0].subjectId);

      expectMixpanelTrack('"Who will be providing responses" dropdown opened');
      expectMixpanelTrack('"Who will be providing responses" selection changed', {
        [MixpanelProps.SourceAccountType]: 'Team',
      });

      await toggleSelfReportCheckbox(testId);

      expectMixpanelTrack('Own responses checkbox toggled', {
        [MixpanelProps.IsSelfReporting]: false,
      });

      const dropdownTestId = `${takeNowModalTestId(testId)}-logged-in-user-dropdown`;

      const inputElement = getByTestId(dropdownTestId).querySelector('input');

      if (inputElement === null) {
        throw new Error('Autocomplete logged-in user dropdown element not found');
      }

      fireEvent.mouseDown(inputElement);

      expectMixpanelTrack('"Who will be inputting the responses" dropdown opened');

      const options = within(getByRole('listbox')).queryAllByRole('option');

      expect(options.length).toBeGreaterThan(0);

      const dropdownOptionTestIdRegex = new RegExp(`^${dropdownTestId}-option-`);
      const optionsText = options.map(
        (option) =>
          option.getAttribute('data-testid')?.replace(dropdownOptionTestIdRegex, '') || '',
      );

      expect(optionsText).not.toContain(mockedRespondent.details[0].subjectId);
      expect(optionsText).not.toContain(mockedRespondent2.details[0].subjectId);
    });

    describe('featureFlags.enableParticipantMultiInformant = true', () => {
      beforeEach(() => {
        mockUseFeatureFlags.mockReturnValue({
          featureFlags: {
            enableParticipantMultiInformant: true,
          },
          resetLDContext: jest.fn(),
        });
      });

      test('should pre-populate only participant in Take Now modal', async () => {
        const successfulGetAppletParticipantsMock = mockSuccessfulHttpResponse<ParticipantsData>({
          result: [mockedRespondent, mockedRespondent2, mockedOwnerRespondent],
          count: 3,
        });

        const successfulGetAppletManagersMock = mockSuccessfulHttpResponse<ManagersData>({
          result: [
            {
              id: mockedOwnerRespondent.id,
              firstName: mockedUserData.firstName,
              lastName: mockedUserData.lastName,
              email: mockedOwnerRespondent.email,
              roles: [Roles.Owner],
              lastSeen: new Date().toDateString(),
              isPinned: mockedOwnerRespondent.isPinned,
              applets: [
                {
                  id: mockedApplet.id,
                  displayName: mockedApplet.displayName,
                  image: '',
                  roles: [
                    {
                      accessId: '912e17b8-195f-4685-b77b-137539b9054d',
                      role: Roles.Owner,
                    },
                  ],
                  encryption: mockedEncryption,
                },
              ],
              title: null,
              createdAt: new Date().toISOString(),
              titles: [],
              status: 'approved',
              invitationKey: null,
            },
          ],
          count: 1,
        });

        mockGetRequestResponses({
          [getAppletUrl]: successfulGetAppletMock,
          [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
          [getAppletSubjectActivitiesUrl]: successfulGetAppletSubjectActivitiesMock,
          [getWorkspaceRespondentsUrl]: (params) => {
            if (params.userId === mockedOwnerRespondent.id) {
              return mockSuccessfulHttpResponse<ParticipantsData>({
                result: [mockedOwnerRespondent],
                count: 1,
              });
            }

            return successfulGetAppletParticipantsMock;
          },
          [getWorkspaceManagersUrl]: successfulGetAppletManagersMock,
        });

        renderWithProviders(<Activities />, {
          preloadedState: {
            ...preloadedState,
            auth: {
              authentication: mockSchema({
                user: mockedUserData,
              }),
              isAuthorized: true,
              isLogoutInProgress: false,
            },
          },
          route,
          routePath,
        });

        await openTakeNowModal(testId);

        const sourceSubjectInputElement = screen
          .getByTestId(sourceSubjectDropdownTestId(testId))
          .querySelector('input');

        const targetSubjectInputElement = screen
          .getByTestId(targetSubjectDropdownTestId(testId))
          .querySelector('input');

        const { firstName, lastName, tag } =
          preloadedState?.users?.subjectDetails.data?.result ?? {};

        expect(targetSubjectInputElement).toHaveValue(`${firstName} ${lastName} (${tag})`);

        expect(sourceSubjectInputElement).toHaveValue('');
      });

      test('Full account participants can self-report', async () => {
        const successfulGetAppletParticipantsMock = mockSuccessfulHttpResponse<ParticipantsData>({
          result: [mockedRespondent, mockedRespondent2, mockedOwnerRespondent],
          count: 3,
        });

        const successfulGetAppletManagersMock = mockSuccessfulHttpResponse<ManagersData>({
          result: [
            {
              id: mockedOwnerRespondent.id,
              firstName: mockedUserData.firstName,
              lastName: mockedUserData.lastName,
              email: mockedOwnerRespondent.email,
              roles: [Roles.Owner],
              lastSeen: new Date().toDateString(),
              isPinned: mockedOwnerRespondent.isPinned,
              applets: [
                {
                  id: mockedApplet.id,
                  displayName: mockedApplet.displayName,
                  image: '',
                  roles: [
                    {
                      accessId: '912e17b8-195f-4685-b77b-137539b9054d',
                      role: Roles.Owner,
                    },
                  ],
                  encryption: mockedEncryption,
                },
              ],
              title: null,
              createdAt: new Date().toISOString(),
              titles: [],
              status: 'approved',
              invitationKey: null,
            },
          ],
          count: 1,
        });

        mockGetRequestResponses({
          [getAppletUrl]: successfulGetAppletMock,
          [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
          [getAppletSubjectActivitiesUrl]: successfulGetAppletSubjectActivitiesMock,
          [getWorkspaceRespondentsUrl]: (params) => {
            if (params.userId === mockedOwnerRespondent.id) {
              return mockSuccessfulHttpResponse<ParticipantsData>({
                result: [mockedOwnerRespondent],
                count: 1,
              });
            }

            return successfulGetAppletParticipantsMock;
          },
          [getWorkspaceManagersUrl]: successfulGetAppletManagersMock,
        });

        const { getByTestId } = renderWithProviders(<Activities />, {
          preloadedState: {
            ...preloadedState,
            auth: {
              authentication: mockSchema({
                user: mockedUserData,
              }),
              isAuthorized: true,
              isLogoutInProgress: false,
            },
          },
          route,
          routePath,
        });

        await openTakeNowModal(testId);

        selectParticipant(testId, 'source', mockedRespondent.details[0].subjectId);

        expectMixpanelTrack('"Who will be providing responses" dropdown opened');
        expectMixpanelTrack('"Who will be providing responses" selection changed', {
          [MixpanelProps.SourceAccountType]: 'Full',
        });

        const checkbox = getByTestId(selfReportCheckboxTestId(testId)).querySelector('input');

        expect(checkbox).not.toBeDisabled();
      });

      test('Full account participants are present in the inputting dropdown', async () => {
        const successfulGetAppletParticipantsMock = mockSuccessfulHttpResponse<ParticipantsData>({
          result: [mockedRespondent, mockedRespondent2, mockedOwnerRespondent],
          count: 3,
        });

        const successfulGetAppletManagersMock = mockSuccessfulHttpResponse<ManagersData>({
          result: [
            {
              id: mockedOwnerRespondent.id,
              firstName: mockedUserData.firstName,
              lastName: mockedUserData.lastName,
              email: mockedOwnerRespondent.email,
              roles: [Roles.Owner],
              lastSeen: new Date().toDateString(),
              isPinned: mockedOwnerRespondent.isPinned,
              applets: [
                {
                  id: mockedApplet.id,
                  displayName: mockedApplet.displayName,
                  image: '',
                  roles: [
                    {
                      accessId: '912e17b8-195f-4685-b77b-137539b9054d',
                      role: Roles.Owner,
                    },
                  ],
                  encryption: mockedEncryption,
                },
              ],
              title: null,
              createdAt: new Date().toISOString(),
              titles: [],
              status: 'approved',
              invitationKey: null,
            },
          ],
          count: 1,
        });

        mockGetRequestResponses({
          [getAppletUrl]: successfulGetAppletMock,
          [getAppletActivitiesUrl]: successfulGetAppletActivitiesMock,
          [getAppletSubjectActivitiesUrl]: successfulGetAppletSubjectActivitiesMock,
          [getWorkspaceRespondentsUrl]: (params) => {
            if (params.userId === mockedOwnerRespondent.id) {
              return mockSuccessfulHttpResponse<ParticipantsData>({
                result: [mockedOwnerRespondent],
                count: 1,
              });
            }

            return successfulGetAppletParticipantsMock;
          },
          [getWorkspaceManagersUrl]: successfulGetAppletManagersMock,
        });

        const { getByTestId, getByRole } = renderWithProviders(<Activities />, {
          preloadedState: {
            ...preloadedState,
            auth: {
              authentication: mockSchema({
                user: mockedUserData,
              }),
              isAuthorized: true,
              isLogoutInProgress: false,
            },
          },
          route,
          routePath,
        });

        await openTakeNowModal(testId);

        await selectParticipant(testId, 'source', mockedOwnerRespondent.details[0].subjectId);

        expectMixpanelTrack('"Who will be providing responses" dropdown opened');
        expectMixpanelTrack('"Who will be providing responses" selection changed', {
          [MixpanelProps.SourceAccountType]: 'Team',
        });

        await toggleSelfReportCheckbox(testId);

        expectMixpanelTrack('Own responses checkbox toggled', {
          [MixpanelProps.IsSelfReporting]: false,
        });

        const dropdownTestId = `${takeNowModalTestId(testId)}-logged-in-user-dropdown`;

        const inputElement = getByTestId(dropdownTestId).querySelector('input');

        if (inputElement === null) {
          throw new Error('Autocomplete logged-in user dropdown element not found');
        }

        fireEvent.mouseDown(inputElement);

        expectMixpanelTrack('"Who will be inputting the responses" dropdown opened');

        const options = within(getByRole('listbox')).queryAllByRole('option');

        expect(options.length).toBeGreaterThan(0);

        const dropdownOptionTestIdRegex = new RegExp(`^${dropdownTestId}-option-`);
        const optionsText = options.map(
          (option) =>
            option.getAttribute('data-testid')?.replace(dropdownOptionTestIdRegex, '') || '',
        );

        expect(optionsText).toContain(mockedRespondent.details[0].subjectId);
        expect(optionsText).toContain(mockedRespondent2.details[0].subjectId);
      });
    });
  });
});
