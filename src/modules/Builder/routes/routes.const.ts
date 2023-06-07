import { lazy } from 'react';

import { Path } from 'shared/utils';
import { PerformanceTasks } from '../features/Activities/Activities.types';

const Activities = lazy(() => import('modules/Builder/features/Activities'));
const AboutApplet = lazy(() => import('modules/Builder/features/AboutApplet'));
const ActivityAbout = lazy(() => import('modules/Builder/features/ActivityAbout'));
const ActivityItems = lazy(() => import('modules/Builder/features/ActivityItems'));
const ActivityFlowAbout = lazy(() => import('modules/Builder/features/ActivityFlowAbout'));
const ActivityFlow = lazy(() => import('modules/Builder/features/ActivityFlow'));
const ActivityFlowBuilder = lazy(() => import('modules/Builder/features/ActivityFlowBuilder'));
const ActivityItemsFlow = lazy(() => import('modules/Builder/features/ActivityItemsFlow'));
const Flanker = lazy(() => import('modules/Builder/features/PerformanceTasks/Flanker'));
const GyroscopeAndTouch = lazy(
  () => import('modules/Builder/features/PerformanceTasks/GyroscopeAndTouch'),
);

export const appletRoutes = [
  { path: Path.About, Component: AboutApplet },
  { path: Path.Activities, Component: Activities },
  { path: Path.ActivityFlow, Component: ActivityFlow },
];

export const appletActivityRoutes = [
  { path: Path.About, Component: ActivityAbout },
  { path: Path.Items, Component: ActivityItems },
  { path: Path.ItemsFlow, Component: ActivityItemsFlow },
];

export const appletActivityFlowRoutes = [
  { path: Path.About, Component: ActivityFlowAbout },
  { path: Path.FlowBuilder, Component: ActivityFlowBuilder },
];

export const performanceTasksRoutes = [
  { path: Path.Flanker, Component: Flanker },
  {
    path: Path.Gyroscope,
    Component: GyroscopeAndTouch,
    props: { type: PerformanceTasks.Gyroscope },
  },
  { path: Path.Touch, Component: GyroscopeAndTouch, props: { type: PerformanceTasks.Touch } },
];
