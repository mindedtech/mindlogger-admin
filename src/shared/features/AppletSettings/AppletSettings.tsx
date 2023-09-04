import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { useBreadcrumbs } from 'shared/hooks';
import { page } from 'resources';
import { NavigationItem, NavigationMenu } from 'shared/components';

import { AppletSettingsProps } from './AppletSettings.types';

export const AppletSettings = ({ settings, isBuilder = false }: AppletSettingsProps) => {
  const { appletId } = useParams();
  const navigate = useNavigate();
  const BUILDER_SETTINGS = generatePath(page.builderAppletSettings, {
    appletId,
  });
  const DASHBOARD_SETTINGS = generatePath(page.appletSettings, {
    appletId,
  });

  useBreadcrumbs();

  const handleSettingClick = (setting: NavigationItem) => {
    navigateTo(setting.param);
  };

  const navigateTo = (param = '') => {
    if (!isBuilder) {
      return navigate(param ? `${DASHBOARD_SETTINGS}/${param}` : DASHBOARD_SETTINGS);
    }
    navigate(param ? `${BUILDER_SETTINGS}/${param}` : BUILDER_SETTINGS);
  };

  return (
    <NavigationMenu
      title="appletSettings"
      items={settings}
      onClose={() => navigateTo()}
      onSetActiveItem={handleSettingClick}
    />
  );
};
