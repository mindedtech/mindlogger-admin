import { authApiClient } from 'shared/api/api.client';
import { AppletId } from 'shared/api';

import {
  SwitchAccount,
  TransferOwnershipType,
  SetAccount,
  AppletInvitationData,
  DuplicateApplet,
  FolderId,
  AppletNameArgs,
  AppletEncryption,
  UpdatePin,
  UpdateFolder,
  TogglePin,
  UpdateAlertStatus,
  PublishApplet,
  UpdateAppletSearchTerms,
  PostAppletPublicLink,
  GetUsersData,
  GetAppletsParams,
  CreateEventType,
  OwnerId,
  Answers,
  Answer,
  AppletUniqueName,
  GetAnswersNotesParams,
  NoteId,
  Note,
  AppletSubmitDateList,
  RespondentId,
  EventId,
  RespondentAccesses,
  RemoveRespondentAccess,
  RemoveManagerAccess,
  ImportSchedule,
  GetWorkspaceAppletsParams,
  FolderName,
  EditRespondentAccess,
} from './api.types';

export const getUserDetailsApi = (signal?: AbortSignal) =>
  authApiClient.get('/users/me', { signal });

export const getWorkspaceAppletsApi = (
  { params }: GetWorkspaceAppletsParams,
  signal?: AbortSignal,
) => {
  const { ownerId, ...restParams } = params;

  return authApiClient.get(`/workspaces/${ownerId}/applets`, {
    params: restParams,
    signal,
  });
};

export const getWorkspaceManagersApi = ({ params }: GetAppletsParams, signal?: AbortSignal) => {
  const { ownerId, ...restParams } = params;

  return authApiClient.get(`/workspaces/${ownerId}/managers`, {
    params: restParams,
    signal,
  });
};

export const getWorkspaceRespondentsApi = ({ params }: GetAppletsParams, signal?: AbortSignal) => {
  const { ownerId, ...restParams } = params;

  return authApiClient.get(`/workspaces/${ownerId}/respondents`, {
    params: restParams,
    signal,
  });
};

export const getWorkspaceRespondentAccessesApi = (
  { ownerId, respondentId, ...params }: RespondentAccesses,
  signal?: AbortSignal,
) =>
  authApiClient.get(`/workspaces/${ownerId}/respondents/${respondentId}/accesses`, {
    params,
    signal,
  });

export const getWorkspaceInfoApi = ({ ownerId }: OwnerId, signal?: AbortSignal) =>
  authApiClient.get(`/workspaces/${ownerId}`, {
    signal,
  });

export const switchAccountApi = ({ accountId }: SwitchAccount, signal?: AbortSignal) =>
  authApiClient.put(
    '/user/switchAccount',
    {},
    {
      params: {
        accountId,
      },
      signal,
    },
  );

export const transferOwnershipApi = (
  { appletId, email }: TransferOwnershipType,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/applets/${appletId}/transferOwnership`,
    { email },
    {
      signal,
    },
  );

export const createEventApi = ({ appletId, body }: CreateEventType, signal?: AbortSignal) =>
  authApiClient.post(`/applets/${appletId}/events`, body, {
    signal,
  });

export const updateEventApi = (
  { appletId, body, eventId }: CreateEventType & EventId,
  signal?: AbortSignal,
) => authApiClient.put(`/applets/${appletId}/events/${eventId}`, body, { signal });

export const importScheduleApi = ({ appletId, body }: ImportSchedule, signal?: AbortSignal) =>
  authApiClient.post(`/applets/${appletId}/events/import`, body, {
    signal,
  });

export const getEventsApi = (
  { appletId, respondentId }: AppletId & Partial<RespondentId>,
  signal?: AbortSignal,
) =>
  authApiClient.get(`/applets/${appletId}/events`, {
    params: {
      respondentId,
    },
    signal,
  });

export const deleteScheduledEventsApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.delete(`/applets/${appletId}/events`, { signal });

export const deleteEventApi = ({ appletId, eventId }: AppletId & EventId, signal?: AbortSignal) =>
  authApiClient.delete(`/applets/${appletId}/events/${eventId}`, { signal });

export const deleteIndividualEventsApi = (
  { appletId, respondentId }: AppletId & RespondentId,
  signal?: AbortSignal,
) =>
  authApiClient.delete(`/applets/${appletId}/events/delete_individual/${respondentId}`, { signal });

export const removeIndividualEventsApi = (
  { appletId, respondentId }: AppletId & RespondentId,
  signal?: AbortSignal,
) =>
  authApiClient.delete(`/applets/${appletId}/events/remove_individual/${respondentId}`, { signal });

export const setAccountNameApi = ({ accountName }: SetAccount, signal?: AbortSignal) =>
  authApiClient.put(
    '/user/accountName',
    {},
    {
      params: {
        accountName,
      },
      signal,
    },
  );

export const removeManagerAccess = (
  { userId, appletIds, role }: RemoveManagerAccess,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    '/workspaces/removeAccess',
    {
      userId,
      appletIds,
      role,
    },
    { signal },
  );

export const removeRespondentAccess = (
  { userId, appletIds, deleteResponses }: RemoveRespondentAccess,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    '/applets/removeAccess',
    {
      userId,
      appletIds,
      deleteResponses,
    },
    { signal },
  );

export const editRespondentAccess = (
  { ownerId, appletId, respondentId, values }: EditRespondentAccess,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/workspaces/${ownerId}/applets/${appletId}/respondents/${respondentId}`,
    {
      ...values,
    },
    { signal },
  );

