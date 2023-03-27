import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { ToggleButtonGroup, TimePicker } from 'shared/components';
import { StyledFlexTopCenter, StyledLabelLarge, theme } from 'shared/styles';

import { StyledNotification, StyledCol, StyledLeftCol } from './Notification.styles';
import { StyledColInner, StyledNotificationWrapper } from '../NotificationsTab.styles';
import { notificationTimeToggles } from './Notification.const';
import { Header } from '../Header';
import { NotificationProps } from './Notification.types';
import { FormValues, NotificationType } from '../../ActivityForm.types';

export const Notification = ({ index, remove }: NotificationProps) => {
  const { t } = useTranslation('app');
  const { setValue, watch } = useFormContext<FormValues>();
  const notification = watch(`notifications.${index}`);

  const handleRemoveNotification = () => {
    remove(index);
  };

  const updateTime = (selected: string) => {
    setValue(`notifications.${index}`, {
      at: null,
      from: null,
      to: null,
      type: selected as NotificationType,
    });
  };

  return (
    <StyledNotificationWrapper>
      <StyledLabelLarge sx={{ margin: theme.spacing(0, 0, 1.2, 1.1) }}>
        {t('notification')} {index + 1}
      </StyledLabelLarge>
      <StyledNotification>
        <Header onClickHandler={handleRemoveNotification} />
        <StyledFlexTopCenter>
          <StyledLeftCol>
            <ToggleButtonGroup
              toggleButtons={notificationTimeToggles}
              activeButton={notification.type}
              customChange={updateTime}
            />
          </StyledLeftCol>
          <StyledCol sx={{ marginLeft: theme.spacing(2.4) }}>
            {notification.type === NotificationType.Fixed ? (
              <StyledColInner>
                <TimePicker name={`notifications.${index}.at`} label={t('at')} />
              </StyledColInner>
            ) : (
              <>
                <StyledColInner>
                  <TimePicker name={`notifications.${index}.from`} label={t('from')} />
                </StyledColInner>
                <StyledColInner sx={{ marginLeft: theme.spacing(2.4) }}>
                  <TimePicker name={`notifications.${index}.to`} label={t('to')} />
                </StyledColInner>
              </>
            )}
          </StyledCol>
        </StyledFlexTopCenter>
      </StyledNotification>
    </StyledNotificationWrapper>
  );
};
