import { Svg } from 'shared/components';
import { Roles } from 'shared/consts';
import {
  ExportDataSetting,
  DataRetention,
  EditAppletSetting,
  TransferOwnershipSetting,
  DuplicateAppletSettings,
  DeleteAppletSetting,
  ReportConfigSetting,
  DownloadSchemaSetting,
  PublishConcealAppletSetting,
  VersionHistorySetting,
  ShareAppletSetting,
} from 'shared/features/AppletSettings';
import { SettingParam, isManagerOrOwner } from 'shared/utils';

import { GetSettings } from './DashboardAppletSettings.types';

export const getSettings = ({ isPublished, roles }: GetSettings) => [
  ...(isManagerOrOwner(roles?.[0])
    ? [
        {
          label: 'usersAndData',
          items: [
            {
              icon: <Svg id="export" />,
              label: 'exportData',
              component: <ExportDataSetting />,
              param: SettingParam.ExportData,
            },
            {
              icon: <Svg id="data-retention" />,
              label: 'dataRetention',
              component: <DataRetention isDashboard />,
              param: SettingParam.DataRetention,
            },
          ],
        },
      ]
    : []),
  {
    label: 'appletContent',
    items: [
      {
        icon: <Svg id="edit-applet" />,
        label: 'editApplet',
        component: <EditAppletSetting />,
        param: SettingParam.EditApplet,
      },
      {
        icon: <Svg id="schema" />,
        label: 'downloadSchema',
        component: <DownloadSchemaSetting />,
        param: SettingParam.DownloadSchema,
      },
      {
        icon: <Svg id="version-history" />,
        label: 'versionHistory',
        component: <VersionHistorySetting />,
        param: SettingParam.VersionHistory,
      },
      ...(roles?.[0] === Roles.Owner
        ? [
            {
              icon: <Svg id="transfer-ownership" />,
              label: 'transferOwnership',
              component: <TransferOwnershipSetting />,
              param: SettingParam.TransferOwnership,
            },
          ]
        : []),
      {
        icon: <Svg id="duplicate" />,
        label: 'duplicateApplet',
        component: <DuplicateAppletSettings />,
        param: SettingParam.DuplicateApplet,
      },

      {
        icon: <Svg id="trash" />,
        label: 'deleteApplet',
        component: <DeleteAppletSetting />,
        param: SettingParam.DeleteApplet,
      },
    ],
  },
  {
    label: 'reports',
    items: [
      {
        icon: <Svg id="report-configuration" />,
        label: 'reportConfiguration',
        component: <ReportConfigSetting isDashboard />,
        param: SettingParam.ReportConfiguration,
      },
    ],
  },
  {
    label: 'sharing',
    items: [
      // Share to Library functionality shall be hidden on UI until the Moderation process within MindLogger is
      // introduced. (Story: AUS-4.1.4.10)
      // Temporarily unhided for testing purposes
      {
        icon: <Svg id="share" />,
        label: 'shareToLibrary',
        component: <ShareAppletSetting />,
        param: SettingParam.ShareApplet,
      },
      ...(roles?.includes(Roles.SuperAdmin)
        ? [
            {
              icon: <Svg id={isPublished ? 'conceal' : 'publish'} />,
              label: isPublished ? 'concealApplet' : 'publishApplet',
              component: <PublishConcealAppletSetting isDashboard />,
              param: SettingParam.PublishConceal,
            },
          ]
        : []),
    ],
  },
];
