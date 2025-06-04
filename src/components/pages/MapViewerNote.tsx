import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { CancelButton } from '../atoms';
import {
  ModalCommands,
  ModalContent,
  ModalTemplate as Template,
} from '../templates';

const Wrapper = styled.section`
  width: 500px;
`;

const Item = styled.pre`
  height: 180px;
  font-size: 1rem;
`;

const Content = styled(ModalContent)`
  margin: 0 15px 0 10px;
`;

const Commands = styled(ModalCommands)`
  justify-content: center;
`;

export type Condition = {
  /** 棚卸日 */
  inventoryNote: string;
};

interface Props extends ReactModal.Props {
  /** 条件 */
  condition: Condition;
  /** 閉じる押下 */
  onClickClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * マップビューア：棚卸メモ
 *
 * @param props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const MapViewerNote = (props: Props) => {
  const { condition } = props;

  const [t] = useTranslation();

  return (
    <Template
      {...props}
      title={`${t('pages:MapViewerNote.title')}`}
      description={`${t('pages:MapViewerNote.description')}`}
      onRequestClose={props.onClickClose}
      contentLabel="MapViewerNote"
    >
      <Wrapper>
        <Content>
          <Item>{condition.inventoryNote}</Item>
        </Content>
        <Commands>
          <CancelButton onClick={props.onClickClose}>
            {t('pages:MapViewerNote.button.close')}
          </CancelButton>
        </Commands>
      </Wrapper>
    </Template>
  );
};
