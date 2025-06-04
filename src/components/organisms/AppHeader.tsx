import React from 'react';
import styled from 'styled-components';

import { MainMenu } from '../../containers/molecules';

export const Wrapper = styled.header`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  padding: 0 15px 0 10px;
  background-color: rgba(40, 40, 40, 1);
  height: 30px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;

  span {
    color: rgba(255, 255, 255, 1);
  }
`;

const LogoButton = styled.button`
  position: relative;
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
  width: 30px;
  height: 30px;
  color: rgba(255, 255, 255, 1);
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: transparent;
    background-position: center center;
    background-repeat: no-repeat;
    background-image: url('/images/logo48.png');
    background-size: 27px 27px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const HeaderRight = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  > button {
    margin-left: 10px;
  }
`;

const Environment = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  > span {
    color: rgba(255, 215, 0, 1);
  }
`;

const PersonButton = styled.button`
  position: relative;
  margin: 0;
  padding: 0;
  background: transparent;
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: transparent;
    background-position: center center;
    background-repeat: no-repeat;
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48px' height='48px' viewBox='0 0 24 24' aria-labelledby='userIconTitle' stroke='%23c8c8c8' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%232329D6'%3E%3Cpath stroke-linecap='round' d='M5.5,19.5 C7.83333333,18.5 9.33333333,17.6666667 10,17 C11,16 8,16 8,11 C8,7.66666667 9.33333333,6 12,6 C14.6666667,6 16,7.66666667 16,11 C16,16 13,16 14,17 C14.6666667,17.6666667 16.1666667,18.5 18.5,19.5'/%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E");
    background-size: 21px 21px;
  }

  &:hover::before {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48px' height='48px' viewBox='0 0 24 24' aria-labelledby='userIconTitle' stroke='%23f5f5f5' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%232329D6'%3E%3Cpath stroke-linecap='round' d='M5.5,19.5 C7.83333333,18.5 9.33333333,17.6666667 10,17 C11,16 8,16 8,11 C8,7.66666667 9.33333333,6 12,6 C14.6666667,6 16,7.66666667 16,11 C16,16 13,16 14,17 C14.6666667,17.6666667 16.1666667,18.5 18.5,19.5'/%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E");
  }
`;

interface LogoProps {
  onClickLogo(e: React.MouseEvent<HTMLButtonElement>): void;
}
const LogoContent = React.memo((props: LogoProps) => (
  <Logo>
    <LogoButton onClick={props.onClickLogo} />
  </Logo>
));

const MenuContent = React.memo(() => <MainMenu />);

interface EnvironmentProps {
  environment: string;
}
const EnvironmentContent = React.memo((props: EnvironmentProps) => (
  <Environment>
    <span>{props.environment}</span>
  </Environment>
));

interface PersonProps {
  onClickShowPersonalWindow(e: React.MouseEvent<HTMLButtonElement>): void;
}
const PersonContent = React.memo((props: PersonProps) => (
  <PersonButton onClick={props.onClickShowPersonalWindow} />
));

interface Props extends LogoProps, EnvironmentProps, PersonProps {}

/**
 * アプリケーションヘッダー
 */
export const AppHeader = (props: Props) => {
  return (
    <Wrapper>
      <LogoContent onClickLogo={props.onClickLogo} />
      <HeaderLeft>
        <MenuContent />
      </HeaderLeft>
      <HeaderRight>
        <EnvironmentContent environment={props.environment} />
        <PersonContent
          onClickShowPersonalWindow={props.onClickShowPersonalWindow}
        />
      </HeaderRight>
    </Wrapper>
  );
};
