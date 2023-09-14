import { forwardRef, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { StyledIconButton, theme } from 'shared/styles';
import { InputController } from 'shared/components/FormComponents';
import { getAppletEncryptionInfo, getParsedEncryptionFromServer } from 'shared/utils/encryption';
import { Svg, EnterAppletPasswordForm, EnterAppletPasswordProps } from 'shared/components';
import { useEncryptionStorage } from 'shared/hooks';
import { Mixpanel } from 'shared/utils';

import { StyledController } from '../Password.styles';
import { passwordFormSchema } from './EnterAppletPassword.schema';
import { AppletPasswordRef } from '../Password.types';

export const EnterAppletPassword = forwardRef<AppletPasswordRef, EnterAppletPasswordProps>(
  ({ appletId, encryption, submitCallback, 'data-testid': dataTestid }, ref) => {
    const { t } = useTranslation('app');
    const { setAppletPrivateKey } = useEncryptionStorage();
    const { handleSubmit, control, setError, watch } = useForm<EnterAppletPasswordForm>({
      resolver: yupResolver(passwordFormSchema()),
      defaultValues: { appletPassword: '' },
    });
    const [showPassword, setShowPassword] = useState(false);

    const submitForm = async ({ appletPassword }: EnterAppletPasswordForm) => {
      const encryptionInfoFromServer = getParsedEncryptionFromServer(encryption!);

      if (!encryptionInfoFromServer) return;

      const { publicKey: publicKeyFromServer, ...restEncryption } = encryptionInfoFromServer;
      const encryptionInfoGenerated = getAppletEncryptionInfo({
        appletPassword,
        ...restEncryption,
      });

      if (
        encryptionInfoGenerated
          .getPublicKey()
          .equals(Buffer.from(publicKeyFromServer as unknown as WithImplicitCoercion<string>))
      ) {
        encryptionInfoGenerated?.getPrivateKey &&
          setAppletPrivateKey(appletId, Array.from(encryptionInfoGenerated.getPrivateKey()));
        submitCallback();

        Mixpanel.track('Password added successfully');
      } else {
        setError('appletPassword', { message: t('incorrectAppletPassword') });
      }
    };

    useImperativeHandle(ref, () => ({
      password: watch('appletPassword'),
      submitForm() {
        handleSubmit(submitForm)();
      },
    }));

    return (
      <form onSubmit={handleSubmit(submitForm)} noValidate>
        <StyledController>
          <InputController
            fullWidth
            name="appletPassword"
            control={control}
            label={t('password')}
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <StyledIconButton
                  aria-label="toggle password visibility"
                  sx={{ p: theme.spacing(0.9) }}
                  onClick={() => setShowPassword((prevState) => !prevState)}
                >
                  <Svg id={showPassword ? 'visibility-off' : 'visibility-on'} />
                </StyledIconButton>
              ),
            }}
            data-testid={`${dataTestid}-password`}
          />
        </StyledController>
      </form>
    );
  },
);
