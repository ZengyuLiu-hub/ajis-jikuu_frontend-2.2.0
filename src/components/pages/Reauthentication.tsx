import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { LoginFormData } from '../../types';

import { CancelButton, SubmitButton } from '../atoms';
import { ModalTemplate as Template, ModalContent } from '../templates';

const Wrapper = styled.section`
  min-width: 600px;
`;

const LoginForm = styled.form`
  padding: 0 1.5em;
`;

const Account = styled.div`
  display: flex;
  align-items: center;
  padding: 30px 0;
  width: 100%;

  > label {
    margin-right: 15px;
    font-weight: bold;
    color: rgba(105, 105, 105, 1);
  }
`;

const FormItem = styled.div`
  margin-bottom: 0.75em;
  width: 100%;
`;

const ButtonPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2em 0 0;
  width: 100%;
`;

const Input = styled.input`
  background: #fafafa;
  border: none;
  border-bottom: 2px solid #e9e9e9;
  color: #666;
  font-family: 'Open Sans', sans-serif;
  font-size: 1em;
  height: 50px;
  transition: border-color 0.3s;
  width: 100%;

  &:focus {
    border-bottom: 2px solid #c0c0c0;
    outline: none;
  }
`;

const Value = styled.span`
  color: rgba(3, 86, 252, 1);
`;

const Password = styled(Input)``;

const ErrorMessage = styled.span`
  color: rgba(255, 0, 0, 1);
`;

interface Props extends ReactModal.Props {
  userName: string;
  onClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickSubmit(data: LoginFormData): SubmitHandler<LoginFormData> | unknown;
  onClickClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

export const Reauthentication = (props: Props) => {
  const { isOpen } = props;

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | undefined>();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setFocus,
  } = useForm<LoginFormData>();

  const [t] = useTranslation();

  useEffect(() => {
    if (isOpen) {
      reset({ loginId: '', password: '' });
      setTimeoutId(setTimeout(() => setFocus('password'), 0));
    } else {
      clearTimeout(timeoutId);
    }

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Template
      {...props}
      title={`${t('pages:Reauthentication.title')}`}
      description={`${t('pages:Reauthentication.description')}`}
      onRequestClose={props.onClickClose}
      contentLabel="Reauthentication"
      enableCloseButton={false}
      zIndex={50}
    >
      <Wrapper>
        <ModalContent>
          <LoginForm onSubmit={handleSubmit(props.onClickSubmit)}>
            <Account>
              <label>{t('pages:Reauthentication.userName.label')}</label>
              <Value>{props.userName}</Value>
            </Account>
            <FormItem>
              <label>
                <Password
                  type="password"
                  placeholder={`${t(
                    'pages:Reauthentication.password.placeholder',
                  )}`}
                  {...register('password', { required: true })}
                />
              </label>
              {errors.password && (
                <ErrorMessage>
                  {t('messages:error.requiredMessage', {
                    fieldName: t('pages:Reauthentication.password.placeholder'),
                  })}
                </ErrorMessage>
              )}
            </FormItem>
            <ButtonPanel>
              <CancelButton onClick={props.onClickCancel}>
                {t('pages:Reauthentication.cancelButton.label')}
              </CancelButton>
              <SubmitButton type="submit">
                {t('pages:Reauthentication.loginButton.label')}
              </SubmitButton>
            </ButtonPanel>
          </LoginForm>
        </ModalContent>
      </Wrapper>
    </Template>
  );
};
