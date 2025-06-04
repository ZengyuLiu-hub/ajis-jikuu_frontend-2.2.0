import { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { CancelButton, CheckBox, SubmitButton } from '../atoms';
import {
  ModalTemplate as Template,
  ModalContent,
  ModalCommands,
} from '../templates';
import { Layout } from '../../types';

const Wrapper = styled.section`
  min-width: 500px;
  max-width: 800px;
`;

const Content = styled(ModalContent)`
  padding-top: 10px;
  min-height: 100px;
`;

const Item = styled.div`
  display: grid;
  row-gap: 15px;
  padding-left: 50px;
`;

const ItemRow = styled.div`
  &.select-all {
    padding-bottom: 10px;
    border-bottom: 1px solid rgb(200, 200, 200);
  }
`;

export type Condition = {
  /** レイアウトID */
  layoutIds: string[];
};

interface Props extends ReactModal.Props {
  /** 検索条件 */
  condition: Condition;
  /** 検索条件イベント */
  conditionEvent: Dispatch<any>;
  /** 選択可能なレイアウト */
  selectableLayouts: Layout[];
  /** 全選択 */
  onChangeSelectAll(e: React.ChangeEvent<HTMLInputElement>): void;
  /** キャンセル */
  onClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  /** 反映 */
  onClickSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  /** 閉じる */
  onClickClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * ロケーション CSV 出力.
 */
export const MapEditorLocationCsvOutput = (props: Props) => {
  const { condition, conditionEvent } = props;

  const [t] = useTranslation();

  return (
    <Template
      {...props}
      title={t('pages:MapEditorLocationCsvOutput.title')}
      description={`${t('pages:MapEditorLocationCsvOutput.description')}`}
      onRequestClose={props.onClickCancel}
      contentLabel="MapEditorLocationCsvOutput"
    >
      <Wrapper>
        <Content>
          {/** レイアウト */}
          <Item
            style={{
              gridTemplateRows: `1fr${' 1fr'.repeat(
                props.selectableLayouts.length
              )}`,
            }}
          >
            <ItemRow className="select-all">
              <CheckBox
                label={t('pages:MapEditorLocationCsvOutput.selectAll.label')}
                onChange={props.onChangeSelectAll}
                checked={
                  condition.layoutIds.length === props.selectableLayouts.length
                }
              />
            </ItemRow>
            {props.selectableLayouts.map(({ layoutId, layoutName }, index) => (
              <ItemRow key={index}>
                <CheckBox
                  value={layoutId}
                  label={layoutName}
                  onChange={(e) =>
                    e.target.checked
                      ? conditionEvent({
                          layoutIds: [...condition.layoutIds, e.target.value],
                        })
                      : conditionEvent({
                          layoutIds: [
                            ...condition.layoutIds.filter(
                              (id) => id !== layoutId
                            ),
                          ],
                        })
                  }
                  checked={condition.layoutIds.includes(layoutId)}
                />
              </ItemRow>
            ))}
          </Item>
        </Content>
        <ModalCommands>
          <CancelButton onClick={props.onClickCancel}>
            {t('pages:MapEditorLocationCsvOutput.button.cancel')}
          </CancelButton>
          <SubmitButton
            onClick={props.onClickSubmit}
            disabled={condition.layoutIds.length === 0}
          >
            {t('pages:MapEditorLocationCsvOutput.button.submit')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
