import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { GetAppletSubmissionsResponse, getAppletSubmissionsApi } from 'api';
import { DashboardTable } from 'modules/Dashboard/components';
import { AddParticipantPopup } from 'modules/Dashboard/features/Applet/Popups';
import { QuickStats } from 'modules/Dashboard/features/Applet/Overview/QuickStats';
import { Spinner } from 'shared/components';
import { StyledFlexColumn, StyledTitleLarge } from 'shared/styles';
import { workspaces } from 'redux/modules';
import { useAsync, useEncryptionStorage, usePermissions } from 'shared/hooks';
import { DEFAULT_ROWS_PER_PAGE } from 'shared/consts';
import { checkIfCanAccessData } from 'shared/utils';

import { mapResponseToQuickStatProps, mapResponseToSubmissionsTableProps } from './Overview.utils';
import { StyledRoot } from './Overview.styles';
import { UnlockAppletPopup } from '../../Respondents/Popups/UnlockAppletPopup';

const limit = DEFAULT_ROWS_PER_PAGE;

export const Overview = () => {
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [unlockAppletPopupOpen, setUnlockAppletPopupOpen] = useState(false);
  const [unlockedPath, setUnlockedPath] = useState<string>();
  const { appletId } = useParams();
  const { data: workspaceRolesData } = workspaces.useRolesData();
  const { execute, isLoading, previousValue, value } = useAsync(getAppletSubmissionsApi);
  const navigate = useNavigate();
  const { t } = useTranslation('app');
  const { getAppletPrivateKey } = useEncryptionStorage();
  const { data } = value ?? previousValue ?? {};
  const roles = appletId ? workspaceRolesData?.[appletId] : undefined;
  const canAccessData = checkIfCanAccessData(roles);
  const { isForbidden, noPermissionsComponent } = usePermissions(() => {
    if (appletId && canAccessData) {
      return execute({ appletId, page, limit });
    }
  }, [page, limit, appletId]);
  const showContent = !isLoading || (isLoading && data);

  const handleViewSubmissionPopupOpen = useCallback(
    ({ path }: { path: string }) => {
      const hasEncryptionCheck = !!getAppletPrivateKey(appletId ?? '');

      if (!hasEncryptionCheck) {
        setUnlockAppletPopupOpen(true);
        setUnlockedPath(path);
      } else {
        navigate(path);
      }
    },
    [appletId, getAppletPrivateKey, navigate],
  );

  const handleAddPopupClose = (shouldRefetch = false) => {
    setAddPopupOpen(false);

    if (!!appletId && shouldRefetch) {
      execute({ appletId, limit });
    }
  };

  const dashboardTableProps = useMemo(
    () =>
      mapResponseToSubmissionsTableProps(data ?? ({} as GetAppletSubmissionsResponse), {
        onViewSubmission: handleViewSubmissionPopupOpen,
      }),
    [data, handleViewSubmissionPopupOpen],
  );

  if (isForbidden || !canAccessData) {
    return noPermissionsComponent;
  }

  return (
    <StyledRoot>
      {isLoading && <Spinner />}

      {showContent && (
        <>
          <QuickStats
            {...mapResponseToQuickStatProps(data, {
              onPressAddParticipant: () => {
                setAddPopupOpen(true);
              },
            })}
          />

          <StyledFlexColumn sx={{ gap: 1.6 }}>
            <StyledTitleLarge>{t('appletOverview.titleRecentSubmissions')}</StyledTitleLarge>

            <DashboardTable
              {...dashboardTableProps}
              handleChangePage={(_, nextPage) => {
                // DashboardTable passes it's `handleChangePage` prop a 0-based
                // index value, but accepts its `page` prop as 1-based.
                setPage(nextPage + 1);
              }}
              page={page}
              rowsPerPage={limit}
            />
          </StyledFlexColumn>

          {appletId && addPopupOpen && (
            <AddParticipantPopup
              appletId={appletId}
              popupVisible={addPopupOpen}
              onClose={handleAddPopupClose}
            />
          )}

          <UnlockAppletPopup
            appletId={appletId ?? ''}
            popupVisible={unlockAppletPopupOpen}
            setPopupVisible={(value) => {
              setUnlockAppletPopupOpen(value);

              if (!value) {
                setUnlockedPath(undefined);
              }
            }}
            onSubmitHandler={() => {
              if (unlockedPath) {
                navigate(unlockedPath);
              }
            }}
          />
        </>
      )}
    </StyledRoot>
  );
};
