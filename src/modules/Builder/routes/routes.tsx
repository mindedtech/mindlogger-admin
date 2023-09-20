import { lazy } from 'react';
import { Route, Navigate, generatePath } from 'react-router-dom';

import { page } from 'resources';
import { PrivateRoute } from 'routes/PrivateRoute';
import { Path } from 'shared/utils';
import BuilderAppletSettings from 'modules/Builder/features/BuilderAppletSettings';
import ActivitySettings from 'modules/Builder/features/ActivitySettings';

import {
  appletRoutes,
  appletActivityRoutes,
  appletActivityFlowRoutes,
  performanceTasksRoutes,
} from './routes.const';
import ActivityFlowSettings from '../features/ActivityFlowSettings';
import ActivityItems from '../features/ActivityItems';

const BuilderApplet = lazy(() => import('../pages/BuilderApplet'));
const BuilderActivityFlow = lazy(() => import('../pages/BuilderActivityFlow'));
const BuilderActivity = lazy(() => import('../pages/BuilderActivity'));

export const builderRoutes = () => (
  <Route path={page.builder}>
    <Route element={<BuilderApplet />} path=":appletId">
      <Route index element={<Navigate to={Path.About} replace />} />
      {appletRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={<PrivateRoute>{Component ? <Component /> : <></>}</PrivateRoute>}
        />
      ))}
      <Route path={Path.Settings}>
        <Route element={<BuilderAppletSettings />} path="">
          <Route
            path=":setting"
            element={
              <PrivateRoute>
                <BuilderAppletSettings />
              </PrivateRoute>
            }
          />
        </Route>
      </Route>
      <Route path={Path.Activities}>
        <Route element={<BuilderActivity />} path=":activityId">
          <Route index element={<Navigate to={Path.About} replace />} />
          {appletActivityRoutes.map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={<PrivateRoute>{Component ? <Component /> : <></>}</PrivateRoute>}
            />
          ))}
          <Route path={Path.Items} element={<ActivityItems />}>
            <Route
              path=":itemId"
              element={
                <PrivateRoute>
                  <ActivityItems />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path={Path.Settings} element={<ActivitySettings />}>
            <Route
              path=":setting"
              element={
                <PrivateRoute>
                  <ActivitySettings />
                </PrivateRoute>
              }
            />
          </Route>
        </Route>
        <Route path={Path.PerformanceTask}>
          {performanceTasksRoutes.map(({ path, Component, props = {} }) => (
            <Route key={path} path={path}>
              <Route
                path=":activityId"
                element={
                  <PrivateRoute>
                    <Component {...props} />
                  </PrivateRoute>
                }
              />
            </Route>
          ))}
        </Route>
      </Route>
      <Route path={Path.ActivityFlow}>
        <Route element={<BuilderActivityFlow />} path=":activityFlowId">
          <Route index element={<Navigate to={Path.About} replace />} />
          {appletActivityFlowRoutes.map(({ path, Component }) => (
            <Route
              key={path}
              path={path}
              element={<PrivateRoute>{Component ? <Component /> : <></>}</PrivateRoute>}
            />
          ))}
          <Route path={Path.Settings} element={<ActivityFlowSettings />}>
            <Route
              path=":setting"
              element={
                <PrivateRoute>
                  <ActivityFlowSettings />
                </PrivateRoute>
              }
            />
          </Route>
        </Route>
      </Route>
    </Route>
    <Route
      path=""
      element={
        <Navigate
          to={generatePath(page.builderApplet, {
            appletId: Path.NewApplet,
          })}
          replace
        />
      }
    />
  </Route>
);
