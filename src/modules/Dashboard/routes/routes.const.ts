import { lazy } from 'react';

import { page } from 'resources';

const Applets = lazy(() => import('modules/Dashboard/features/Applets'));
const Managers = lazy(() => import('modules/Dashboard/features/Managers'));
const Respondents = lazy(() => import('modules/Dashboard/features/Respondents'));
const ParticipantActivities = lazy(
  () => import('modules/Dashboard/features/ParticipantDetails/ParticipantActivities'),
);
const ParticipantConnections = lazy(
  () => import('modules/Dashboard/features/ParticipantDetails/ParticipantConnections'),
);
const ParticipantSchedule = lazy(
  () => import('modules/Dashboard/features/ParticipantDetails/ParticipantSchedule'),
);
const AddUser = lazy(() => import('modules/Dashboard/features/Applet/AddUser'));
const Schedule = lazy(() => import('modules/Dashboard/features/Applet/Schedule'));
const Overview = lazy(() => import('modules/Dashboard/features/Applet/Overview'));
const Activities = lazy(() => import('modules/Dashboard/features/Applet/Activities'));
const AppletSettings = lazy(
  () => import('modules/Dashboard/features/Applet/DashboardAppletSettings'),
);

export const mainRoutes = [
  {
    path: page.dashboardApplets,
    Component: Applets,
  },
  {
    path: page.dashboardManagers,
    Component: Managers,
  },
  {
    path: page.dashboardRespondents,
    Component: Respondents,
  },
];

export const appletRoutes = [
  {
    path: page.appletOverview,
    Component: Overview,
  },
  {
    path: page.appletActivities,
    Component: Activities,
  },
  {
    path: page.appletRespondents,
    Component: Respondents,
  },
  {
    path: page.appletManagers,
    Component: Managers,
  },
  {
    path: page.appletSchedule,
    Component: Schedule,
  },
  {
    path: page.appletScheduleIndividual,
    Component: Schedule,
  },
  {
    path: page.appletSettings,
    Component: AppletSettings,
  },
  {
    path: page.appletSettingsItem,
    Component: AppletSettings,
  },
  {
    path: page.appletAddUser,
    Component: AddUser,
  },
];

export const participantDetailsRoutes = [
  {
    path: page.appletParticipantActivities,
    Component: ParticipantActivities,
  },
  {
    path: page.appletParticipantConnections,
    Component: ParticipantConnections,
  },
  {
    path: page.appletParticipantSchedule,
    Component: ParticipantSchedule,
  },
];
