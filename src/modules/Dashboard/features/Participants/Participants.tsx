import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { EmptyDashboardTable } from 'modules/Dashboard/components/EmptyDashboardTable';
import { ActionsMenu, Chip, MenuActionProps, Pin, Row, Search, Spinner } from 'shared/components';
import { workspaces } from 'redux/modules';
import { useAsync, usePermissions, useTable, useTimeAgo } from 'shared/hooks';
import {
  GetAppletsParams,
  getWorkspaceRespondentsApi,
  updateRespondentsPinApi,
  updateSubjectsPinApi,
} from 'api';
import { page } from 'resources';
import {
  checkIfCanManageParticipants,
  checkIfCanViewParticipants,
  getDateInUserTimezone,
  isManagerOrOwner,
  joinWihComma,
  Mixpanel,
  MixpanelProps,
} from 'shared/utils';
import { DEFAULT_ROWS_PER_PAGE, Roles } from 'shared/consts';
import { StyledBody, StyledFlexWrap } from 'shared/styles';
import { Respondent, RespondentStatus } from 'modules/Dashboard/types';
import { StyledMaybeEmpty } from 'shared/styles/styledComponents/MaybeEmpty';
import { AddParticipantPopup, UpgradeAccountPopup } from 'modules/Dashboard/features/Applet/Popups';
import { ParticipantSnippetInfo, ParticipantTagChip } from 'modules/Dashboard/components';
import { useFeatureFlags } from 'shared/hooks/useFeatureFlags';

import { AddParticipantButton, ParticipantsTable } from './Participants.styles';
import {
  getAppletsSmallTableRows,
  getHeadCells,
  getParticipantActions,
} from './Participants.utils';
import { ParticipantsColumnsWidth } from './Participants.const';
import {
  ChosenAppletData,
  FilteredApplets,
  FilteredAppletsKey,
  FilteredParticipants,
  HandleUpgradeAccount,
  HandlePinClick,
  ParticipantsData,
  ParticipantActionProps,
  SetDataForAppletPage,
  ParticipantActions,
} from './Participants.types';
// Let's fall back to the respondent pop-ups for now
import { DataExportPopup, EditRespondentPopup, RemoveRespondentPopup } from '../Respondents/Popups';

