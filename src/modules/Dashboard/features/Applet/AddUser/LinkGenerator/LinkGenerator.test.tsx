import { fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import Router from 'react-router';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { LinkGenerator } from './LinkGenerator';

const appletId = 'c0b1de97';
const response = {
  data: {
    result: {
      requireLogin: true,
      link: 'inviteId',
    },
  },
};

const fakeRequest = () => new Promise((res) => res(response));

describe('LinkGenerator component tests', () => {
  const mockedAxios = axios.create();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('LinkGenerator should generate link', async () => {
    jest.spyOn(mockedAxios, 'post').mockImplementation(fakeRequest);
    jest.spyOn(Router, 'useParams').mockReturnValue({ appletId });

    renderWithProviders(<LinkGenerator />);

    fireEvent.click(screen.getByTestId('dashboard-add-users-generate-link-generate'));
    await waitFor(() =>
      expect(
        screen.queryByTestId('dashboard-add-users-generate-link-generate-popup'),
      ).toBeInTheDocument(),
    );
    await waitFor(() => fireEvent.click(screen.getByText('Yes, account is required')));
    await waitFor(() =>
      expect(screen.getByTestId('dashboard-add-users-generate-link-url')).toBeInTheDocument(),
    );
  });

  test('LinkGenerator should get link', async () => {
    jest.spyOn(mockedAxios, 'get').mockImplementation(fakeRequest);
    jest.spyOn(Router, 'useParams').mockReturnValue({ appletId });

    renderWithProviders(<LinkGenerator />);

    await waitFor(() =>
      expect(screen.getByTestId('dashboard-add-users-generate-link-url')).toBeInTheDocument(),
    );
  });
});
