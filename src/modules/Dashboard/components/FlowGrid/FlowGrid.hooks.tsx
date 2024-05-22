import { useCallback } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useTakeNowModal } from 'modules/Dashboard/components/TakeNowModal/TakeNowModal';
import { Activity, ActivityFlow, workspaces } from 'redux/modules';
import { page } from 'resources';
import { MenuActionProps, MenuItemType, Svg } from 'shared/components';
import { Roles } from 'shared/consts';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';
import { isManagerOrOwner } from 'shared/utils';
import { RespondentDetails } from 'modules/Dashboard/types';

type FlowsMenuActionParams = MenuActionProps<{ appletId?: string; flowId?: string }>;

export function useFlowGridMenu({
  appletId,
  hasParticipants = false,
  testId = '',
  subject,
}: {
  appletId?: string;
  hasParticipants?: boolean;
  testId?: string;
  subject?: RespondentDetails;
}) {
  const { t } = useTranslation('app');
  const { TakeNowModal, openTakeNowModal } = useTakeNowModal({ dataTestId: testId });
  const { featureFlags } = useFeatureFlags();
  const navigate = useNavigate();
  const workspaceRoles = workspaces.useRolesData();
  const roles = appletId ? workspaceRoles?.data?.[appletId] : undefined;

  const canEdit =
    isManagerOrOwner(roles?.[0]) ||
    roles?.includes(Roles.Editor) ||
    roles?.includes(Roles.SuperAdmin);

  const canDoTakeNow =
    featureFlags.enableMultiInformantTakeNow &&
    hasParticipants &&
    (isManagerOrOwner(roles?.[0]) ||
      roles?.includes(Roles.Coordinator) ||
      roles?.includes(Roles.SuperAdmin));

  const getActionsMenu = useCallback(
    ({ flow }: { flow?: ActivityFlow }) => [
      {
        'data-testid': `${testId}-flow-edit`,
        action: ({ context }: FlowsMenuActionParams) => {
          if (context?.appletId && context?.flowId) {
            navigate(
              generatePath(page.builderAppletActivityFlowItemAbout, {
                appletId: context.appletId,
                activityFlowId: context.flowId,
              }),
            );
          }
        },
        context: { appletId, flowId: flow?.id },
        icon: <Svg id="edit" />,
        isDisplayed: canEdit,
        title: t('editFlow'),
      },
      {
        'data-testid': `${testId}-flow-export`,
        disabled: true,
        icon: <Svg id="export" />,
        title: t('exportData'),
      },
      { type: MenuItemType.Divider },
      {
        'data-testid': `${testId}-flow-assign`,
        icon: <Svg id="add" />,
        title: t('assignActivity'),
        isDisplayed: featureFlags.enableActivityAssign,
      },
      {
        'data-testid': `${testId}-flow-take-now`,
        action: () => {
          if (flow) {
            const options = subject
              ? { subject: { ...subject, secretId: subject.secretUserId } }
              : undefined;
            // TODO: Fix this type :(
            openTakeNowModal(flow as unknown as Partial<Activity>, options);
          }
        },
        context: { appletId, flowId: flow?.id },
        icon: <Svg id="play-outline" />,
        isDisplayed: canDoTakeNow,
        title: t('takeNow'),
      },
    ],
    [appletId, canDoTakeNow, canEdit, navigate, openTakeNowModal, t, testId],
  );

  return {
    getActionsMenu,
    TakeNowModal,
  };
}
