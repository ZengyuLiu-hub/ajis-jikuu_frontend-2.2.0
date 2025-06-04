import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MapPdfOutputMode, MapPdfOutputModes, MapPdfRotation, MapPdfRotations } from '../../types';

import {
  CancelButton,
  CheckBox,
  ItemLabel,
  RadioButton,
  SubmitButton,
} from '../atoms';
import {
  ModalCommands,
  ModalContent,
  ModalTemplate as Template,
} from '../templates';

const Wrapper = styled.section`
  min-width: 500px;
  max-width: 800px;
`;

const Content = styled(ModalContent)`
  padding-top: 10px;
  min-height: 90px;
`;

const Item = styled.div`
  display: flex;
  align-items: flex-start;
  padding-right: 15px;
  min-height: 34px;

  &:not(:first-child) {
    margin-top: 10px;
  }

  > * + * {
    margin-left: 5px;
  }

  > span:first-child {
    min-width: 240px;
  }
`;

const ItemValue = styled.div`
  display: flex;
  flex-direction: column;
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
`;

export type Condition = {
  outputMode: MapPdfOutputMode;
  outputHeaderFooter: boolean;
  rotation: MapPdfRotation;
};

export type ConditionEvent = {
  onChangeOutputMode(mode: MapPdfOutputMode): void;
  onChangeOutputHeaderFooter(value: boolean): void;
  onChangeRotation(value: MapPdfRotation): void;
};

interface Props extends ReactModal.Props {
  condition: Condition;
  conditionEvent: ConditionEvent;
  onClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * マップ PDF 出力モード.
 */
export const MapEditorMapPdfOutput = (props: Props) => {
  const { condition, conditionEvent } = props;

  const [t] = useTranslation();

  return (
    <Template
      {...props}
      title={`${t('pages:MapEditorMapPdfOutput.title')}`}
      description={`${t('pages:MapEditorMapPdfOutput.description')}`}
      onRequestClose={props.onClickCancel}
      contentLabel="MapEditorMapPdfOutput"
    >
      <Wrapper>
        <Content>
          {/** PDF 出力モード */}
          <Item>
            <ItemLabel
              label={t('pages:MapEditorMapPdfOutput.outputMode.label')}
            />
            <ItemValue>
              <ItemRow>
                <RadioButton
                  name="MapEditorMapPdfOutput.outputMode"
                  label={`${t(
                    'pages:MapEditorMapPdfOutput.outputMode.inventory',
                  )}`}
                  value={MapPdfOutputModes.INVENTORY}
                  onChange={(e) =>
                    conditionEvent.onChangeOutputMode(
                      e.target.value as MapPdfOutputMode,
                    )
                  }
                  checked={condition.outputMode === MapPdfOutputModes.INVENTORY}
                />
                <RadioButton
                  name="MapEditorMapPdfOutput.outputMode"
                  label={`${t(
                    'pages:MapEditorMapPdfOutput.outputMode.statementOfDelivery',
                  )}`}
                  value={MapPdfOutputModes.STATEMENT_OF_DELIVERY}
                  onChange={(e) =>
                    conditionEvent.onChangeOutputMode(
                      e.target.value as MapPdfOutputMode,
                    )
                  }
                  checked={
                    condition.outputMode ===
                    MapPdfOutputModes.STATEMENT_OF_DELIVERY
                  }
                />
              </ItemRow>
            </ItemValue>
            <ItemRow></ItemRow>
          </Item>
          {/** ヘッダー・フッター有無 */}
          <Item>
            <ItemLabel
              label={t('pages:MapEditorMapPdfOutput.outputHeaderFooter.label')}
            />
            <ItemValue>
              <ItemRow>
                <CheckBox
                  label={t(
                    'pages:MapEditorMapPdfOutput.outputHeaderFooter.output',
                  )}
                  onChange={(e) =>
                    conditionEvent.onChangeOutputHeaderFooter(e.target.checked)
                  }
                  checked={condition.outputHeaderFooter}
                  disabled={
                    condition.outputMode !==
                    MapPdfOutputModes.STATEMENT_OF_DELIVERY
                  }
                />
              </ItemRow>
            </ItemValue>
          </Item>
          {/** 回転 */}
          <Item>
            <ItemLabel
              label={t('pages:MapEditorMapPdfOutput.rotation.label')}
            />
            <ItemValue>
              <ItemRow>
                <RadioButton
                  name="MapEditorMapPdfOutput.rotation"
                  label={t('pages:MapEditorMapPdfOutput.rotation.none')}
                  value={MapPdfRotations.NONE}
                  onChange={(e) =>
                    conditionEvent.onChangeRotation(
                      e.target.value as MapPdfRotation,
                    )
                  }
                  checked={condition.rotation === MapPdfRotations.NONE}
                />
                <RadioButton
                  name="MapEditorMapPdfOutput.rotation"
                  label={t('pages:MapEditorMapPdfOutput.rotation.right')}
                  value={MapPdfRotations.RIGHT}
                  onChange={(e) =>
                    conditionEvent.onChangeRotation(
                      e.target.value as MapPdfRotation,
                    )
                  }
                  checked={condition.rotation === MapPdfRotations.RIGHT}
                />
                <RadioButton
                  name="MapEditorMapPdfOutput.rotation"
                  label={t('pages:MapEditorMapPdfOutput.rotation.left')}
                  value={MapPdfRotations.LEFT}
                  onChange={(e) =>
                    conditionEvent.onChangeRotation(
                      e.target.value as MapPdfRotation,
                    )
                  }
                  checked={condition.rotation === MapPdfRotations.LEFT}
                />
              </ItemRow>
            </ItemValue>
            <ItemRow></ItemRow>
          </Item>
        </Content>
        <ModalCommands>
          <CancelButton onClick={props.onClickCancel}>
            {t('pages:MapEditorMapPdfOutput.button.cancel')}
          </CancelButton>
          <SubmitButton onClick={props.onClickSubmit}>
            {t('pages:MapEditorMapPdfOutput.button.submit')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
