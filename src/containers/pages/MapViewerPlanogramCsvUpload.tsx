import React, { useEffect, useState } from 'react';
import { actionHelper, uploadPlanogram } from '../../actions';
import { useAppDispatch } from '../../app/hooks';
import { MapViewerPlanogramCsvUpload as Component } from '../../components/pages';
import { useViewMapVersion } from '../../selectors';

import { useTranslation } from 'react-i18next';
import * as api from '../../api';
import { appModule } from '../../modules';
import { DialogTypes } from '../../types';

interface Props extends ReactModal.Props {}

/**
 * 棚割データ CSV 取込.
 *
 * @param props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const MapViewerPlanogramCsvUpload = (
  props: Props,
): React.ReactElement => {
  const { isOpen } = props;

  const dispatch = useAppDispatch();

  const [t] = useTranslation();

  const mapVersion = useViewMapVersion();

  const [uploadCsv, setUploadCsv] = useState<File | undefined>();
  const [errors, setErrors] = useState(new Map<string, string>());

  // ファイル選択押下
  const handleChangeUploadCsv = (file: File) => {
    setUploadCsv(file);
    return true;
  };

  // 閉じる押下
  const handleClickClose = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  // アップロード押下
  const handleClickSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    // 入力チェック
    const invalidSettings = (() => {
      const errors = new Map<string, string>();

      // アップロードファイル
      if (!uploadCsv) {
        errors.set(
          'uploadFile',
          t(
            'pages:MapViewerPlanogramCsvUpload.message.error.uploadFile.notSet',
          ),
        );
      }

      return errors;
    })();

    setErrors(invalidSettings);

    if (invalidSettings.size > 0) {
      dispatch(
        appModule.actions.updateAlertDialog({
          type: DialogTypes.ERROR,
          message: t('pages:MapViewerPlanogramCsvUpload.message.error.invalid'),
        }),
      );
      return;
    }

    dispatch(appModule.actions.updateLoading(true));

    const { jurisdictionClass, companyCode, storeCode } = mapVersion;

    const parameters = { jurisdictionClass, companyCode, storeCode };

    await dispatch(
      uploadPlanogram(
        parameters,
        uploadCsv as File,
        ({ data }: api.PlanogramUploadResult) => {
          dispatch(appModule.actions.updateLoading(false));

          if (!data) {
            console.error('Incorrect result.');
            return;
          }
          dispatch(
            appModule.actions.updateAlertDialog({
              type: DialogTypes.INFORMATION,
              message: t(
                'pages:MapViewerPlanogramCsvUpload.message.information.completed',
              ),
              positiveAction: () => handleClickClose(e),
            }),
          );
        },
        ({ e, result }) => {
          if (!result) {
            actionHelper.showErrorDialog(e, dispatch);
            return;
          }

          const { error } = result;
          dispatch(
            appModule.actions.updateAlertDialog({
              type: DialogTypes.ERROR,
              message: `${error}`,
            }),
          );

          dispatch(appModule.actions.updateLoading(false));
        },
      ),
    );
  };

  // 初期表示
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setUploadCsv(undefined);
  }, [isOpen]);

  return (
    <Component
      {...props}
      uploadCsv={uploadCsv}
      errors={errors}
      onChangeUploadCsv={handleChangeUploadCsv}
      onClickClose={handleClickClose}
      onClickSubmit={handleClickSubmit}
    ></Component>
  );
};
