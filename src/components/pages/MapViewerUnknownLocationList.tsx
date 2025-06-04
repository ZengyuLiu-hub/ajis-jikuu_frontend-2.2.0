import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import * as RV from 'react-virtualized';
import styled from 'styled-components';
import { DataTable } from '../../containers/atoms';
import { CountLocation } from '../../types';
import { CancelButton } from '../atoms';
import {
  ModalCommands,
  ModalContent,
  ModalTemplate as Template,
} from '../templates';

const Wrapper = styled.section`
  min-width: 400px;
`;

const Content = styled(ModalContent)`
  height: 400px;
`;

const Commands = styled(ModalCommands)`
  justify-content: center;
`;

const SearchResultContent = styled.div`
  display: flex;
  overflow: auto;
  padding: 0 15px;
  height: 500px;
`;

interface Props extends ReactModal.Props {
  /** 項目定義 */
  columns: RV.ColumnProps[];
  /** データ */
  data: CountLocation[];
  /** 閉じる押下 */
  onClickClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * レイアウトマップに存在しないロケーション一覧.
 *
 * @param props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const MapViewerUnknownLocationList = (props: Props) => {
  const [t] = useTranslation();

  const resultContent = (
    <DataTable
      headerHeight={40}
      rowHeight={34}
      columns={props.columns}
      data={props.data}
    />
  );

  return (
    <Template
      {...props}
      title={t('pages:MapViewerUnknownLocationList.title')}
      onRequestClose={props.onClickClose}
      contentLabel="MapViewerUnknownLocationList"
    >
      <Wrapper>
        <Content>
          <SearchResultContent>{resultContent}</SearchResultContent>
        </Content>
        <Commands>
          <CancelButton onClick={props.onClickClose}>
            {t('pages:MapViewerUnknownLocationList.command.close')}
          </CancelButton>
        </Commands>
      </Wrapper>
    </Template>
  );
};
