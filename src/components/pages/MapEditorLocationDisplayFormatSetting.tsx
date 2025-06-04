import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import classNames from 'classnames';

import * as editorConstants from '../../constants/editor';

import { SelectIdType, SelectIdTypes } from '../../types';

import { CancelButton, SubmitButton } from '../atoms';
import {
  ModalTemplate as Template,
  ModalContent,
  ModalCommands,
} from '../templates';

const Wrapper = styled.section`
  min-width: 500px;
`;

const Content = styled(ModalContent)`
  display: grid;
  grid-template-rows: auto auto auto;
  grid-row-gap: 24px;
`;

const Symbol = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px;
  width: 24px;
  height: 24px;
`;

const TableId = styled.div``;

const BranchNum = styled.div``;

const Sequence = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
`;

const SelectId = styled.div`
  display: grid;
  grid-template-rows: auto auto auto;
  grid-row-gap: 10px;
  margin: 24px 0;
`;

const Description = styled.div`
  p {
    margin: 0;
    padding: 0;
  }
`;

const Format = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: auto;
  padding: 9px;
  border: 1px solid rgba(200, 200, 200, 1);

  > div {
    display: grid;
    grid-template-rows: auto auto;
  }

  ${TableId}, ${BranchNum} {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    border: 1px solid rgba(200, 200, 200, 1);
    width: 30px;
    height: 30px;
    cursor: pointer;

    &:hover {
      background-color: rgba(200, 200, 200, 1);
    }
  }

  ${TableId}.selected {
    background-color: rgba(98, 240, 162, 1);
  }

  ${BranchNum}.selected {
    background-color: rgba(164, 179, 237, 1);
  }
`;

const Legend = styled.div`
  display: flex;

  > div {
    display: flex;
    align-items: center;
    height: 24px;
  }

  > div + div {
    margin-left: 15px;
  }

  ${TableId} > ${Symbol} {
    background-color: rgba(98, 240, 162, 1);
  }

  ${BranchNum} > ${Symbol} {
    background-color: rgba(164, 179, 237, 1);
  }
`;

const Caution = styled.div`
  p,
  span {
    margin: 0;
    padding: 0;
    color: rgba(255, 51, 51, 1);
  }

  > p:first-child {
    font-weight: bold;
  }

  > p:not(:first-child) {
    padding-left: 15px;
  }
`;

export type SelectIdData = {
  selectIdType: SelectIdType;
  startIndex: number;
};

interface Props extends ReactModal.Props {
  tableIdLength: number;
  branchNumLength: number;
  selectIds: SelectIdData[];
  onClickSelectId(data: SelectIdData): void;
  onClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * 表示用ロケーション形式設定
 */
export const MapEditorLocationDisplayFormatSetting = (props: Props) => {
  const { tableIdLength, branchNumLength } = props;

  const [t] = useTranslation();

  const isSelected = (selectIdType: SelectIdType, startIndex: number) => {
    return props.selectIds.some(
      (id) => id.selectIdType === selectIdType && id.startIndex === startIndex
    );
  };

  const getSequence = (selectIdType: SelectIdType, startIndex: number) => {
    const index = props.selectIds.findIndex(
      (id) => id.selectIdType === selectIdType && id.startIndex === startIndex
    );
    if (index > -1) {
      return `${index + 1}`;
    }
    return '';
  };

  return (
    <Template
      {...props}
      title={`${t('pages:MapEditorLocationDisplayFormatSetting.title')}`}
      description={`${t(
        'pages:MapEditorLocationDisplayFormatSetting.description',
        {
          maxLength: editorConstants.DISPLAY_LOCATION_NUM_MAX_LENGTH,
        }
      )}`}
      onRequestClose={props.onClickCancel}
      contentLabel="MapEditorLocationDisplayFormatSetting"
    >
      <Wrapper>
        <Content>
          <SelectId>
            {/** 説明 */}
            <Description>
              {`${t(
                'pages:MapEditorLocationDisplayFormatSetting.selectId.description'
              )}`
                .split('\n')
                .map((text, i) => (
                  <p key={i}>
                    <span>{text}</span>
                  </p>
                ))}
            </Description>
            {/** フォーマット定義 */}
            <Format>
              {[...Array(tableIdLength + branchNumLength)].map((_, i) => {
                if (i < tableIdLength) {
                  return (
                    <div key={i}>
                      <TableId
                        className={classNames({
                          selected: isSelected(SelectIdTypes.T, i),
                        })}
                        onClick={() =>
                          props.onClickSelectId({
                            selectIdType: SelectIdTypes.T,
                            startIndex: i,
                          })
                        }
                      >{`T${i + 1}`}</TableId>
                      <Sequence>{getSequence(SelectIdTypes.T, i)}</Sequence>
                    </div>
                  );
                }
                return (
                  <div key={i}>
                    <BranchNum
                      className={classNames({
                        selected: isSelected(SelectIdTypes.B, i),
                      })}
                      onClick={() =>
                        props.onClickSelectId({
                          selectIdType: SelectIdTypes.B,
                          startIndex: i,
                        })
                      }
                    >{`B${i - tableIdLength + 1}`}</BranchNum>
                    <Sequence>{getSequence(SelectIdTypes.B, i)}</Sequence>
                  </div>
                );
              })}
            </Format>
            {/** 凡例 */}
            <Legend>
              <TableId>
                <Symbol>T</Symbol>
                <span>
                  {t(
                    'pages:MapEditorLocationDisplayFormatSetting.selectId.legend.tableId'
                  )}
                </span>
              </TableId>
              <BranchNum>
                <Symbol>B</Symbol>
                <span>
                  {t(
                    'pages:MapEditorLocationDisplayFormatSetting.selectId.legend.branchNum'
                  )}
                </span>
              </BranchNum>
            </Legend>
          </SelectId>
          {/** 注意 */}
          <Caution>
            <p>
              {t('pages:MapEditorLocationDisplayFormatSetting.caution.label')}
            </p>
            {`${t(
              'pages:MapEditorLocationDisplayFormatSetting.caution.description'
            )}`
              .split('\n')
              .map((text, i) => (
                <p key={i}>
                  <span>{text}</span>
                </p>
              ))}
          </Caution>
        </Content>
        <ModalCommands>
          <CancelButton onClick={props.onClickCancel}>
            {t('pages:MapEditorLocationDisplayFormatSetting.button.cancel')}
          </CancelButton>
          <SubmitButton onClick={props.onClickSubmit}>
            {t('pages:MapEditorLocationDisplayFormatSetting.button.submit')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
