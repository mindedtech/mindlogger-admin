import { useState, DragEvent } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { TableCell, TableRow } from '@mui/material';

import { useAppletsDnd, useTimeAgo } from 'shared/hooks';
import { useAppDispatch } from 'redux/store';
import { folders, popups, workspaces } from 'redux/modules';
import { StyledBodyMedium } from 'shared/styles';
import { Pin, Actions, AppletImage } from 'shared/components';
import { AppletPasswordPopup, AppletPasswordPopupType } from 'modules/Dashboard/features/Applet';
import { page } from 'resources';
import { Encryption, getBuilderAppletUrl, getDateInUserTimezone } from 'shared/utils';

import { ShareAppletPopup } from '../../Popups';
import { StyledAppletName, StyledPinContainer } from './AppletItem.styles';
import { getActions, hasOwnerRole } from './AppletItem.utils';
import { AppletItemProps } from './AppletItem.types';

export const AppletItem = ({ item, onPublish }: AppletItemProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const timeAgo = useTimeAgo();
  const { ownerId } = workspaces.useData() || {};
  const workspaceRoles = workspaces.useRolesData();
  const { isDragOver, onDragLeave, onDragOver, onDrop, onDragEnd } = useAppletsDnd();
  const [sharePopupVisible, setSharePopupVisible] = useState(false);
  const [passwordPopupVisible, setPasswordPopupVisible] = useState(false);

  const APPLET_RESPONDENTS = generatePath(page.appletRespondents, {
    appletId: item.id,
  });
  const APPLET_SCHEDULE = generatePath(page.appletSchedule, {
    appletId: item.id,
  });

  const handleAppletClick = () => checkAppletEncryption(() => navigate(APPLET_RESPONDENTS));

  const onDragStart = (event: DragEvent<HTMLTableRowElement>) => {
    event.persist();
    event.dataTransfer.setData('text/plain', item.id);
  };

  const submitCallback = async (encryption: Encryption) => {
    // await dispatch(
    //   folders.thunk.setAppletEncryption({
    //     appletId: item.id,
    //     encryption,
    //   }),
    // );// TODO: postpone until folders api will be ready
    await dispatch(
      folders.thunk.setAppletEncryption({
        appletId: item.id,
        encryption,
      }),
    );

    setPasswordPopupVisible(false);
  };

  const checkAppletEncryption = (callback: () => void) =>
    hasOwnerRole(workspaceRoles?.data?.[item.id][0]) && !item.encryption
      ? setPasswordPopupVisible(true)
      : callback();

  const actions = {
    removeFromFolder: () =>
      dispatch(
        folders.thunk.removeAppletFromFolder({
          applet: item,
        }),
      ),
    viewUsers: () => checkAppletEncryption(() => navigate(APPLET_RESPONDENTS)),
    viewCalendar: () => checkAppletEncryption(() => navigate(APPLET_SCHEDULE)),
    deleteAction: () =>
      checkAppletEncryption(() =>
        dispatch(
          popups.actions.setPopupVisible({
            appletId: item.id,
            encryption: item.encryption,
            key: 'deletePopupVisible',
            value: true,
          }),
        ),
      ),
    duplicateAction: () =>
      checkAppletEncryption(() =>
        dispatch(
          popups.actions.setPopupVisible({
            appletId: item.id,
            encryption: item.encryption,
            key: 'duplicatePopupsVisible',
            value: true,
          }),
        ),
      ),
    transferOwnership: () =>
      checkAppletEncryption(() =>
        dispatch(
          popups.actions.setPopupVisible({
            appletId: item.id,
            encryption: item.encryption,
            key: 'transferOwnershipPopupVisible',
            value: true,
          }),
        ),
      ),
    shareAppletAction: () => checkAppletEncryption(() => setSharePopupVisible(true)),
    publishAppletAction: () => {
      if (item.isFolder) return;

      dispatch(
        popups.actions.setPopupVisible({
          appletId: item.id,
          key: 'publishConcealPopupVisible',
          value: true,
          popupProps: {
            onSuccess: onPublish,
          },
        }),
      );
    },
    editAction: () =>
      checkAppletEncryption(() => {
        if (item.isFolder) return; // TODO: add Edit Folder Page navigation

        navigate(getBuilderAppletUrl(item.id));
      }),
  };

  return (
    <>
      {item.isVisible && (
        <TableRow
          className={isDragOver ? 'dragged-over' : ''}
          draggable
          onDragStart={onDragStart}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDragEnd={(event) => onDragEnd(event, item)}
          onDrop={(event) => onDrop(event, item)}
        >
          <TableCell width="30%" onClick={handleAppletClick}>
            <StyledAppletName applet={item}>
              {item.parentId && (
                <StyledPinContainer>
                  <Pin
                    isPinned={!!item?.pinOrder}
                    onClick={(event) => {
                      ownerId && dispatch(folders.thunk.togglePin({ ownerId, applet: item }));
                      event.stopPropagation();
                    }}
                  />
                </StyledPinContainer>
              )}
              <AppletImage image={item.image} appletName={item.name} />
              <StyledBodyMedium>{item.displayName}</StyledBodyMedium>
            </StyledAppletName>
          </TableCell>
          <TableCell width="20%" onClick={handleAppletClick}>
            {item.updatedAt ? timeAgo.format(getDateInUserTimezone(item.updatedAt)) : ''}
          </TableCell>
          <TableCell>
            <Actions
              items={getActions({ actions, item, roles: workspaceRoles?.data?.[item.id] })}
              context={item}
            />
          </TableCell>
        </TableRow>
      )}
      {sharePopupVisible && (
        <ShareAppletPopup
          sharePopupVisible={sharePopupVisible}
          setSharePopupVisible={setSharePopupVisible}
          applet={item}
        />
      )}
      {passwordPopupVisible && (
        <AppletPasswordPopup
          appletId={item.id}
          popupVisible={passwordPopupVisible}
          onClose={() => setPasswordPopupVisible(false)}
          popupType={AppletPasswordPopupType.Create}
          submitCallback={submitCallback}
        />
      )}
    </>
  );
};
