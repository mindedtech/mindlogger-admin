import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { Svg } from 'shared/components';
import { StyledTitleMedium, theme } from 'shared/styles';
import { BuilderContainer } from 'shared/features';
import { useBreadcrumbs } from 'shared/hooks';
import { Item } from 'modules/Builder/components';
import { ActivityFlow as ActivityFlowType } from 'shared/state';

import { getActions } from './ActivityFlow.const';
import { StyledAdd, StyledAddWrapper } from './ActivityFlow.styles';
import { ActivityFlowHeader } from './ActivityFlowHeader';

export const ActivityFlow = () => {
  const { t } = useTranslation('app');
  const { watch } = useFormContext();

  const activityFlows: (Omit<ActivityFlowType, 'description'> & { description: string })[] =
    watch('activityFlows');

  useBreadcrumbs([
    {
      icon: <Svg id="flow" width="18" height="18" />,
      label: t('activityFlow'),
    },
  ]);

  return (
    <BuilderContainer title={t('activityFlow')} Header={ActivityFlowHeader}>
      {activityFlows?.length ? (
        <>
          {activityFlows.map((item, i) => (
            <Fragment key={item.id}>
              <Item getActions={getActions} {...item} />
              {i >= 0 && i < activityFlows.length - 1 && (
                <StyledAddWrapper>
                  <span />
                  <StyledAdd>
                    <Svg id="add" width={18} height={18} />
                  </StyledAdd>
                </StyledAddWrapper>
              )}
            </Fragment>
          ))}
        </>
      ) : (
        <StyledTitleMedium sx={{ marginTop: theme.spacing(0.4) }}>
          {t('activityFlowIsRequired')}
        </StyledTitleMedium>
      )}
    </BuilderContainer>
  );
};
