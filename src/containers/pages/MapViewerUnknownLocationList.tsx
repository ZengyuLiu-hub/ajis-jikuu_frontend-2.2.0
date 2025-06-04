import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import * as RV from 'react-virtualized';

import { CountLocation } from '../../types';
import { useAppDispatch } from '../../app/hooks';

import { appModule } from '../../modules';
import { useViewMapVersion } from '../../selectors';
import { actionHelper, getCountLocation } from '../../actions';

import { MapViewerUnknownLocationList as Component } from '../../components/pages/MapViewerUnknownLocationList';

interface Props extends ReactModal.Props {}

/**
 * レイアウトマップに存在しないロケーション一覧.
 *
 * @param props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const MapViewerUnknownLocationList = (props: Props) => {
  const { isOpen } = props;

  const [t] = useTranslation();

  const dispatch = useAppDispatch();

  const mapVersion = useViewMapVersion();

  const [unknownLocations, setUnknownLocations] = useState<CountLocation[]>([]);

  const handleClickClose = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  const columns: RV.ColumnProps[] = [
    {
      label: t('pages:MapViewerUnknownLocationList.dataTable.areaId.label'),
      dataKey: 'areaId',
      cellDataGetter: ({ rowData }: any) => rowData.areaId,
      width: 200,
    },
    {
      label: t(
        'pages:MapViewerUnknownLocationList.dataTable.locationNum.label',
      ),
      dataKey: 'locationNum',
      cellDataGetter: ({ rowData }: any) => rowData.locationNum,
      width: 200,
    },
  ];

  // 初期表示処理
  useEffect(() => {
    if (!isOpen) {
      setUnknownLocations([]);
      return;
    }

    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      const { jurisdictionClass, companyCode, storeCode, inventorySchedule } =
        mapVersion;
      await dispatch(
        getCountLocation(
          {
            jurisdictionClass,
            companyCode,
            storeCode,
            inventoryDates: inventorySchedule?.inventoryDates ?? [],
          },
          ({ data }) => {
            setUnknownLocations(data.filter(({ onlyTt }) => onlyTt));

            dispatch(appModule.actions.updateLoading(false));
          },
          ({ e }) => actionHelper.showErrorDialog(e, dispatch),
        ),
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Component
      isOpen={isOpen}
      columns={columns}
      data={unknownLocations}
      onClickClose={handleClickClose}
    ></Component>
  );
};
