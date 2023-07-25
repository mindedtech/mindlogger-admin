import axios from 'axios';

import { authApiClient } from 'shared/api/api.client';
import { AppletId } from 'shared/api';

import {
  SwitchAccount,
  TransferOwnershipType,
  SetAccount,
  AppletInvitationData,
  DuplicateApplet,
  FolderId,
  AppletEncryption,
  UpdatePin,
  UpdateFolder,
  TogglePin,
  UpdateAlertStatus,
  PublishApplet,
  PostAppletPublicLink,
  GetAppletsParams,
  CreateEventType,
  OwnerId,
  Answers,
  AppletUniqueName,
  GetAnswersNotesParams,
  NoteId,
  Note,
  AppletSubmitDateList,
  RespondentId,
  EventId,
  RemoveRespondentAccess,
  AppletDataRetention,
  ImportSchedule,
  GetWorkspaceAppletsParams,
  FolderName,
  ReportConfig,
  EditRespondent,
  AppletVersionChanges,
  RemoveAccess,
  ActivityAnswer,
  Response,
  Folder,
  Applet,
  EditManagerAccess,
  ExportData,
  SaveAssessment,
  DatavizActivity,
  Version,
  SummaryAnswers,
  DatavizAnswer,
  Identifier,
  ReviewActivity,
  Review,
  AssessmentReview,
  AppletName,
} from './api.types';

export const getUserDetailsApi = (signal?: AbortSignal) =>
  authApiClient.get('/users/me', { signal });

export const getWorkspaceAppletsApi = (
  { params }: GetWorkspaceAppletsParams,
  signal?: AbortSignal,
) => {
  const { ownerId, ...restParams } = params;

  return authApiClient.get<Response<Applet>>(`/workspaces/${ownerId}/applets`, {
    params: restParams,
    signal,
  });
};

export const getWorkspaceFolderAppletsApi = (
  { params }: GetWorkspaceAppletsParams,
  signal?: AbortSignal,
) => {
  const { ownerId, folderId } = params;

  return authApiClient.get<Response<Applet>>(`/workspaces/${ownerId}/folders/${folderId}/applets`, {
    signal,
  });
};

export const getFilteredWorkspaceAppletsApi = (
  { params }: GetWorkspaceAppletsParams,
  signal?: AbortSignal,
) => {
  const { ownerId, search, ...restParams } = params;

  return authApiClient.get<Response<Applet>>(`/workspaces/${ownerId}/applets/search/${search}`, {
    params: restParams,
    signal,
  });
};

export const getWorkspaceManagersApi = ({ params }: GetAppletsParams, signal?: AbortSignal) => {
  const { ownerId, appletId, ...restParams } = params;

  return authApiClient.get(
    `/workspaces/${ownerId}/${appletId ? `applets/${appletId}/` : ''}managers`,
    {
      params: restParams,
      signal,
    },
  );
};

export const getWorkspaceRespondentsApi = ({ params }: GetAppletsParams, signal?: AbortSignal) => {
  const { ownerId, appletId, ...restParams } = params;

  return authApiClient.get(
    `/workspaces/${ownerId}/${appletId ? `applets/${appletId}/` : ''}respondents`,
    {
      params: restParams,
      signal,
    },
  );
};

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

export const createIndividualEventsApi = (
  { appletId, respondentId }: AppletId & RespondentId,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/applets/${appletId}/events/individual/${respondentId}`,
    {},
    {
      signal,
    },
  );

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

export const removeManagerAccess = ({ userId, appletIds }: RemoveAccess, signal?: AbortSignal) =>
  authApiClient.post(
    '/workspaces/removeAccess',
    {
      userId,
      appletIds,
    },
    { signal },
  );

export const editManagerAccess = (
  { ownerId, userId, accesses }: EditManagerAccess,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/workspaces/${ownerId}/managers/${userId}/accesses`,
    {
      accesses,
    },
    { signal },
  );

