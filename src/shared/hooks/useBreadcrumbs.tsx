import { useEffect } from 'react';
import { useLocation, useParams, generatePath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import uniqueId from 'lodash.uniqueid';

import { Breadcrumb, breadcrumbs, applet, workspaces } from 'redux/modules';
import { useAppDispatch } from 'redux/store';
import { page } from 'resources';
import {
  getEntityKey,
  checkCurrentActivityPage,
  checkCurrentActivityFlowPage,
  checkIfAppletActivityUrlPassed,
  checkIfAppletActivityFlowUrlPassed,
  checkIfAppletFlankerUrlPassed,
} from 'shared/utils';
import { useCheckIfNewApplet } from 'shared/hooks/useCheckIfNewApplet';
import { getRespondentLabel } from 'modules/Dashboard/features/RespondentData/RespondentData.utils';
import { PerformanceTasks } from 'modules/Builder/features/Activities/Activities.types';
import { useRespondentLabel } from 'modules/Dashboard/hooks';

export const useBreadcrumbs = (restCrumbs?: Breadcrumb[]) => {
  const { appletId, activityId, activityFlowId, respondentId } = useParams();
  const { t } = useTranslation('app');
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const respondentLabel = useRespondentLabel();
  const { workspaceName } = workspaces.useData() ?? {};
  const { result: appletData } = applet.useAppletData() ?? {};
  const isNewApplet = useCheckIfNewApplet();
  const appletLabel = (isNewApplet ? t('newApplet') : appletData?.displayName) ?? '';
  const currentActivityName = appletData?.activities?.find(
    (activity) => getEntityKey(activity) === activityId,
  )?.name;
  const activityLabel = currentActivityName ?? t('newActivity');
  const flankerLabel = currentActivityName ?? PerformanceTasks.Flanker;
  const activityFlowLabel =
    appletData?.activityFlows?.find((activityFlow) => getEntityKey(activityFlow) === activityFlowId)
      ?.name ?? t('newActivityFlow');
  const activitiesBreadcrumb = {
    icon: 'checklist-outlined',
    label: t('activities'),
    navPath:
      appletId && activityId
        ? generatePath(page.builderAppletActivities, { appletId, activityId })
        : '',
  };

  useEffect(() => {
    const newBreadcrumbs: Breadcrumb[] = [];
    const isDashboard = pathname.includes(page.dashboard);
    const isBuilder = pathname.includes(page.builder);
    const isLibrary = pathname.includes(page.library);

    if (workspaceName && isDashboard) {
      newBreadcrumbs.push({
        icon: 'home',
        label: t('userDashboard', { userName: workspaceName }),
        navPath: page.dashboard,
      });
    }
    if (workspaceName && isBuilder) {
      newBreadcrumbs.push({
        icon: 'builder',
        label: t('userBuilder', { userName: workspaceName }),
        navPath: page.builder,
      });
    }
    if (isLibrary) {
      newBreadcrumbs.push({
        icon: 'library',
        label: t('appletLibrary'),
        navPath: page.library,
      });
    }

    if (appletId && (isDashboard || isBuilder)) {
      newBreadcrumbs.push({
        icon: appletData?.image || '',
        label: appletLabel,
        navPath: generatePath(isDashboard ? page.appletRespondents : page.builderApplet, {
          appletId,
        }),
        hasUrl: !!appletData?.image,
      });
    }

    if (pathname.includes('respondents')) {
      newBreadcrumbs.push({
        icon: 'respondent-outlined',
        label: t('respondents'),
        navPath: appletId
          ? generatePath(page.appletRespondents, { appletId })
          : page.dashboardRespondents,
      });
    }
    if (respondentId) {
      newBreadcrumbs.push({
        icon: 'account',
        label: respondentLabel,
        disabledLink: true,
      });
    }
    if (pathname.includes('dataviz')) {
      newBreadcrumbs.push({
        icon: '',
        label: t('viewData'),
        disabledLink: true,
      });
    }

    if (checkIfAppletActivityUrlPassed(pathname)) {
      const { isAbout, isItems, isItemsFlow, isActivitySettings } =
        checkCurrentActivityPage(pathname);

      newBreadcrumbs.push(activitiesBreadcrumb, {
        icon: '',
        label: activityLabel!,
        navPath: generatePath(page.builderAppletActivity, { appletId, activityId }),
      });

      if (isAbout) newBreadcrumbs.push({ icon: 'more-info-outlined', label: t('aboutActivity') });
      if (isItems) newBreadcrumbs.push({ icon: 'item-outlined', label: t('items') });
      if (isItemsFlow) newBreadcrumbs.push({ icon: 'flow', label: t('itemFlow') });
      if (isActivitySettings)
        newBreadcrumbs.push({ icon: 'settings', label: t('activitySettings') });
    }

    if (checkIfAppletFlankerUrlPassed(pathname)) {
      newBreadcrumbs.push(
        activitiesBreadcrumb,
        {
          icon: '',
          label: flankerLabel,
          disabledLink: true,
        },
        {
          icon: 'report-configuration',
          label: t('configure'),
        },
      );
    }

    if (checkIfAppletActivityFlowUrlPassed(pathname)) {
      const { isAbout, isBuilder } = checkCurrentActivityFlowPage(pathname);

      newBreadcrumbs.push(
        {
          icon: 'flow',
          label: t('activityFlow'),
          navPath: generatePath(page.builderAppletActivityFlow, {
            appletId,
          }),
        },
        {
          icon: '',
          label: activityFlowLabel!,
          navPath: generatePath(page.builderAppletActivityFlowItem, { appletId, activityFlowId }),
        },
      );

      if (isAbout)
        newBreadcrumbs.push({
          icon: 'more-info-outlined',
          label: t('aboutActivityFlow'),
        });
      if (isBuilder)
        newBreadcrumbs.push({
          icon: 'flow',
          label: t('activityFlowBuilder'),
        });
    }

    const updatedBreadcrumbs = [...newBreadcrumbs, ...(restCrumbs || [])].map((crumb) => ({
      ...crumb,
      key: uniqueId(),
    }));
    dispatch(breadcrumbs.actions.setBreadcrumbs(updatedBreadcrumbs));
  }, [
    t,
    workspaceName,
    appletData,
    appletId,
    activityId,
    appletLabel,
    activityLabel,
    activityFlowLabel,
    pathname,
    dispatch,
    respondentLabel,
  ]);
};
