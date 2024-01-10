import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import mockAxios from 'jest-mock-axios';

import { renderWithProviders } from 'shared/utils/renderWithProviders';
import { mockedAppletId, mockedCurrentWorkspace } from 'shared/mock';
import { page } from 'resources';
import { initialStateData } from 'shared/state';
import { Roles } from 'shared/consts';

import { AddUserForm } from './AddUserForm';
import { dataTestId } from './AddUserForm.const';

const route = `/dashboard/${mockedAppletId}/add-user`;
const routePath = page.appletAddUser;
const preloadedState = {
  workspaces: {
    workspaces: initialStateData,
    currentWorkspace: {
      ...initialStateData,
      ...mockedCurrentWorkspace,
    },
    roles: initialStateData,
    workspacesRoles: initialStateData,
  },
};
const getMockedWorkspaceInfo = (hasManagers: boolean) => ({
  data: {
    result: {
      hasManagers,
    },
  },
});

const mockedGetInvitationsHandler = () => jest.fn();

const renderComponent = () =>
  renderWithProviders(<AddUserForm getInvitationsHandler={mockedGetInvitationsHandler} />, {
    preloadedState,
    route,
    routePath,
  });

const handleRoleChange = async (role: Roles) => {
  const selectWrapper = screen.getByTestId(`${dataTestId}-role`).childNodes[1].childNodes[0];
  await userEvent.click(selectWrapper as Element);
  const optionsWrapper = await waitFor(() => screen.findByRole('listbox'));
  await userEvent.click(within(optionsWrapper).getByText(new RegExp(role, 'i')));
};

const formButtonsTest = async () => {
  expect(await screen.findByTestId(`${dataTestId}-reset`)).toBeInTheDocument();
  expect(screen.queryByTestId(`${dataTestId}-send-without-inviting`)).not.toBeInTheDocument();
};

const commonLabelNames = ['Role', 'First Name', 'Last Name', 'Language'];
const onlyRespondentLabelNames = [
  'ID',
  'Email (only required for invitation)',
  'Nickname (optional)',
];
const respondentLabelNames = [...commonLabelNames, ...onlyRespondentLabelNames];
const onlyReviewerLabelName = 'Respondents';
const reviewerLabelNames = [...commonLabelNames, onlyReviewerLabelName];

const commonLabelNamesTest = () => {
  commonLabelNames.forEach((label) => expect(screen.getByLabelText(label)).toBeInTheDocument());
  onlyRespondentLabelNames.forEach((label) =>
    expect(screen.queryByLabelText(label)).not.toBeInTheDocument(),
  );
  expect(screen.queryByLabelText(onlyReviewerLabelName)).not.toBeInTheDocument();
};

describe('AddUserForm component tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('The form has fields and buttons according to the role', async () => {
    mockAxios.get.mockResolvedValueOnce(getMockedWorkspaceInfo(true));
    renderComponent();

    //test for Respondent
    respondentLabelNames.forEach((label) =>
      expect(screen.getByLabelText(label)).toBeInTheDocument(),
    );
    expect(screen.queryByLabelText(onlyReviewerLabelName)).not.toBeInTheDocument();
    expect(screen.getByTestId(`${dataTestId}-send-without-inviting`)).toBeInTheDocument();
    expect(screen.queryByTestId(`${dataTestId}-reset`)).not.toBeInTheDocument();

    //test for Manager
    await handleRoleChange(Roles.Manager);
    commonLabelNamesTest();
    await formButtonsTest();

    //test for Coordinator
    await handleRoleChange(Roles.Coordinator);
    commonLabelNamesTest();
    await formButtonsTest();

    //test for Editor
    await handleRoleChange(Roles.Editor);
    commonLabelNamesTest();
    await formButtonsTest();

    //test for Reviewer
    await handleRoleChange(Roles.Reviewer);
    reviewerLabelNames.forEach((label) => expect(screen.getByLabelText(label)).toBeInTheDocument());
    onlyRespondentLabelNames.forEach((label) =>
      expect(screen.queryByLabelText(label)).not.toBeInTheDocument(),
    );
    await formButtonsTest();
  });

  test('AddUserForm should appear respondents and workspace name when select reviewer with no managers in workspace', async () => {
    mockAxios.get.mockResolvedValueOnce(getMockedWorkspaceInfo(false));
    renderComponent();

    await handleRoleChange(Roles.Reviewer);

    await waitFor(() => {
      expect(screen.getByLabelText('Respondents')).toBeInTheDocument();
      expect(screen.getByTestId(`${dataTestId}-workspace`)).toBeInTheDocument();
    });
  });
});