export const Participants = () => {
  const { appletId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const showAddParticipant = !!searchParams.get('showAddParticipant');
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const timeAgo = useTimeAgo();
  const { featureFlags } = useFeatureFlags();

  const [respondentsData, setRespondentsData] = useState<ParticipantsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const rolesData = workspaces.useRolesData();
  const roles = appletId ? rolesData?.data?.[appletId] : undefined;
  const { ownerId } = workspaces.useData() || {};
  const canViewParticipants = checkIfCanViewParticipants(roles);

  const handleToggleAddParticipant = () => {
    setSearchParams(
      (params) => {
        if (showAddParticipant) {
          params.delete('showAddParticipant');

          return params;
        }

        Mixpanel.track('Add Participant button clicked', {
          [MixpanelProps.AppletId]: appletId,
          [MixpanelProps.Via]: 'Applet - Participants',
        });

        return { ...params, showAddParticipant: true };
      },
      { replace: true },
    );
  };

  const { execute } = useAsync(
    getWorkspaceRespondentsApi,
    (response) => {
      setRespondentsData(response?.data || null);
    },
    undefined,
    () => setIsLoading(false),
  );

  const getWorkspaceRespondents = (args?: GetAppletsParams) => {
    setIsLoading(true);

    // Always sort by pinned first
    const ordering = ['-isPinned'];
    ordering.push(args?.params.ordering ?? '+tags,+secretIds');

    return execute({
      ...args,
      params: {
        ownerId,
        limit: DEFAULT_ROWS_PER_PAGE,
        ...(appletId && { appletId }),
        ...args?.params,
        ordering: ordering.join(','),
      },
    });
  };

  const { isForbidden, noPermissionsComponent } = usePermissions(() => {
    if (!canViewParticipants) return;

    return getWorkspaceRespondents();
  });

  const { searchValue, handleSearch, handleReload, ...tableProps } = useTable(
    getWorkspaceRespondents,
    DEFAULT_ROWS_PER_PAGE,
    'tags',
    'asc',
  );

  const [dataExportPopupVisible, setDataExportPopupVisible] = useState(false);
  const [removeAccessPopupVisible, setRemoveAccessPopupVisible] = useState(false);
  const [editRespondentPopupVisible, setEditRespondentPopupVisible] = useState(false);
  const [respondentKey, setRespondentKey] = useState<null | string>(null);
  const [chosenAppletData, setChosenAppletData] = useState<null | ChosenAppletData>(null);
  const [upgradeAccountPopupVisible, setInvitationPopupVisible] = useState(false);
  const [participantDetails, setParticipantDetails] = useState<null | ParticipantSnippetInfo>(null);

  const getChosenAppletData = ({
    respondentId = null,
    respondentOrSubjectId,
    key,
  }: SetDataForAppletPage) => {
    if (!ownerId) return;
    const respondentAccess = filteredRespondents[respondentOrSubjectId]?.[key]?.[0];

    return (
      respondentAccess && {
        ...respondentAccess,
        respondentId,
        ownerId,
      }
    );
  };

  const handleSetDataForAppletPage = ({
    respondentId = null,
    respondentOrSubjectId,
    key,
  }: SetDataForAppletPage) => {
    if (!appletId) return;

    const chosenAppletData = getChosenAppletData({ respondentId, respondentOrSubjectId, key });
    setChosenAppletData(chosenAppletData ?? null);
  };

  const handleUpgradeAccount = ({
    respondentOrSubjectId,
    secretId,
    nickname,
    tag,
  }: HandleUpgradeAccount) => {
    Mixpanel.track('Upgrade to Full Account clicked', {
      [MixpanelProps.AppletId]: appletId,
      [MixpanelProps.Via]: 'Applet - Participants',
    });

    setRespondentKey(respondentOrSubjectId);
    setParticipantDetails({ secretId, nickname, tag });
    handleSetDataForAppletPage({
      respondentOrSubjectId,
      key: FilteredAppletsKey.Editable,
    });
    setInvitationPopupVisible(true);
  };

  const actions: ParticipantActions = {
    editParticipant: ({ context }: MenuActionProps<ParticipantActionProps>) => {
      const { respondentId, respondentOrSubjectId } = context || {};
      if (!respondentOrSubjectId) return;

      const event = respondentId ? 'Edit Full Account clicked' : 'Edit Limited Account clicked';
      Mixpanel.track(event, {
        [MixpanelProps.AppletId]: appletId,
        [MixpanelProps.Via]: 'Applet - Participants',
      });

      setRespondentKey(respondentOrSubjectId);
      handleSetDataForAppletPage({ respondentOrSubjectId, key: FilteredAppletsKey.Editable });
      setEditRespondentPopupVisible(true);
    },
    upgradeAccount: ({ context }: MenuActionProps<ParticipantActionProps>) => {
      const { respondentOrSubjectId, secretId, nickname, tag } = context || {};
      if (!respondentOrSubjectId || !secretId) return;

      handleUpgradeAccount({ respondentOrSubjectId, secretId, nickname, tag });
    },
    exportData: ({ context }: MenuActionProps<ParticipantActionProps>) => {
      const { respondentOrSubjectId } = context || {};
      if (!respondentOrSubjectId) return;

      setRespondentKey(respondentOrSubjectId);
      handleSetDataForAppletPage({ respondentOrSubjectId, key: FilteredAppletsKey.Viewable });
      setDataExportPopupVisible(true);
      Mixpanel.track('Export Data click');
    },
    removeParticipant: ({ context }: MenuActionProps<ParticipantActionProps>) => {
      const { respondentOrSubjectId } = context || {};
      if (!respondentOrSubjectId) return;

      setRespondentKey(respondentOrSubjectId);
      handleSetDataForAppletPage({
        respondentOrSubjectId,
        key: FilteredAppletsKey.Editable,
      });
      setRemoveAccessPopupVisible(true);
    },
    assignActivity: ({ context: _context }: MenuActionProps<ParticipantActionProps>) => {
      alert('TODO: Assign activity');
    },
    copyEmailAddress: ({ context }: MenuActionProps<ParticipantActionProps>) => {
      const { email, invitation } = context || {};
      if (!email || !invitation?.email) return;

      navigator.clipboard.writeText(email || invitation.email);
    },
    copyInvitationLink: ({ context }: MenuActionProps<ParticipantActionProps>) => {
      const { invitation } = context || {};
      if (!invitation?.key) return;

      const url = new URL(`invitation/${invitation.key}`, `${process.env.REACT_APP_WEB_URI}/`);
      navigator.clipboard.writeText(url.toString());
    },
  };

  const { execute: updateRespondentsPin } = useAsync(updateRespondentsPinApi, handleReload);

  const { execute: updateSubjectsPin } = useAsync(updateSubjectsPinApi, handleReload);

  const handlePinClick = ({ respondentId, subjectId }: HandlePinClick) => {
    setIsLoading(true);
    if (respondentId) {
      updateRespondentsPin({ ownerId, userId: respondentId });

      return;
    }

    updateSubjectsPin({ ownerId, userId: subjectId });
  };

  const addParticipantOnClose = (shouldRefetch: boolean) => {
    handleToggleAddParticipant();
    setChosenAppletData(null);
    shouldRefetch && handleReload();
  };

  const editRespondentOnClose = (shouldRefetch: boolean) => {
    setEditRespondentPopupVisible(false);
    setChosenAppletData(null);
    shouldRefetch && handleReload();
  };

  const removeRespondentAccessOnClose = (shouldRefetch?: boolean) => {
    setRemoveAccessPopupVisible(false);
    setChosenAppletData(null);
    shouldRefetch && handleReload();
  };

  const handleUpgradeAccountPopupClose = (shouldRefetch?: boolean) => {
    setInvitationPopupVisible(false);
    setParticipantDetails(null);
    shouldRefetch && handleReload();
  };

  const formatRow = (user: Respondent): Row => {
    const {
      secretIds,
      nicknames,
      lastSeen,
      id: respondentId,
      details,
      isPinned,
      status,
      email,
    } = user;

    const detail = details.find((detail) => detail.appletId === appletId) ?? details[0];
    const latestActive = lastSeen ? timeAgo.format(getDateInUserTimezone(lastSeen)) : '';
    const schedule = appletId && detail.hasIndividualSchedule ? t('individual') : t('default');
    const nickname = joinWihComma(nicknames, true);
    const secretId = joinWihComma(secretIds, true);
    const tag = detail.subjectTag;
    const respondentOrSubjectId = respondentId ?? detail.subjectId;
    const accountType = {
      [RespondentStatus.Invited]: t('full'),
      [RespondentStatus.NotInvited]: t('limited'),
      [RespondentStatus.Pending]: t('pendingInvite'),
    }[status];
    const isPending = status === RespondentStatus.Pending;

    const defaultOnClick = () => {
      navigate(
        generatePath(page.appletParticipantActivities, {
          appletId,
          subjectId: detail.subjectId,
        }),
      );
    };

    return {
      id: {
        value: respondentOrSubjectId,
        isHidden: true,
      },
      pin: {
        content: () => <Pin isPinned={isPinned} data-testid="dashboard-participants-pin" />,
        value: '',
        onClick: () => handlePinClick({ respondentId, subjectId: detail.subjectId }),
        width: ParticipantsColumnsWidth.Pin,
      },
      tags: {
        content: () => (
          <StyledMaybeEmpty>
            <ParticipantTagChip tag={tag} />
          </StyledMaybeEmpty>
        ),
        value: '',
        width: ParticipantsColumnsWidth.Default,
        onClick: defaultOnClick,
      },
      secretIds: {
        content: () => secretId,
        value: secretId,
        onClick: defaultOnClick,
        maxWidth: ParticipantsColumnsWidth.Id,
      },
      nicknames: {
        content: () => nickname,
        value: nickname,
        onClick: defaultOnClick,
      },
      accountType: {
        content: () => <Chip color={isPending ? 'warning' : 'secondary'} title={accountType} />,
        value: accountType,
        onClick: defaultOnClick,
      },
      lastSeen: {
        content: () => <StyledMaybeEmpty>{latestActive}</StyledMaybeEmpty>,
        value: latestActive,
        onClick: defaultOnClick,
      },
      ...(appletId && {
        schedule: {
          content: () => schedule,
          value: schedule,
          onClick: defaultOnClick,
        },
      }),
      actions: {
        content: () => (
          <ActionsMenu
            buttonColor="secondary"
            menuItems={getParticipantActions({
              actions,
              filteredApplets: filteredRespondents?.[respondentOrSubjectId],
              respondentId,
              respondentOrSubjectId,
              appletId,
              email,
              secretId,
              nickname,
              tag,
              status,
              dataTestid,
              showAssignActivity: featureFlags.enableActivityAssign,
              roles,
              invitation: detail.invitation,
              firstName: detail.subjectFirstName,
              lastName: detail.subjectLastName,
              subjectCreatedAt: detail.subjectCreatedAt,
            })}
            data-testid={`${dataTestid}-table-actions`}
          />
        ),
        value: '',
        width: ParticipantsColumnsWidth.Pin,
      },
    };
  };

  const filterRespondentApplets = (user: Respondent) => {
    const { details } = user;
    const filteredApplets: FilteredApplets = {
      scheduling: [],
      editable: [],
      viewable: [],
    };
    const { editable, viewable, scheduling } = filteredApplets;

    for (const detail of details) {
      const appletRoles = rolesData?.data?.[detail.appletId];
      if (isManagerOrOwner(appletRoles?.[0])) {
        editable.push(detail);
        viewable.push(detail);
        scheduling.push(detail);
        continue;
      }
      if (appletRoles?.includes(Roles.Reviewer)) {
        viewable.push(detail);
      }
      if (appletRoles?.includes(Roles.Coordinator)) {
        scheduling.push(detail);
        editable.push(detail);
      }
    }

    return filteredApplets;
  };

  const { rows, filteredRespondents }: { filteredRespondents: FilteredParticipants; rows?: Row[] } =
    useMemo(
      () =>
        respondentsData?.result?.reduce(
          (acc: { filteredRespondents: FilteredParticipants; rows: Row[] }, user) => {
            const detail =
              user.details.find((detail) => detail.appletId === appletId) ?? user.details[0];
            const respondentOrSubjectId = user.id ?? detail.subjectId;
            acc.filteredRespondents[respondentOrSubjectId] = filterRespondentApplets(user);
            acc.rows.push(formatRow(user));

            return acc;
          },
          { rows: [], filteredRespondents: {} },
        ) || { rows: undefined, filteredRespondents: {} },
      [respondentsData, t],
    );

  const chosenRespondentsItems = respondentKey ? filteredRespondents[respondentKey] : undefined;

  const getAppletsSmallTable = (key: FilteredAppletsKey) =>
    chosenRespondentsItems?.[key] && ownerId && respondentKey
      ? getAppletsSmallTableRows(
          chosenRespondentsItems[key],
          setChosenAppletData,
          respondentKey,
          ownerId,
        )
      : undefined;

  const viewableAppletsSmallTableRows = getAppletsSmallTable(FilteredAppletsKey.Viewable);
  const editableAppletsSmallTableRows = getAppletsSmallTable(FilteredAppletsKey.Editable);
  const dataTestid = 'dashboard-participants';
  const canAddParticipant = appletId && checkIfCanManageParticipants(roles);

  if (isForbidden || !canViewParticipants) return noPermissionsComponent;

  return (
    <StyledBody sx={{ p: 3.2 }}>
      {isLoading && <Spinner />}

      <StyledFlexWrap sx={{ gap: 1.2, mb: 2.4 }}>
        <StyledFlexWrap sx={{ gap: 1.2, ml: 'auto' }}>
          <Search
            withDebounce
            placeholder={t('searchParticipants')}
            onSearch={handleSearch}
            sx={{ width: '32rem' }}
            data-testid={`${dataTestid}-search`}
          />
          {canAddParticipant && (
            <AddParticipantButton
              variant="contained"
              onClick={handleToggleAddParticipant}
              data-testid={`${dataTestid}-add`}
            >
              {t('addParticipant')}
            </AddParticipantButton>
          )}
        </StyledFlexWrap>
      </StyledFlexWrap>

      <ParticipantsTable
        columns={getHeadCells(respondentsData?.orderingFields, appletId)}
        rows={rows}
        keyExtractor={({ id }) => `row-${id.value}`}
        emptyComponent={
          !rows?.length && !isLoading ? (
            <EmptyDashboardTable searchValue={searchValue}>
              {t('noParticipantsForApplet')}
              {canAddParticipant && (
                <AddParticipantButton onClick={handleToggleAddParticipant} variant="contained">
                  {t('addParticipant')}
                </AddParticipantButton>
              )}
            </EmptyDashboardTable>
          ) : undefined
        }
        count={respondentsData?.count || 0}
        data-testid={`${dataTestid}-table`}
        {...tableProps}
      />
      {appletId && showAddParticipant && (
        <AddParticipantPopup
          popupVisible={showAddParticipant}
          appletId={appletId}
          onClose={addParticipantOnClose}
        />
      )}
      {removeAccessPopupVisible && (
        <RemoveRespondentPopup
          popupVisible={removeAccessPopupVisible}
          onClose={removeRespondentAccessOnClose}
          chosenAppletData={chosenAppletData}
          tableRows={editableAppletsSmallTableRows}
        />
      )}
      {dataExportPopupVisible && (
        <DataExportPopup
          popupVisible={dataExportPopupVisible}
          setPopupVisible={setDataExportPopupVisible}
          tableRows={viewableAppletsSmallTableRows}
          chosenAppletData={chosenAppletData}
          setChosenAppletData={setChosenAppletData}
          data-testid={`${dataTestid}-export-data-popup`}
        />
      )}
      {editRespondentPopupVisible && (
        <EditRespondentPopup
          popupVisible={editRespondentPopupVisible}
          onClose={editRespondentOnClose}
          chosenAppletData={chosenAppletData}
        />
      )}
      {upgradeAccountPopupVisible && appletId && chosenAppletData && (
        <UpgradeAccountPopup
          popupVisible={upgradeAccountPopupVisible}
          onClose={handleUpgradeAccountPopupClose}
          appletId={appletId}
          subjectId={chosenAppletData.subjectId}
          secretId={participantDetails?.secretId}
          nickname={participantDetails?.nickname}
          tag={participantDetails?.tag}
        />
      )}
    </StyledBody>
  );
};
