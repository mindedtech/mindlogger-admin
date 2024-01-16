import { Dispatch, SetStateAction } from 'react';
import { t } from 'i18next';

import { Svg } from 'shared/components/Svg';
import {
  StyledSmallAppletImg,
  StyledSmallAppletImgPlaceholder,
  StyledBodyMedium,
  StyledLabelLarge,
  StyledFlexTopCenter,
} from 'shared/styles';
import { RespondentDetail } from 'modules/Dashboard/types';
import { HeadCell } from 'shared/types';
import i18n from 'i18n';

import { ChosenAppletData, GetMenuItems } from './Respondents.types';
import { RespondentsColumnsWidth } from './Respondents.const';

export const getRespondentActions = ({
  actions: {
    scheduleSetupAction,
    viewDataAction,
    removeAccessAction,
    userDataExportAction,
    editRespondent,
  },
  filteredApplets,
  isAnonymousRespondent,
  respondentId,
  appletId,
}: GetMenuItems) => [
  {
    icon: <Svg id="user-calendar" width={20} height={21} />,
    action: scheduleSetupAction,
    title: t('viewCalendar'),
    context: respondentId,
    isDisplayed: !isAnonymousRespondent && !!filteredApplets?.scheduling.length,
    'data-testid': 'dashboard-respondents-view-calendar',
  },
  {
    icon: <Svg id="data" width={22} height={22} />,
    action: viewDataAction,
    title: t('viewData'),
    context: respondentId,
    isDisplayed: !!filteredApplets?.viewable.length,
    'data-testid': 'dashboard-respondents-view-data',
  },
  {
    icon: <Svg id="export" width={18} height={20} />,
    action: userDataExportAction,
    title: t('exportData'),
    context: respondentId,
    isDisplayed: !!filteredApplets?.viewable.length,
    'data-testid': 'dashboard-respondents-export-data',
  },
  {
    icon: <Svg id="edit-user" width={21} height={19} />,
    action: editRespondent,
    title: t('editRespondent'),
    context: respondentId,
    isDisplayed: !!appletId && !!filteredApplets?.editable.length,
    'data-testid': 'dashboard-respondents-edit',
  },
  {
    icon: <Svg id="remove-access" />,
    action: removeAccessAction,
    title: t('removeAccess'),
    context: respondentId,
    isDisplayed: !!filteredApplets?.editable.length,
    'data-testid': 'dashboard-respondents-remove-access',
  },
];

export const getAppletsSmallTableRows = (
  respondentAccesses: RespondentDetail[],
  setChosenAppletData: Dispatch<SetStateAction<ChosenAppletData | null>>,
  respondentId: string,
  ownerId: string,
) =>
  respondentAccesses?.map((respondentAccess) => {
    const choseAppletHandler = () =>
      setChosenAppletData({ ...respondentAccess, ownerId, respondentId });
    const { appletDisplayName, appletImage, respondentSecretId, respondentNickname } =
      respondentAccess;

    return {
      appletName: {
        content: () => (
          <StyledFlexTopCenter>
            {appletImage ? (
              <StyledSmallAppletImg src={appletImage} alt="Applet image" />
            ) : (
              <StyledSmallAppletImgPlaceholder />
            )}
            <StyledLabelLarge>{appletDisplayName}</StyledLabelLarge>
          </StyledFlexTopCenter>
        ),
        value: appletDisplayName,
        onClick: choseAppletHandler,
      },
      secretUserId: {
        content: () => <StyledLabelLarge>{respondentSecretId}</StyledLabelLarge>,
        value: respondentSecretId,
        onClick: choseAppletHandler,
      },
      nickname: {
        content: () => <StyledBodyMedium>{respondentNickname}</StyledBodyMedium>,
        value: respondentNickname,
        onClick: choseAppletHandler,
      },
    };
  });

export const getHeadCells = (id?: string): HeadCell[] => {
  const { t } = i18n;

  return [
    {
      id: 'pin',
      label: '',
      enableSort: true,
      width: RespondentsColumnsWidth.Pin,
    },
    {
      id: 'secretIds',
      label: t('secretUserId'),
      enableSort: true,
      width: RespondentsColumnsWidth.Default,
    },
    {
      id: 'nicknames',
      label: t('nickname'),
      enableSort: true,
      width: RespondentsColumnsWidth.Default,
    },
    {
      id: 'lastSeen',
      label: t('latestActive'),
      enableSort: true,
      width: RespondentsColumnsWidth.Default,
    },
    ...(id
      ? [
          {
            id: 'schedule',
            label: t('schedule'),
            width: RespondentsColumnsWidth.Default,
          },
        ]
      : []),
    {
      id: 'actions',
      label: t('actions'),
    },
  ];
};
