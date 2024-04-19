import { AppletId } from 'shared/api';
import { Item, SingleApplet } from 'shared/state';
import { Roles } from 'shared/consts';
import { RetentionPeriods, EncryptedAnswerSharedProps } from 'shared/types';
import { Encryption } from 'shared/utils';

export type GetAppletsParams = {
  params: {
    ownerId?: string;
    search?: string;
    page?: number;
    limit?: number;
    ordering?: string;
    roles?: string;
    appletId?: string;
    shell?: boolean;
  };
};

export type RespondentId = { respondentId: string };

export type TargetSubjectId = { targetSubjectId: string };

export type SubjectId = { subjectId: string };

export type FolderId = { folderId: string };

export type Event = {
  data: {
    URI: string;
    activity_id: string;
    availability: boolean;
    busy: boolean;
    calendar: string;
    color: string;
    completion: boolean;
    description: string;
    eventType: string;
    extendedTime: {
      allow: boolean;
      minute: number;
    };
    forecolor: string;
    icon: string;
    idleTime: {
      allow: boolean;
      minute: number;
    };
    isActivityFlow: boolean;
    location: string;
    notifications: {
      allow: boolean;
      end: string;
      random: boolean;
      start: string;
    }[];
    onlyScheduledDay: boolean;
    reminder: {
      days: number;
      time: string;
      valid: boolean;
    };
    timedActivity: {
      allow: boolean;
      hour: number;
      minute: number;
      second: number;
    };
    timeout: {
      access: boolean;
      allow: boolean;
      day: number;
      hour: number;
      minute: number;
    };
    title: string;
    useNotifications: boolean;
    users: string[];
  };
  schedule: {
    dayOfMonth: string[];
    month: string[];
    year: string[];
  };
};

export type TransferOwnershipType = AppletId & { email: string };

export enum TimerType {
  NotSet = 'NOT_SET',
  Timer = 'TIMER',
  Idle = 'IDLE',
}

export enum Periodicity {
  Once = 'ONCE',
  Daily = 'DAILY',
  Weekly = 'WEEKLY',
  Weekdays = 'WEEKDAYS',
  Monthly = 'MONTHLY',
  Always = 'ALWAYS',
}

export enum NotificationType {
  Fixed = 'FIXED',
  Random = 'RANDOM',
}

export const enum DashboardAppletType {
  Applet = 'applet',
  Folder = 'folder',
}

export type EventNotifications =
  | {
      atTime?: string | null;
      fromTime?: string | null;
      toTime?: string | null;
      triggerType: NotificationType;
    }[]
  | null;

export type EventReminder = { activityIncomplete: number; reminderTime: string | null };

type CreateEvent = {
  startTime?: string;
  endTime?: string;
  accessBeforeSchedule?: boolean;
  oneTimeCompletion?: boolean;
  timer?: string;
  timerType?: TimerType;
  periodicity?: {
    type: Periodicity;
    startDate?: string;
    endDate?: string;
    selectedDate?: string;
  };
  respondentId?: string;
  activityId?: string;
  flowId?: string;
  notification: {
    notifications: EventNotifications;
    reminder: EventReminder | null;
  } | null;
};

export type CreateEventType = AppletId & {
  body: CreateEvent;
};

export type ImportSchedule = AppletId & {
  body: CreateEvent[];
};

export type RemoveAccess = {
  userId: string;
  appletIds: string[];
};

export type EditManagerAccess = {
  userId: string;
  ownerId: string;
  accesses: { appletId: string; roles: Roles[]; subjects: string[] }[];
};

export type EditSubject = SubjectId & {
  values: {
    secretUserId: string;
    nickname?: string;
  };
};

export type DeleteSubject = SubjectId & {
  deleteAnswers: boolean;
};

export type AppletInvitationOptions = {
  role: string;
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  secretUserId: string;
  workspacePrefix: string;
  subjects: string[];
  language: string;
};

export type AppletInvitationData = AppletId & {
  url: string;
  options: AppletInvitationOptions;
};

export type SubjectInvitationData = AppletId &
  SubjectId & {
    email: string;
  };

export type AppletShellAccountOptions = {
  secretUserId: string;
  firstName: string;
  lastName: string;
  language: string;
  email: string | null;
  nickname?: string;
};

export type AppletShellAccountData = AppletId & {
  options: AppletShellAccountOptions;
};

export type DuplicateApplet = AppletId & {
  options: {
    encryption: Encryption;
    displayName: string;
  };
};

export type AppletName = { appletName: string };

export type AppletEncryption = AppletId & { encryption: Encryption };

export type UpdatePin = {
  userId: string;
  ownerId?: string;
};

export type FolderName = { name: string };

