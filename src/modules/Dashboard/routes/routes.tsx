import { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';

import { page } from 'resources';
import { PrivateRoute } from 'routes/PrivateRoute';

import { appletRoutes, respondentDataRoutes } from './routes.const';

const Main = lazy(() => import('../pages/Main'));
const Applet = lazy(() => import('../pages/Applet'));
const RespondentData = lazy(() => import('../pages/RespondentData'));

export const dashboardRoutes = () => (
  <Route path={page.dashboard}>
    <Route
      path={page.dashboard}
      element={
        <PrivateRoute>
          <Main />
        </PrivateRoute>
      }
    />
    <Route element={<Applet />}>
      {appletRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute>
              <Component />
            </PrivateRoute>
          }
        />
      ))}
      <Route element={<RespondentData />}>
        <Route
          path={page.appletRespondentData}
          element={<Navigate to={page.appletRespondentDataSummary} />}
        />
        {respondentDataRoutes.map(({ path, Component }) => (
          <Route
            key={path}
            path={path}
            element={
              <PrivateRoute>
                <Component />
              </PrivateRoute>
            }
          />
        ))}
      </Route>
    </Route>
  </Route>
);
