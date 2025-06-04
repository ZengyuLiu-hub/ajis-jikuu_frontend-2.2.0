import React from 'react';
import styled from 'styled-components';
import {
  FieldError,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import packageInfo from '../../../package.json';

import { Language, LoginFormData } from '../../types';
import { langList } from '../../app/i18n';
import { Dropdown } from '../atoms';

const Layout = styled.div`
  overflow: hidden;
  margin: none;
  padding: none;
  background: #e9e9e9;
  color: #5e5e5e;
  font:
    400 87.5%/1.5em 'Open Sans',
    sans-serif;
  width: 100vw;
  height: 100vh;
`;

const Header = styled.header`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto;
  grid-column-gap: 10px;
  padding: 0 15px;
  height: 30px;
`;

const Title = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-row-gap: 0;
  padding: 30px 0;
`;

const TitleLabel = styled.h1`
  text-align: center;
`;

const Environment = styled.h2`
  color: rgba(126, 71, 228, 1);
  text-align: center;
`;

const FormWrapper = styled.div`
  background: #fafafa;
  margin: 3em auto;
  padding: 0 1em;
  max-width: 420px;
`;

const FormFooter = styled.div`
  font-size: 1em;
  padding: 2em 0;
  text-align: center;

  > a {
    color: #8c8c8c;
    text-decoration: none;
    transition: border-color 0.3s;

    &:hover {
      border-bottom: 1px dotted #8c8c8c;
    }
  }
`;

const LoginForm = styled.form`
  padding: 0 1.5em;
`;

const FormItem = styled.div`
  margin-bottom: 0.75em;
  width: 100%;
`;

const ButtonPanel = styled.div`
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

const LoginId = styled(Input)``;

const Password = styled(Input)``;

const ErrorMessage = styled.span`
  color: rgba(255, 0, 0, 1);
`;

const LoginButton = styled.button`
  background: #f16272;
  border: none;
  color: #fff;
  cursor: pointer;
  height: 50px;
  font-family: 'Open Sans', sans-serif;
  font-size: 1.2em;
  letter-spacing: 0.05em;
  text-align: center;
  text-transform: uppercase;
  transition: background 0.3s ease-in-out;
  width: 100%;

  &:hover {
    background: #ee3e52;
  }
`;

const Version = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 200px;
  height: 24px;
`;

interface HeaderProps {
  selectedLang: Language;
  onChangeLang(e: React.ChangeEvent<HTMLSelectElement>): void;
}
const HeaderContent = React.memo((props: HeaderProps) => (
  <Header>
    <div></div>
    <div>
      <Dropdown
        items={langList}
        labelField={'label'}
        valueField={'lang'}
        onChange={props.onChangeLang}
        value={props.selectedLang}
      />
    </div>
  </Header>
));

interface FormHeaderContentProps {
  environment: string;
}

const FormHeaderContent = React.memo((props: FormHeaderContentProps) => {
  const [t] = useTranslation();

  return (
    <Title>
      <TitleLabel>{t('pages:Login.title')}</TitleLabel>
      {props.environment && (
        <Environment>{`- ${props.environment} -`}</Environment>
      )}
    </Title>
  );
});

interface FormItemLoginIdProps {
  register: UseFormRegister<LoginFormData>;
  errorLoginId?: FieldError;
}
const FormItemLoginId = React.memo((props: FormItemLoginIdProps) => {
  const [t] = useTranslation();

  return (
    <FormItem>
      <label>
        <LoginId
          type="text"
          placeholder={`${t('pages:Login.loginId.placeholder')}`}
          {...props.register('loginId', { required: true })}
          autoFocus={true}
        />
      </label>
      {props.errorLoginId && (
        <ErrorMessage>
          {t('messages:error.requiredMessage', {
            fieldName: t('pages:Login.loginId.placeholder'),
          })}
        </ErrorMessage>
      )}
    </FormItem>
  );
});

interface FormItemPasswordProps {
  register: UseFormRegister<LoginFormData>;
  errorPassword?: FieldError;
}
const FormItemPassword = React.memo((props: FormItemPasswordProps) => {
  const [t] = useTranslation();

  return (
    <FormItem>
      <label>
        <Password
          type="password"
          placeholder={`${t('pages:Login.password.placeholder')}`}
          {...props.register('password', { required: true })}
        />
      </label>
      {props.errorPassword && (
        <ErrorMessage>
          {t('messages:error.requiredMessage', {
            fieldName: t('pages:Login.password.placeholder'),
          })}
        </ErrorMessage>
      )}
    </FormItem>
  );
});

const FormButton = React.memo(() => {
  const [t] = useTranslation();

  return (
    <ButtonPanel>
      <LoginButton>{t('pages:Login.loginButton.label')}</LoginButton>
    </ButtonPanel>
  );
});

const FormFooterContent = React.memo(() => <FormFooter></FormFooter>);

const AppVersion = React.memo(() => (
  <Version>Version: {packageInfo.version}</Version>
));

interface Props extends HeaderProps {
  environment: string;
  onClickSubmit(data: LoginFormData): SubmitHandler<LoginFormData> | unknown;
}

/**
 * ログイン
 */
export const Login = (props: Props) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginFormData>();

  return (
    <Layout>
      <HeaderContent
        selectedLang={props.selectedLang}
        onChangeLang={props.onChangeLang}
      />
      <FormWrapper>
        <FormHeaderContent environment={props.environment} />
        <LoginForm onSubmit={handleSubmit(props.onClickSubmit)}>
          <FormItemLoginId register={register} errorLoginId={errors.loginId} />
          <FormItemPassword
            register={register}
            errorPassword={errors.password}
          />
          <FormButton />
        </LoginForm>
        <FormFooterContent />
      </FormWrapper>
      <AppVersion />
    </Layout>
  );
};