export type UpdateFolder = OwnerId & FolderName & FolderId;

export type TogglePin = OwnerId & {
  appletId: string;
  folderId: string;
  isPinned: boolean;
};

export type PublishApplet = AppletId & AppletName & { keywords: string[] };

export type UpdateAppletSearchTerms = AppletId & { params: { keywords: string } };

export type PostAppletPublicLink = AppletId & { requireLogin: boolean };

export type OwnerId = {
  ownerId: string;
};

export type DatavizActivity = {
  id: string;
  name: string;
  lastAnswerDate: string | null;
  isPerformanceTask?: boolean;
  hasAnswer?: boolean;
};

export type SubmitDates = {
  dates: string[];
};

export type AnswerDate = {
  answerId: string;
  createdAt: string;
  endDatetime?: string;
};

export type ReviewActivity = DatavizActivity & {
  answerDates: AnswerDate[];
};

export type DatavizAnswer = EncryptedAnswerSharedProps & {
  answerId: string;
  endDatetime: string;
  events: string;
  startDatetime: string;
  version: string;
};

export type Answers = AppletId & TargetSubjectId & { createdDate?: string };

export type ActivityAnswer = AppletId & { answerId: string; activityId: string };

export type AssessmentReview = AppletId & { answerId: string };

export type AssessmentId = { assessmentId: string };

export type DeleteReview = AssessmentReview & AssessmentId;

export type AssessmentResult = {
  answer: string | null;
  id: string;
  itemIds: string[];
  items: Item[];
  itemsLast: Item[] | null;
  reviewerPublicKey: string | null;
  versions: string[];
};

export type SaveAssessment = AppletId & {
  answerId: string;
} & {
  answer: string;
  itemIds: string[];
  reviewerPublicKey: string;
  assessmentVersionId: string;
};

export type Reviewer = {
  firstName: string;
  lastName: string;
  id: string;
};

export type Review = {
  id: string;
  createdAt: string;
  items: Item[];
  itemIds: string[];
  reviewer: Reviewer;
  /* "null" returns in case the user does not have access to the answer
  (a user with the role of reviewer only has access to their own review answers) */
  answer: string | null;
  reviewerPublicKey: string | null;
};

export type SummaryAnswers = AppletId & {
  activityId: string;
  params: TargetSubjectId & {
    fromDatetime: string;
    toDatetime: string;
    emptyIdentifiers: boolean;
    identifiers?: string[];
    versions?: string[];
  };
};

export type Identifier = {
  identifier: string;
  lastAnswerDate: string;
  userPublicKey: string | null;
};

export type NoteId = { noteId: string };

export type Note = { note: string };

export type GetAnswersNotesParams = {
  params: {
    search?: string;
    page?: number;
    limit?: number;
    ordering?: string;
  };
};

export type AppletSubmitDateList = AppletId &
  TargetSubjectId & {
    fromDate: string;
    toDate: string;
  };

export type EventId = { eventId: string };

export type AppletDataRetention = AppletId & {
  period: number | undefined;
  retention: RetentionPeriods;
};

export type GetWorkspaceAppletsParams = {
  params: {
    ownerId?: string;
    search?: string;
    page?: number;
    limit?: number;
    ordering?: string;
    roles?: string;
    folderId?: string | null;
    flatList?: boolean;
  };
};

export type ReportConfig = {
  reportServerIp: string;
  reportPublicKey: string;
  reportRecipients: string[];
  reportIncludeUserId: boolean;
  reportIncludedActivityName?: string;
  reportIncludedItemName?: string;
  reportEmailBody: string;
};

export type AppletVersionChanges = AppletId & { version: string };

export type ExportData = AppletId & {
  respondentIds?: string;
  targetSubjectIds?: string;
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
};

export type Folder = {
  id: string;
  name?: string;
  displayName: string;
  isFolder?: boolean;
  isNew?: boolean;
  isRenaming?: boolean;
  foldersAppletCount: number;
};

export type Applet = SingleApplet & {
  id: string;
  isFolder?: boolean;
  parentId?: string;
  type?: DashboardAppletType;
  folderId?: string;
  folderName?: string;
  isPinned?: boolean;
};

export type Version = {
  version: string;
  createdAt: string;
};

export type LatestReport = SubjectId & {
  appletId: string;
  activityId: string;
};

export type Identifiers = Omit<LatestReport, 'subjectId'> & TargetSubjectId;

export type GetRespondentDetailsParams = OwnerId & AppletId & RespondentId;

export type ActivityAnswerMeta = {
  createdAt: string;
  version: string;
  identifier: Identifier | null;
};

export type EncryptedActivityAnswer = EncryptedAnswerSharedProps & ActivityAnswerMeta;
