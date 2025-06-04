import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { CancelButton, SubmitButton, TextArea } from '../atoms';
import {
  ModalTemplate as Template,
  ModalContent,
  ModalCommands,
} from '../templates';

const Wrapper = styled.section`
  min-width: 500px;
  max-width: 800px;
`;

const Item = styled.div`
  width: 100%;
  min-height: 34px;

  > textarea {
    min-width: 500px;
    max-width: 100%;
    min-height: 200px;
    max-height: 600px;
  }
`;

export type Condition = {
  inventoryNote: string;
};

export type ConditionEvent = {
  onChangeInventoryNote(e: React.ChangeEvent<HTMLTextAreaElement>): void;
};

interface Props extends ReactModal.Props {
  condition: Condition;
  conditionEvent: ConditionEvent;
  onClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * 棚卸メモ
 */
export const MapEditorNote = (props: Props) => {
  const { condition, conditionEvent } = props;

  const [t] = useTranslation();

  return (
    <Template
      {...props}
      title={`${t('pages:MapEditorNote.title')}`}
      description={`${t('pages:MapEditorNote.description')}`}
      onRequestClose={props.onClickCancel}
      contentLabel="MapEditorNote"
    >
      <Wrapper>
        <ModalContent>
          <Item>
            <TextArea
              onChange={conditionEvent.onChangeInventoryNote}
              value={condition.inventoryNote}
              maxLength={500}
            ></TextArea>
          </Item>
        </ModalContent>
        <ModalCommands>
          <CancelButton onClick={props.onClickCancel}>
            {t('pages:MapEditorNote.button.cancel')}
          </CancelButton>
          <SubmitButton onClick={props.onClickSubmit}>
            {t('pages:MapEditorNote.button.submit')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
