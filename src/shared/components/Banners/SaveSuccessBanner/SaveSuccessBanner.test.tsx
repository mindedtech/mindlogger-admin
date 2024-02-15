import { fireEvent, render, screen } from '@testing-library/react';

import { renderWithProviders } from 'shared/utils';

import { SaveSuccessBanner } from './SaveSuccessBanner';

const mockOnClose = jest.fn();

describe('SaveSuccessBanner', () => {
  test('should render', () => {
    renderWithProviders(<SaveSuccessBanner />);

    expect(screen.getByTestId('save-success-banner')).toBeInTheDocument();
    expect(screen.getByText('Changes saved')).toBeInTheDocument();
  });

  test('clicking the close button hides the banner', () => {
    render(<SaveSuccessBanner onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
