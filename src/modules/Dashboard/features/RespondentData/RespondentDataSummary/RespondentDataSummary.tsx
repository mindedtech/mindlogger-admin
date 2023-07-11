import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useAsync, useBreadcrumbs } from 'shared/hooks';
import { Spinner, Svg } from 'shared/components';
import { useDecryptedIdentifiers } from 'modules/Dashboard/hooks';
import {
  StyledContainer,
  StyledFlexAllCenter,
  StyledTitleLarge,
  theme,
  variables,
} from 'shared/styles';
import {
  DatavizActivity,
  Version,
  getIdentifiersApi,
  getSummaryActivitiesApi,
  getVersionsApi,
} from 'api';

import { ReportMenu } from './ReportMenu';
import { Report } from './Report';
import { StyledReportContainer, StyledEmptyReview } from './RespondentDataSummary.styles';
import { Identifier } from './RespondentDataSummary.types';

export const RespondentDataSummary = () => {
  const { t } = useTranslation();
  const { appletId, respondentId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<DatavizActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<DatavizActivity>();
  const [versions, setVersions] = useState<Version[]>([]);
  const [identifiers, setIdentifiers] = useState<Identifier[]>([]);

  const getDecryptedIdentifiers = useDecryptedIdentifiers();

  const { execute: getSummaryActivities } = useAsync(getSummaryActivitiesApi);
  const { execute: getIdentifiers } = useAsync(getIdentifiersApi);
  const { execute: getVersions } = useAsync(getVersionsApi);

  useBreadcrumbs([
    {
      icon: 'chart',
      label: t('summary'),
    },
  ]);

  const reportContent = useMemo(() => {
    if (isLoading) return <Spinner />;
    if (!selectedActivity || selectedActivity.isPerformanceTask) {
      return (
        <StyledFlexAllCenter>
          <StyledEmptyReview>
            {!selectedActivity ? (
              <>
                <Svg id="data" width="60" height="73" />
                <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
                  {t('selectTheActivityToReview')}
                </StyledTitleLarge>
              </>
            ) : (
              <>
                <Svg id="confused" width="60" height="73" />
                <StyledTitleLarge sx={{ mt: theme.spacing(1.6) }} color={variables.palette.outline}>
                  {t('datavizNotSupportedForPerformanceTasks')}
                </StyledTitleLarge>
              </>
            )}
          </StyledEmptyReview>
        </StyledFlexAllCenter>
      );
    }

    return <Report activity={selectedActivity!} identifiers={identifiers} versions={versions} />;
  }, [selectedActivity, isLoading]);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!appletId || !respondentId) return;
      try {
        const result = await getSummaryActivities({
          appletId,
        });
        setActivities(result.data?.result);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, [appletId, respondentId]);

  useEffect(() => {
    if (!appletId || !respondentId || selectedActivity?.isPerformanceTask) return;

    const fetchFiltersData = async () => {
      if (!appletId || !selectedActivity) return;
      try {
        setIsLoading(true);
        const identifiers = await getIdentifiers({
          appletId,
          activityId: selectedActivity.id,
        });
        setIdentifiers(getDecryptedIdentifiers(identifiers.data.result));
        const versions = await getVersions({ appletId, activityId: selectedActivity.id });
        setVersions(versions.data.result);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFiltersData();
  }, [selectedActivity, appletId, respondentId]);

  return (
    <StyledContainer>
      {!!activities.length && (
        <>
          <ReportMenu
            activities={activities}
            selectedActivity={selectedActivity}
            setSelectedActivity={setSelectedActivity}
          />
          <StyledReportContainer>{reportContent}</StyledReportContainer>
        </>
      )}
    </StyledContainer>
  );
};
