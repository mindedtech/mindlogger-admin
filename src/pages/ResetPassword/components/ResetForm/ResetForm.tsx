import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { ResetPassword } from 'api';
import { useAppDispatch } from 'redux/store';
import { auth } from 'redux/modules';
import { page } from 'resources';
import { InputController } from 'components/FormComponents/InputController';
import { StyledLargeTitle } from 'styles/styledComponents/Typography';

import {
  StyledForm,
  StyledResetPasswordSubheader,
  StyledController,
  StyledButton,
  StyledBackWrapper,
  StyledBack,
} from './ResetForm.styles';
import { resetSchema } from './ResetForm.schema';
import { ResetFormProps } from './ResetForm.types';

export const ResetForm = ({ setEmail, onSubmitForTest }: ResetFormProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<ResetPassword>({
    resolver: yupResolver(resetSchema()),
    defaultValues: { email: '' },
  });

  const onSubmit = async ({ email }: ResetPassword) => {
    if (onSubmitForTest) {
      onSubmitForTest();
    }
    const { resetPassword } = auth.thunk;
    const result = await dispatch(resetPassword({ email }));

    if (resetPassword.fulfilled.match(result) && setEmail) {
      setEmail(email);
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)} noValidate>
      <StyledLargeTitle>{t('resetPassword')}</StyledLargeTitle>
      <StyledResetPasswordSubheader>
        {t('enterEmailAssociatedWithAccount')}
      </StyledResetPasswordSubheader>
      <StyledController>
        <InputController fullWidth name="email" control={control} label={t('email')} />
      </StyledController>
      <StyledButton variant="contained" type="submit" data-testid="submit-btn">
        {t('sendResetLink')}
      </StyledButton>
      <StyledBackWrapper>
        <StyledBack onClick={() => navigate(page.login)}>{t('backToLogin')}</StyledBack>
      </StyledBackWrapper>
    </StyledForm>
  );
};