export const deleteAppletApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.delete(`/applets/${appletId}`, {
    signal,
  });

export const postAppletInvitationApi = (
  { url, appletId, options }: AppletInvitationData,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/invitations/${appletId}/${url}`,
    { ...options },
    {
      signal,
    },
  );

export const duplicateAppletApi = ({ appletId, options }: DuplicateApplet, signal?: AbortSignal) =>
  authApiClient.post(
    `/applets/${appletId}/duplicate`,
    { ...options },
    {
      signal,
    },
  );

export const getAppletUniqueNameApi = ({ name }: AppletUniqueName, signal?: AbortSignal) =>
  authApiClient.post(
    '/applets/unique_name',
    { name },
    {
      signal,
    },
  );

export const setAppletEncryptionApi = (
  { appletId, encryption }: AppletEncryption,
  signal?: AbortSignal,
) => authApiClient.post(`/applets/${appletId}/encryption`, { ...encryption }, { signal });

export const getInvitationsApi = ({ params }: GetAppletsParams, signal?: AbortSignal) => {
  const { ownerId, ...restParams } = params;

  return authApiClient.get('/invitations', {
    params: restParams,
    signal,
  });
};

export const updatePinApi = ({ ownerId, accessId }: UpdatePin, signal?: AbortSignal) =>
  authApiClient.post(
    `/workspaces/${ownerId}/respondents/pin`,
    { accessId },
    {
      signal,
    },
  );

export const getAppletsInFolderApi = ({ folderId }: FolderId, signal?: AbortSignal) =>
  authApiClient.get(`/folder/${folderId}/applets`, {
    signal,
  });

export const deleteFolderApi = ({ ownerId, folderId }: OwnerId & FolderId, signal?: AbortSignal) =>
  authApiClient.delete(`/workspaces/${ownerId}/folders/${folderId}`, {
    signal,
  });

export const addAppletToFolderApi = (
  { folderId, appletId }: FolderId & AppletId,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    '/applets/set_folder',
    {
      folderId,
      appletId,
    },
    { signal },
  );

export const removeAppletFromFolderApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.post(
    '/applets/set_folder',
    {
      folderId: null,
      appletId,
    },
    { signal },
  );

export const getFoldersApi = ({ ownerId }: OwnerId, signal?: AbortSignal) =>
  authApiClient.get(`/workspaces/${ownerId}/folders`, { signal });

export const saveFolderApi = ({ ownerId, name }: OwnerId & FolderName, signal?: AbortSignal) =>
  authApiClient.post(
    `/workspaces/${ownerId}/folders`,
    { name },
    {
      signal,
    },
  );

export const updateFolderApi = ({ ownerId, name, folderId }: UpdateFolder, signal?: AbortSignal) =>
  authApiClient.put(`/workspaces/${ownerId}/folders/${folderId}`, { name }, { signal });

export const togglePinApi = (
  { ownerId, applet: { parentId, id }, isPinned }: TogglePin,
  signal?: AbortSignal,
) => {
  const method = isPinned ? 'post' : 'delete';

  return authApiClient[method](
    `/workspaces/${ownerId}/folders/${parentId}/pin/${id}`,
    {},
    { signal },
  );
};

export const updateAlertStatusApi = ({ alertId }: UpdateAlertStatus, signal?: AbortSignal) =>
  authApiClient.put(`account/updateAlertStatus/${alertId}`, {}, { signal });

export const checkAppletNameInLibraryApi = (
  { appletId, appletName }: AppletNameArgs,
  signal?: AbortSignal,
) =>
  authApiClient.get(`/library/${appletId}/checkName`, {
    params: {
      name: appletName,
    },
    signal,
  });

export const publishAppletToLibraryApi = (
  { appletId, publish = true }: PublishApplet,
  signal?: AbortSignal,
) =>
  authApiClient.put(
    `/applet/${appletId}/status`,
    {},
    {
      params: {
        id: appletId,
        publish,
      },
      signal,
    },
  );

export const updateAppletSearchTermsApi = (
  { appletId, params }: UpdateAppletSearchTerms,
  signal?: AbortSignal,
) =>
  authApiClient.put(
    `/applet/${appletId}/searchTerms`,
    {},
    {
      params: {
        ...params,
        id: appletId,
      },
      signal,
    },
  );

export const getAppletSearchTermsApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applet/${appletId}/searchTerms`, {
    signal,
  });

