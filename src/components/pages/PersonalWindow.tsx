import React from 'react';
import ReactModal from 'react-modal';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Language } from '../../types';
import { langList } from '../../app/i18n';
import { Dropdown } from '../atoms';

export const Styles: ReactModal.Styles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    width: '100vw',
    height: '100vh',
  },
  content: {
    position: 'absolute',
    top: '30px',
    right: '10px',
    bottom: 'unset',
    left: 'unset',
    padding: '0',
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
    border: 'none',
    borderRadius: '5px',
    boxShadow: '3px 3px 10px rgba(0, 0, 0, 0.3)',
    width: '300px',
    height: '300px',
  },
};

const Content = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;
`;

const Header = styled.div``;

const Person = styled.div`
  position: relative;
  width: 100%;
  height: 100px;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: transparent;
    background-position: center center;
    background-repeat: no-repeat;
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48px' height='48px' viewBox='0 0 24 24' aria-labelledby='userIconTitle' stroke='%23ffffff' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%232329D6'%3E%3Cpath stroke-linecap='round' d='M5.5,19.5 C7.83333333,18.5 9.33333333,17.6666667 10,17 C11,16 8,16 8,11 C8,7.66666667 9.33333333,6 12,6 C14.6666667,6 16,7.66666667 16,11 C16,16 13,16 14,17 C14.6666667,17.6666667 16.1666667,18.5 18.5,19.5'/%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3C/svg%3E");
    background-size: 48px 48px;
  }
`;

const Username = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 30px;
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
`;

const SelectLang = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 60px;
`;

const PersonalMenu = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.3);
`;

const LogoutButton = styled.button`
  position: relative;
  margin: 0;
  padding: 0 0 0 50px;
  background: transparent;
  border: none;
  width: 100%;
  height: 40px;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 20px;
    background-color: transparent;
    background-position: center left;
    background-repeat: no-repeat;
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xml:space='preserve' version='1.1' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='arcs'%3E%3Cpath d='M16 17l5-5-5-5M19.8 12H9M10 3H4v18h6'/%3E%3C/svg%3E");
    background-size: 21px 21px;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export interface Props extends ReactModal.Props {
  userName: string;
  selectedLang: Language;
  onChangeLang(e: React.ChangeEvent<HTMLSelectElement>): void;
  onRequestClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickLogout(e: React.MouseEvent<HTMLButtonElement>): void;
}

export const PersonalWindow = (props: Props) => {
  const [t] = useTranslation();

  return (
    <ReactModal
      style={Styles}
      isOpen={props.isOpen}
      contentLabel={props.contentLabel}
      onRequestClose={props.onRequestClose}
      onAfterOpen={props.onAfterOpen}
    >
      <Content>
        <Header>
          <Person />
          <Username>{props.userName}</Username>
          <SelectLang>
            <Dropdown
              items={langList}
              labelField={'label'}
              valueField={'lang'}
              onChange={props.onChangeLang}
              value={props.selectedLang}
            />
          </SelectLang>
        </Header>
        <PersonalMenu>
          <LogoutButton onClick={props.onClickLogout}>
            {t('pages:PersonalWindow.button.logoutButton')}
          </LogoutButton>
        </PersonalMenu>
      </Content>
    </ReactModal>
  );
};
