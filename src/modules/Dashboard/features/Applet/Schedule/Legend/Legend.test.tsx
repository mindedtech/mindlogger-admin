import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockedAppletId } from 'shared/mock';
import * as renderWithProvidersUtils from 'shared/utils/renderWithProviders';

import { Legend } from './Legend';
import { PreparedEvents } from '../Schedule.types';

const dataTestid = 'dashboard-calendar-schedule-legend';
const testUserId = 'test-user-id';

const legendEvents = {
  alwaysAvailableEvents: [
    {
      id: '147fb738-5f3d-432f-b686-d6919f445795',
      name: 'Activity 1',
      isFlow: false,
      colors: ['#0b6e99', '#0b6e99'],
    },
  ],
  scheduledEvents: [
    {
      id: '41dcd5f3-03c8-4aea-a3b0-3e493cff3dda',
      name: 'Activity 2',
      isFlow: false,
      count: 1,
      colors: ['#0f7b6c', 'rgba(15, 123, 108, 0.3)'],
    },
  ],
  deactivatedEvents: [],
  scheduleExportTableData: [
    {
      activityName: {
        value: 'Activity 1',
      },
      date: {
        value: '09 Apr 2024',
      },
      startTime: {
        value: '-',
      },
      endTime: {
        value: '-',
      },
      notificationTime: {
        value: '-',
      },
      frequency: {
        value: 'Always',
      },
    },
    {
      activityName: {
        value: 'Activity 2',
      },
      date: {
        value: '11 Apr 2024',
      },
      startTime: {
        value: '00:00',
      },
      endTime: {
        value: '23:59',
      },
      notificationTime: {
        value: '-',
      },
      frequency: {
        value: 'Weekly',
      },
    },
  ],
  scheduleExportCsv: [
    {
      activityName: 'Activity 1',
      date: '09 Apr 2024',
      startTime: '-',
      endTime: '-',
      notificationTime: '-',
      frequency: 'Always',
    },
    {
      activityName: 'Activity 2',
      date: '11 Apr 2024',
      startTime: '00:00',
      endTime: '23:59',
      notificationTime: '-',
      frequency: 'Weekly',
    },
  ],
} as unknown as PreparedEvents;

jest.mock('shared/components', () => ({
  ...jest.requireActual('shared/components'),
  Table: () => <div>table component</div>,
}));

