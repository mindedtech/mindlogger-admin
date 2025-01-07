// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils/renderWithProviders';

import { ProlificIntegration } from './ProlificIntegration';
import { prolificIntegrationExists } from './ProlificIntegration.utils';

jest.mock('./ProlificIntegration.utils', () => ({
  getProlificApiToken: jest.fn(),
}));

describe('ProlificIntegration', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render the ProlificIntegration component', () => {
    prolificIntegrationExists.mockResolvedValue(null);

    renderWithProviders(<ProlificIntegration />);

    expect(screen.getByTestId('prolific-integration')).toBeInTheDocument();
    expect(screen.getByText('Prolific')).toBeInTheDocument();
    expect(screen.getByTestId('prolific-connect')).toBeInTheDocument();
    expect(screen.getByTestId('prolific-description')).toBeInTheDocument();
    expect(screen.queryByTestId('prolific-disconnect')).toBeNull();
    expect(screen.queryByTestId('prolific-view-dashboard')).toBeNull();
    expect(screen.queryByTestId('prolific-add-study')).toBeNull();

    expect(screen.queryByTestId('prolific-configuration-popup')).toBeNull();
  });

  test('should render the ProlificIntegration connected component when api token exists', async () => {
    prolificIntegrationExists.mockResolvedValue(true);

    renderWithProviders(<ProlificIntegration />);

    expect(await screen.findByTestId('prolific-connected')).toBeInTheDocument();
    expect(await screen.findByTestId('prolific-connected')).toHaveTextContent('Connected');

    expect(await screen.findByTestId('prolific-integration')).toBeInTheDocument();
    expect(await screen.queryByTestId('prolific-configuration-popup')).toBeNull();
  });
});
