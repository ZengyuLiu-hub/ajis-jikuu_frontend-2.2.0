import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { CancelButton, InputText, ItemLabel, SubmitButton } from '../atoms';
import {
  ModalTemplate as Template,
  ModalContent,
  ModalCommands,
} from '../templates';

const Wrapper = styled.section`
  min-width: 450px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  padding-right: 15px;
  min-height: 34px;

  > * + * {
    margin-left: 5px;
  }

  > span:first-child {
    min-width: 200px;
  }
`;

const ItemValue = styled.div`
  display: flex;
  flex-direction: row;

  button {
    min-width: 120px;
  }

  input + span {
    margin-left: 15px;
  }

  input[type='text'] {
    width: 100px;

    &.textValue {
      width: 200px;
    }
  }
`;

const ItemRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;

  &:not(:first-child) {
    margin-top: 3px;
  }

  > * + * {
    margin-left: 5px;
  }

  > a {
    margin: 0 0 5px 0;
  }
`;

export type Condition = {
  areaId: string;
  text: string;
};

export type ConditionEvent = {
  onChangeAreaId(e: React.ChangeEvent<HTMLInputElement>): void;
  onBlurAreaId(e: React.ChangeEvent<HTMLInputElement>): void;
  onChangeText(e: React.ChangeEvent<HTMLInputElement>): void;
};

interface Props extends ReactModal.Props {
  areaIdLength: number;
  condition: Condition;
  conditionEvent: ConditionEvent;
  onClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * エリア追加
 *
 * @param props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const MapEditorAddArea = (props: Props): React.ReactElement => {
  const { condition, conditionEvent } = props;

  const [t] = useTranslation();

  return (
    <Template
      {...props}
      title={`${t('pages:MapEditorAddArea.title')}`}
      description={`${t('pages:MapEditorAddArea.description')}`}
      onRequestClose={props.onClickCancel}
      contentLabel="MapEditorAddArea"
    >
      <Wrapper>
        <ModalContent>
          {/** エリアID */}
          <Item>
            <ItemLabel label={t('pages:MapEditorAddArea.areaId.label')} />
            <ItemValue>
              <ItemRow>
                <InputText
                  maxLength={props.areaIdLength}
                  valueMode="HALF_WIDTH_ALPHABET_AND_NUMBER"
                  onChange={conditionEvent.onChangeAreaId}
                  onBlur={conditionEvent.onBlurAreaId}
                  value={condition.areaId}
                />
              </ItemRow>
            </ItemValue>
          </Item>
          {/** テキスト */}
          <Item>
            <ItemLabel label={t('pages:MapEditorAddArea.text.label')} />
            <ItemValue>
              <ItemRow>
                <InputText
                  maxLength={255}
                  className="textValue"
                  onChange={conditionEvent.onChangeText}
                  value={condition.text}
                />
              </ItemRow>
            </ItemValue>
          </Item>
        </ModalContent>
        <ModalCommands>
          <CancelButton onClick={props.onClickCancel}>
            {t('pages:MapEditorAddArea.button.cancel')}
          </CancelButton>
          <SubmitButton onClick={props.onClickSubmit}>
            {t('pages:MapEditorAddArea.button.submit')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
