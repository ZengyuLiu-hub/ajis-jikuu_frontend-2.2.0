import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CancelButton, InputFile, ItemLabel, SubmitButton } from '../atoms';
import {
  ModalCommands,
  ModalContent,
  ModalTemplate as Template,
} from '../templates';

const Wrapper = styled.section`
  min-width: 600px;
`;

const ErrorMessage = styled.span`
  color: rgba(255, 0, 0, 1);
`;

const Item = styled.div`
  display: flex;
  align-items: flex-start;

  > * + * {
    margin-left: 5px;
  }

  > span:first-child {
    min-width: 150px;
  }

  > span {
    margin-top: 3px;
  }
`;

const ItemValue = styled.div`
  > * + * {
    margin-left: 10px;
  }
`;

interface Props extends ReactModal.Props {
  /** アップロード CSV ファイル */
  uploadCsv: File | undefined;
  /** エラー情報 */
  errors: Map<string, string>;
  /** アップロード CSV ファイル選択押下 */
  onChangeUploadCsv(file: File): boolean;
  /** 閉じる押下 */
  onClickClose(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  /** アップロード押下 */
  onClickSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * 棚割データ CSV 取込.
 *
 * @param props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const MapViewerPlanogramCsvUpload = (
  props: Props,
): React.ReactElement => {
  const { errors } = props;

  const [t] = useTranslation();

  return (
    <Template
      {...props}
      title={t('pages:MapViewerPlanogramCsvUpload.title')}
      description={t('pages:MapViewerPlanogramCsvUpload.description')}
      onRequestClose={props.onClickClose}
      contentLabel="MapViewerPlanogramCsvUpload"
    >
      <Wrapper>
        <ModalContent>
          <Item>
            <ItemLabel
              label={`${t('pages:MapViewerPlanogramCsvUpload.csv.label')}`}
            />
            <ItemValue>
              <InputFile onFileSelection={props.onChangeUploadCsv}>
                {t('pages:MapViewerPlanogramCsvUpload.csv.selectFile')}
              </InputFile>
              <span>{props.uploadCsv?.name}</span>
            </ItemValue>
          </Item>
          {errors.has('uploadFile') && (
            <ErrorMessage>{errors.get('uploadFile')}</ErrorMessage>
          )}
        </ModalContent>
        <ModalCommands>
          <CancelButton onClick={props.onClickClose}>
            {t('pages:MapViewerPlanogramCsvUpload.button.cancel')}
          </CancelButton>
          <SubmitButton onClick={props.onClickSubmit}>
            {t('pages:MapViewerPlanogramCsvUpload.button.submit')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