describe('Legend', () => {
  describe('Renders the appropriate controls', () => {
    beforeEach(() => {
      renderWithProvidersUtils.renderWithProviders(
        <Legend legendEvents={legendEvents} appletName="Mock applet" appletId={mockedAppletId} />,
      );
    });

    test("Should show the 'Import' button", async () => {
      const importButton = screen.getByTestId(`${dataTestid}-import`);
      expect(importButton).toBeInTheDocument();
      expect(importButton).toHaveTextContent('Import');

      await userEvent.click(importButton);

      expect(screen.getByTestId(`${dataTestid}-import-schedule-popup`)).toBeInTheDocument();
      const closeImportPopupButton = screen.getByTestId(
        `${dataTestid}-import-schedule-popup-close-button`,
      );
      expect(closeImportPopupButton).toBeInTheDocument();

      await userEvent.click(closeImportPopupButton);

      expect(screen.queryByTestId(`${dataTestid}-import-schedule-popup`)).not.toBeInTheDocument();
    });

    test("Should show the 'Clear all scheduled events' button", async () => {
      const clearAllScheduledEventsButton = screen.getByTestId(`${dataTestid}-scheduled-0`);

      await userEvent.click(clearAllScheduledEventsButton);

      expect(screen.getByTestId(`${dataTestid}-clear-scheduled-events-popup`)).toBeInTheDocument();

      const closeClearScheduledEventsPopupButton = screen.getByTestId(
        `${dataTestid}-clear-scheduled-events-popup-close-button`,
      );

      await userEvent.click(closeClearScheduledEventsPopupButton);

      expect(
        screen.queryByTestId(`${dataTestid}-clear-scheduled-events-popup`),
      ).not.toBeInTheDocument();
    });

    test("Should show the 'Export' button", async () => {
      const exportButton = screen.getByTestId(`${dataTestid}-export`);
      expect(exportButton).toBeInTheDocument();
      expect(exportButton).toHaveTextContent('Export');
    });
  });

  describe('When `showScheduleToggle` is false', () => {
    beforeEach(() => {
      renderWithProvidersUtils.renderWithProviders(
        <Legend
          legendEvents={legendEvents}
          appletName="Mock applet"
          appletId={mockedAppletId}
          userId={testUserId}
          showScheduleToggle={false}
        />,
      );
    });

    test('Should not show the schedule toggle', () => {
      const toggle = screen.queryByTestId(`${dataTestid}-schedule-toggle`);
      expect(toggle).not.toBeInTheDocument();
    });
  });

  describe('When `showScheduleToggle` is true', () => {
    test('Should show the schedule toggle', () => {
      renderWithProvidersUtils.renderWithProviders(
        <Legend
          legendEvents={legendEvents}
          appletName="Mock applet"
          appletId={mockedAppletId}
          userId={testUserId}
          showScheduleToggle
        />,
      );

      const toggle = screen.queryByTestId(`${dataTestid}-schedule-toggle`);
      expect(toggle).toBeInTheDocument();
    });

    describe('when `canCreateIndividualSchedule` is false', () => {
      test('The schedule toggle is disabled', () => {
        renderWithProvidersUtils.renderWithProviders(
          <Legend
            legendEvents={legendEvents}
            appletName="Mock applet"
            appletId={mockedAppletId}
            userId={testUserId}
            showScheduleToggle
            canCreateIndividualSchedule={false}
          />,
        );

        const toggle = screen.queryByTestId(`${dataTestid}-schedule-toggle`);
        expect(toggle).toBeInTheDocument();
        expect(toggle).toHaveAttribute('disabled');
      });
    });

    describe('when `canCreateIndividualSchedule` is true', () => {
      test('The schedule toggle is enabled', () => {
        renderWithProvidersUtils.renderWithProviders(
          <Legend
            legendEvents={legendEvents}
            appletName="Mock applet"
            appletId={mockedAppletId}
            userId={testUserId}
            showScheduleToggle
            canCreateIndividualSchedule
          />,
        );

        const toggle = screen.queryByTestId(`${dataTestid}-schedule-toggle`);
        expect(toggle).toBeInTheDocument();
        expect(toggle).not.toHaveAttribute('disabled');
      });
    });
  });

  describe('When showing the default schedule ', () => {
    beforeEach(() => {
      renderWithProvidersUtils.renderWithProviders(
        <Legend
          appletId={mockedAppletId}
          appletName="Mock applet"
          canCreateIndividualSchedule
          legendEvents={legendEvents}
          showScheduleToggle
          userId={testUserId}
        />,
      );
    });

    test('Should show the correct header', () => {
      const schedule = screen.getByTestId(`${dataTestid}-schedule`);
      expect(schedule).toBeInTheDocument();
      expect(schedule).toHaveTextContent('Default Schedule');
    });

    test('The toggle opens the "Add individual schedule" dialog', async () => {
      const toggle = screen.getByTestId(`${dataTestid}-schedule-toggle`);
      await userEvent.click(toggle);
      const addDialog = screen.queryByTestId(`${dataTestid}-schedule-toggle-add-popup`);

      expect(addDialog).toBeInTheDocument();
    });

    test('The export button the "Export default schedule" dialog', async () => {
      const exportButton = screen.getByTestId(`${dataTestid}-export`);
      expect(exportButton).toBeInTheDocument();
      expect(exportButton).toHaveTextContent('Export');

      await userEvent.click(exportButton);

      expect(screen.getByTestId(`${dataTestid}-export-default-schedule-popup`)).toBeInTheDocument();
      const closeExportPopupButton = screen.getByTestId(
        `${dataTestid}-export-default-schedule-popup-close-button`,
      );
      expect(closeExportPopupButton).toBeInTheDocument();

      await userEvent.click(closeExportPopupButton);

      expect(
        screen.queryByTestId(`${dataTestid}-export-default-schedule-popup`),
      ).not.toBeInTheDocument();
    });
  });

  describe('When showing an individual schedule', () => {
    beforeEach(() => {
      renderWithProvidersUtils.renderWithProviders(
        <Legend
          appletId={mockedAppletId}
          appletName="Mock applet"
          canCreateIndividualSchedule
          hasIndividualSchedule
          legendEvents={legendEvents}
          showScheduleToggle
          userId={testUserId}
        />,
      );
    });

    test('Should show the correct header', () => {
      const schedule = screen.getByTestId(`${dataTestid}-schedule`);
      expect(schedule).toBeInTheDocument();
      expect(schedule).toHaveTextContent('Individual Schedule');
    });

    test('The toggle opens the "Remove individual schedule" dialog', async () => {
      const toggle = screen.getByTestId(`${dataTestid}-schedule-toggle`);
      await userEvent.click(toggle);
      const addDialog = screen.queryByTestId(`${dataTestid}-schedule-toggle-remove-popup`);

      expect(addDialog).toBeInTheDocument();
    });

    test('The export button the "Export individual schedule" dialog', async () => {
      const exportButton = screen.getByTestId(`${dataTestid}-export`);
      expect(exportButton).toBeInTheDocument();
      expect(exportButton).toHaveTextContent('Export');

      await userEvent.click(exportButton);

      expect(
        screen.getByTestId(`${dataTestid}-export-individual-schedule-popup`),
      ).toBeInTheDocument();
      const closeExportPopupButton = screen.getByTestId(
        `${dataTestid}-export-individual-schedule-popup-close-button`,
      );
      expect(closeExportPopupButton).toBeInTheDocument();

      await userEvent.click(closeExportPopupButton);

      expect(
        screen.queryByTestId(`${dataTestid}-export-individual-schedule-popup`),
      ).not.toBeInTheDocument();
    });
  });
});