export const getAppletLibraryUrlApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applet/${appletId}/libraryUrl`, {
    signal,
  });

export const postAppletPublicLinkApi = (
  { appletId, requireLogin }: PostAppletPublicLink,
  signal?: AbortSignal,
) => authApiClient.post(`/applets/${appletId}/access_link`, { requireLogin }, { signal });

export const getAppletPublicLinkApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applets/${appletId}/access_link`, { signal });

export const deleteAppletPublicLinkApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.delete(`/applets/${appletId}/access_link`, { signal });

export const getAppletInviteLinkApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applet/${appletId}/inviteLink`, { signal });

export const getUsersDataApi = (
  { appletId, users, pageIndex }: GetUsersData,
  signal?: AbortSignal,
) =>
  authApiClient.get(`/applet/${appletId}/data`, {
    params: {
      users: JSON.stringify(users),
      pagination: JSON.stringify({
        allow: true,
        pageIndex: pageIndex || 0,
      }),
    },
    signal,
  });

export const getAnswersApi = ({ id, respondentId, createdDate }: Answers, signal?: AbortSignal) =>
  authApiClient.get(`/answers/applet/${id}/activities`, {
    params: {
      respondentId,
      createdDate,
    },
    signal,
  });

export const getAnswerApi = ({ appletId, answerId }: Answer, signal?: AbortSignal) =>
  authApiClient.get(`/answers/applet/${appletId}/answers/${answerId}`, { signal });

export const getAnswersNotesApi = (
  { appletId, answerId, params }: Answer & GetAnswersNotesParams,
  signal?: AbortSignal,
) => authApiClient.get(`/answers/applet/${appletId}/answers/${answerId}/notes`, { params, signal });

export const createAnswerNoteApi = (
  { appletId, answerId, note }: Answer & Note,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/answers/applet/${appletId}/answers/${answerId}/notes`,
    { note },
    {
      signal,
    },
  );

export const editAnswerNoteApi = (
  { appletId, answerId, noteId, note }: Answer & NoteId & Note,
  signal?: AbortSignal,
) =>
  authApiClient.put(
    `/answers/applet/${appletId}/answers/${answerId}/notes/${noteId}`,
    { note },
    {
      signal,
    },
  );

export const deleteAnswerNoteApi = (
  { appletId, answerId, noteId }: Answer & NoteId,
  signal?: AbortSignal,
) =>
  authApiClient.delete(`/answers/applet/${appletId}/answers/${answerId}/notes/${noteId}`, {
    signal,
  });

export const getAppletSubmitDateListApi = (
  { appletId, ...params }: AppletSubmitDateList,
  signal?: AbortSignal,
) =>
  authApiClient.get(`/answers/applet/${appletId}/dates`, {
    params,
    signal,
  });

export const publishAppletApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.post(`/applets/${appletId}/publish`, { signal });

export const concealAppletApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.post(`/applets/${appletId}/conceal`, { signal });
