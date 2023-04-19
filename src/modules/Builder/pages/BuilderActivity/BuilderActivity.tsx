import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, generatePath } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import { StyledDirectoryUpButton, StyledBody } from 'shared/styles/styledComponents';
import { LinkedTabs, Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';
import { page } from 'resources';

import { getActivityTabs } from './BuilderActivity.utils';
import { useCurrentActivity } from '../BuilderApplet/BuilderApplet.hooks';

export const BuilderActivity = () => {
  const { t } = useTranslation();
  const { activityId, appletId } = useParams();
  const navigate = useNavigate();
  useBreadcrumbs();

  const { fieldName = '', activity } = useCurrentActivity();

  const { trigger, getFieldState } = useFormContext();

  const navigateToActivities = () =>
    navigate(generatePath(page.builderAppletActivities, { appletId }));

  const handleBackBtnClick = async () => {
    await trigger();
    navigateToActivities();
  };

  useEffect(() => {
    if (activityId && !activity) navigateToActivities();
  }, [activityId, activity]);

  const tabErrors = {
    hasAboutActivityErrors: !!getFieldState(`${fieldName}.name`).error,
    hasActivityItemsErrors: !!getFieldState(`${fieldName}.items`).error,
  };

  return (
    <StyledBody sx={{ position: 'relative' }}>
      <StyledDirectoryUpButton
        variant="text"
        onClick={handleBackBtnClick}
        startIcon={<Svg id="directory-up" width="18" height="18" />}
      >
        {t('activities')}
      </StyledDirectoryUpButton>
      {activityId && <LinkedTabs tabs={getActivityTabs({ activityId, appletId }, tabErrors)} />}
    </StyledBody>
  );
};