export const removeRespondentAccessApi = (
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

export const editRespondentApi = (
  { ownerId, appletId, respondentId, values }: EditRespondent,
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

export const updateRespondentsPinApi = ({ ownerId, userId }: UpdatePin, signal?: AbortSignal) =>
  authApiClient.post(
    `/workspaces/${ownerId}/respondents/${userId}/pin`,
    {},
    {
      signal,
    },
  );

export const updateManagersPinApi = ({ ownerId, userId }: UpdatePin, signal?: AbortSignal) =>
  authApiClient.post(
    `/workspaces/${ownerId}/managers/${userId}/pin`,
    {},
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

export const setFolderApi = (
  { folderId, appletId }: Partial<FolderId> & AppletId,
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

export const getWorkspaceFoldersApi = ({ ownerId }: OwnerId, signal?: AbortSignal) =>
  authApiClient.get<Response<Folder>>(`/workspaces/${ownerId}/folders`, {
    signal,
  });

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
  { ownerId, appletId, folderId, isPinned }: TogglePin,
  signal?: AbortSignal,
) => {
  const method = isPinned ? 'post' : 'delete';

  return authApiClient[method](
    `/workspaces/${ownerId}/folders/${folderId}/pin/${appletId}`,
    {},
    { signal },
  );
};

export const updateAlertStatusApi = ({ alertId }: UpdateAlertStatus, signal?: AbortSignal) =>
  authApiClient.put(`account/updateAlertStatus/${alertId}`, {}, { signal });

export const checkAppletNameInLibraryApi = ({ appletName }: AppletName, signal?: AbortSignal) =>
  authApiClient.post('/library/check_name', { name: appletName }, { signal });

export const publishAppletToLibraryApi = (
  { appletId, keywords, appletName }: PublishApplet,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    '/library',
    {
      appletId,
      keywords,
      name: appletName,
    },
    { signal },
  );

export const getAppletSearchTermsApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applet/${appletId}/searchTerms`, {
    signal,
  });

export const getAppletLibraryUrlApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applets/${appletId}/library_link`, {
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

export const getReviewActivitiesApi = (
  { appletId, respondentId, createdDate }: Answers,
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<ReviewActivity>>(`/answers/applet/${appletId}/review/activities`, {
    params: {
      respondentId,
      createdDate,
    },
    signal,
  });

export const getAnswerApi = ({ appletId, answerId }: ActivityAnswer, signal?: AbortSignal) =>
  authApiClient.get(`/answers/applet/${appletId}/answers/${answerId}`, { signal });

export const getActivityAnswerApi = (
  { appletId, answerId, activityId }: ActivityAnswer,
  signal?: AbortSignal,
) =>
  authApiClient.get(`/answers/applet/${appletId}/answers/${answerId}/activities/${activityId}`, {
    signal,
  });

export const getAnswersNotesApi = (
  { appletId, answerId, activityId, params }: ActivityAnswer & GetAnswersNotesParams,
  signal?: AbortSignal,
) =>
  authApiClient.get(
    `/answers/applet/${appletId}/answers/${answerId}/activities/${activityId}/notes`,
    { params, signal },
  );

export const createAnswerNoteApi = (
  { appletId, answerId, activityId, note }: ActivityAnswer & Note,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/answers/applet/${appletId}/answers/${answerId}/activities/${activityId}/notes`,
    { note },
    {
      signal,
    },
  );

export const editAnswerNoteApi = (
  { appletId, answerId, noteId, activityId, note }: ActivityAnswer & NoteId & Note,
  signal?: AbortSignal,
) =>
  authApiClient.put(
    `/answers/applet/${appletId}/answers/${answerId}/activities/${activityId}/notes/${noteId}`,
    { note },
    {
      signal,
    },
  );

export const deleteAnswerNoteApi = (
  { appletId, answerId, activityId, noteId }: ActivityAnswer & NoteId,
  signal?: AbortSignal,
) =>
  authApiClient.delete(
    `/answers/applet/${appletId}/answers/${answerId}/activities/${activityId}/notes/${noteId}`,
    {
      signal,
    },
  );

export const getAppletSubmitDateListApi = (
  { appletId, ...params }: AppletSubmitDateList,
  signal?: AbortSignal,
) =>
  authApiClient.get(`/answers/applet/${appletId}/dates`, {
    params,
    signal,
  });

export const getAssessmentApi = ({ appletId, answerId }: AssessmentReview, signal?: AbortSignal) =>
  authApiClient.get(`/answers/applet/${appletId}/answers/${answerId}/assessment`, {
    signal,
  });

export const createAssessmentApi = (
  { appletId, answerId, ...assessment }: SaveAssessment,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/answers/applet/${appletId}/answers/${answerId}/assessment`,
    { ...assessment },
    {
      signal,
    },
  );

export const getReviewsApi = ({ appletId, answerId }: AssessmentReview, signal?: AbortSignal) =>
  authApiClient.get<Response<Review>>(`/answers/applet/${appletId}/answers/${answerId}/reviews`, {
    signal,
  });

export const getSummaryActivitiesApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get<Response<DatavizActivity>>(`/answers/applet/${appletId}/summary/activities`, {
    signal,
  });

export const getIdentifiersApi = (
  { appletId, activityId }: AppletId & { activityId: string },
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<Identifier>>(
    `/answers/applet/${appletId}/summary/activities/${activityId}/identifiers`,
    {
      signal,
    },
  );

export const getVersionsApi = (
  { appletId, activityId }: AppletId & { activityId: string },
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<Version>>(
    `/answers/applet/${appletId}/summary/activities/${activityId}/versions`,
    {
      signal,
    },
  );

export const getAnswersApi = (
  { appletId, activityId, params: { identifiers, versions, ...params } }: SummaryAnswers,
  signal?: AbortSignal,
) =>
  authApiClient.get<Response<DatavizAnswer>>(
    `/answers/applet/${appletId}/activities/${activityId}/answers`,
    {
      params: {
        ...params,
        identifiers: identifiers?.join(','),
        versions: versions?.join(','),
      },
      signal,
    },
  );

export const postAppletDataRetentionApi = (
  { appletId, ...dataRetentionParams }: AppletDataRetention,
  signal?: AbortSignal,
) =>
  authApiClient.post(
    `/applets/${appletId}/retentions`,
    { ...dataRetentionParams },
    {
      signal,
    },
  );

export const publishAppletApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.post(`/applets/${appletId}/publish`, { signal });

export const concealAppletApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.post(`/applets/${appletId}/conceal`, { signal });

export const postReportConfigApi = (
  { appletId, ...params }: AppletId & ReportConfig,
  signal?: AbortSignal,
) => authApiClient.post(`/applets/${appletId}/report_configuration`, { ...params }, { signal });

export const getAppletVersionsApi = ({ appletId }: AppletId, signal?: AbortSignal) =>
  authApiClient.get(`/applets/${appletId}/versions`, { signal });

export const getAppletVersionChangesApi = (
  { appletId, version }: AppletVersionChanges,
  signal?: AbortSignal,
) => authApiClient.get(`/applets/${appletId}/versions/${version}/changes`, { signal });

export const getExportDataApi = ({ appletId, respondentIds }: ExportData, signal?: AbortSignal) =>
  authApiClient.get(`/answers/applet/${appletId}/data`, {
    params: {
      respondentIds,
    },
    signal,
  });

export const getOptionTextApi = (url: string) =>
  axios({
    method: 'get',
    url,
  });
