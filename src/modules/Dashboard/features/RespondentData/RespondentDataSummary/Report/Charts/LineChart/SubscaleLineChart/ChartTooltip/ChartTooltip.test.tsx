// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { render, screen, within } from '@testing-library/react';

import { ChartTooltip } from './ChartTooltip';
// Import styled components

const dataTestid = 'subscale-line-chart';

const props = {
  dataPoints: [
    {
      date: new Date(2023, 11, 20, 14, 55), // Dec 20, 14:55
      backgroundColor: 'blue',
      label: 'Example 1',
      value: 42,
      optionText: 'Mocked Option Text',
    },
    {
      date: new Date(2023, 11, 20, 17, 20), // Dec 20, 17:20
      backgroundColor: 'yellow',
      label: 'Example 2',
      value: 7,
    },
  ],
  'data-testid': dataTestid,
};

jest.mock('./ChartTooltip.styles', () => ({
  ...jest.requireActual('./ChartTooltip.styles'),
  StyledMdPreview: ({ modelValue, 'data-testid': dataTestid }) => (
    <div data-testid={dataTestid}>{modelValue}</div>
  ),
}));

describe('ChartTooltip', () => {
  test('renders component correctly when props data is null', () => {
    render(<ChartTooltip data={null} />);
    const tooltip = screen.queryByTestId(`${dataTestid}-tooltip`);
    expect(tooltip).toBeNull(); // Using Jest's default matcher to check if the element is not present
  });

  test('renders component correctly', () => {
    render(<ChartTooltip {...props} />);
    const tooltip = screen.queryByTestId(`${dataTestid}-tooltip`);
    expect(tooltip).not.toBeNull();

    const regex = new RegExp(`${dataTestid}-tooltip-item-\\d+$`);
    const tooltipItems = screen.queryAllByTestId(regex);
    expect(tooltipItems.length).toBe(2);

    const itemContainer0 = screen.getByTestId(`${dataTestid}-tooltip-item-0`);
    expect(itemContainer0.textContent).toContain('Example 1: 42');
    const mdEditor0 = within(itemContainer0).queryByTestId(
      `${dataTestid}-tooltip-item-0-md-preview`,
    );
    expect(mdEditor0).not.toBeNull();
    expect(itemContainer0.textContent).toContain('Mocked Option Text');
    expect(itemContainer0.textContent).toContain('Dec 20, 14:55');

    const itemContainer1 = screen.getByTestId(`${dataTestid}-tooltip-item-1`);
    expect(itemContainer1.textContent).toContain('Example 2: 7');
    const mdEditor1 = within(itemContainer1).queryByTestId(
      `${dataTestid}-tooltip-item-1-md-preview`,
    );
    expect(mdEditor1).toBeNull();
    expect(itemContainer1.textContent).toContain('Dec 20, 17:20');
  });
});
