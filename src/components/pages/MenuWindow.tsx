import React from 'react';
import ReactModal from 'react-modal';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import * as routerConstants from '../../constants/router';

export const Styles: ReactModal.Styles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    width: '100vw',
    height: '100vh',
  },
  content: {
    position: 'absolute',
    top: '30px',
    right: 'unset',
    bottom: 'unset',
    left: '40px',
    padding: '0',
    backgroundColor: 'rgba(40, 40, 40, 0.9)',
    border: 'none',
    borderRadius: '0',
    boxShadow: '3px 3px 10px rgba(0, 0, 0, 0.3)',
    width: '200px',
    height: '150px',
  },
};

const Content = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;

  ul {
    padding: 0;
    font-size: 0;
    list-style-type: none;

    li {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 30px;
      line-height: 30px;
      font-size: 1rem;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);

      display: block;
      padding: 0 15px;
      position: relative;

      &:hover {
        cursor: pointer;
        background-color: rgba(210, 215, 211, 1);
        color: rgba(0, 0, 0, 1);
      }
    }
  }
`;

export interface Props extends ReactModal.Props {
  onClickMenu(path: string): void;
  onClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

export const MenuWindow = (props: Props) => {
  const [t] = useTranslation();

  return (
    <ReactModal
      style={Styles}
      isOpen={props.isOpen}
      contentLabel="MenuWindow"
      onRequestClose={props.onClose}
    >
      <Content>
        <ul>
          <li onClick={() => props.onClickMenu(routerConstants.PATH_STORES)}>
            {t('pages:MenuWindow.search.stores.label')}
          </li>
          <li onClick={() => props.onClickMenu(routerConstants.PATH_COMPANIES)}>
            {t('pages:MenuWindow.search.companies.label')}
          </li>
        </ul>
        
      </Content>
    </ReactModal>
  );
};
