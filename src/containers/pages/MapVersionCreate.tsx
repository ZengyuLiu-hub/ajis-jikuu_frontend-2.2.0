import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DialogTypes, InventorySchedulesData, MapStore } from '../../types';
import {
  actionHelper,
  saveMapVersion,
  searchInventorySchedule,
  searchInventorySchedules,
} from '../../actions';
import * as api from '../../api';
import { useAppDispatch } from '../../app/hooks';
import { MapVersionCreate as Component } from '../../components/pages/MapVersionCreate';
import { appModule } from '../../modules';

const initialData = {
  zoneCode: '',
  doCode: '',
  inventoryDates: [''],
  note: '',
  rowVersion: 0,
};

const dropdownCodeItems = (entry: [string, string][]) => [
  { value: '', label: '----' },
  ...Array.from(new Map(entry).entries()).map(([key, value]) => ({
    value: key,
    label: value,
  })),
];
const dropdownDateItems = (value: Date[]) => [
  { value: '', label: '----' },
  ...Array.from(new Set(value).values()).map((value) => ({
    value: value,
    label: value,
  })),
];

export type MapCreateVersion = {
  mapId?: string;
  version?: number;
};

type MapData = {
  zoneCode?: string;
  doCode?: string;
  inventoryDates: string[];
  note?: string;
};

interface Props extends ReactModal.Props {
  onRequestCloseResearch: () => void;
  mapStore: MapStore;
  mapCreateVersion: () => MapCreateVersion;
  onViewEditor: (mapVersion: MapCreateVersion) => void;
}

/**
 * 版数作成
 *
 * @param props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const MapVersionCreate = (props: Props) => {
  const [t] = useTranslation();

  const dispatch = useAppDispatch();

  const { isOpen, mapStore, mapCreateVersion } = props;
  const mapVersion = mapCreateVersion();

  const [errors, setErrors] = useState(new Map<string, string>());
  const resetErrors = (errors = {}) =>
    setErrors(new Map<string, string>(Object.entries(errors)));

  const [inventorySchedules, setInventorySchedules] = useState<
    InventorySchedulesData[]
  >([]);
  const [selectableZones, setSelectableZones] = useState<any[]>([]);
  const [selectableDos, setSelectableDos] = useState<any[]>([]);
  const [selectableInventoryDates, setSelectableInventoryDates] = useState<
    any[]
  >([]);
  // 入力項目
  const [zoneCode, setZoneCode] = useState(initialData.zoneCode);
  const [doCode, setDoCode] = useState(initialData.doCode);
  const [inventoryDates, setInventoryDates] = useState<string[]>(
    initialData.inventoryDates,
  );
  const [note, setNote] = useState<string>(initialData.note);
  const [rowVersion, setRowVersion] = useState<number>(initialData.rowVersion);
  const [initMapData, setInitMapData] = useState<MapData>();

  const updateInventoryDates = (index: number, ...value: string[]) => {
    const dates = [...inventoryDates];
    dates.splice(index, 1, ...value);
    setInventoryDates(dates);
  };

  // キャンセルボタン押下
  const cancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  const hasDifferenceMap = (updateMapData: MapData) => {
    const sortedInitData = initMapData?.inventoryDates?.slice().sort();
    const sortedUpdateData: string[] = Array.from(
      new Set(updateMapData.inventoryDates),
    ).sort();
    return (
      updateMapData.zoneCode !== initMapData?.zoneCode ||
      updateMapData.doCode !== initMapData?.doCode ||
      !(
        sortedInitData?.length === sortedUpdateData.length &&
        sortedInitData?.every((v, i) => sortedUpdateData[i] === v)
      ) ||
      updateMapData.note !== initMapData?.note
    );
  };

  // エディタ表示ボタン押下
  const viewEditor = async () => {
    const { mapId } = mapVersion;
    if (mapId) {
      if (
        hasDifferenceMap({
          zoneCode,
          doCode,
          inventoryDates,
          note,
        })
      ) {
        dispatch(appModule.actions.updateLoading(true));

        // 保存処理
        await executeSave().then((data) => {
          dispatch(appModule.actions.updateLoading(false));
          props.onViewEditor(data);
        });
        return;
      }

      props.onViewEditor(mapVersion);
      return;
    }

    dispatch(appModule.actions.updateLoading(true));

    // 保存処理
    await executeSave().then((data) => {
      dispatch(appModule.actions.updateLoading(false));
      props.onViewEditor(data);
    });
  };

  // 保存ボタン押下
  const save = async () => {
    dispatch(appModule.actions.updateLoading(true));

    // 保存処理
    await executeSave().then(() => {
      dispatch(appModule.actions.updateLoading(false));
      props.onRequestCloseResearch();
    });
  };

  // 保存処理
  const executeSave = async (): Promise<MapCreateVersion> => {
    return new Promise((resolve, reject) => {
      const parameter: api.MapVersionSaveCondition = {
        ...mapStore,
        inventoryDates,
        zoneCode,
        doCode,
        note,
        rowVersion,
        ...mapVersion,
      };
      dispatch(
        saveMapVersion(
          parameter,
          ({ data }) => {
            if (!data.mapId || !data.version) {
              console.error('Incorrect result.');
              return;
            }
            dispatch(
              appModule.actions.updateAlertDialog({
                type: DialogTypes.INFORMATION,
                message: t(
                  'pages:MapVersionCreate.message.information.completed',
                ),
                positiveAction: () => resolve(data),
              }),
            );
          },
          ({ e, result }) => {
            if (result) {
              const { error, errors } = result;
              if (errors) {
                resetErrors(errors);
              } else {
                dispatch(
                  appModule.actions.updateAlertDialog({
                    type: DialogTypes.ERROR,
                    message: `${error}`,
                    positiveAction: () => {},
                  }),
                );
              }

              dispatch(appModule.actions.updateLoading(false));
            } else {
              actionHelper.showErrorDialog(e, dispatch);
            }
          },
        ),
      );
    });
  };

  const resetState = () => {
    setSelectableInventoryDates(dropdownCodeItems([]));
    setSelectableDos(dropdownCodeItems([]));
    setSelectableZones(dropdownCodeItems([]));
    setZoneCode(initialData.zoneCode);
    setDoCode(initialData.doCode);
    setInventoryDates(initialData.inventoryDates);
    setNote(initialData.note);
    setRowVersion(initialData.rowVersion);
  };

  // DO コード変更
  useEffect(() => {
    // 棚卸日の選択肢を構築
    const selectedZone = zoneCode;
    const selectedDo = doCode;
    setSelectableInventoryDates(
      dropdownDateItems(
        inventorySchedules
          .filter(
            ({ zoneCode, doCode }) =>
              zoneCode === selectedZone && doCode === selectedDo,
          )
          .map(({ inventoryDate }) => inventoryDate),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doCode]);

  // ゾーンコード変更
  useEffect(() => {
    if (zoneCode === initialData.zoneCode) {
      setSelectableInventoryDates(dropdownCodeItems([]));
    }
    // DO の選択肢を構築
    const selectedZone = zoneCode;
    setSelectableDos(
      dropdownCodeItems(
        inventorySchedules
          .filter(({ zoneCode }) => zoneCode === selectedZone)
          .map(({ doCode, doName }) => [doCode, doName]),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoneCode]);

  // 棚卸日変更
  useEffect(() => {
    if (inventorySchedules.length === 0) {
      setSelectableInventoryDates(dropdownCodeItems([]));
      setSelectableDos(dropdownCodeItems([]));
    }
    // ゾーンの選択肢を構築
    setSelectableZones(
      dropdownCodeItems(
        inventorySchedules.map(({ zoneCode, zoneName }) => [
          zoneCode,
          zoneName,
        ]),
      ),
    );

    const { mapId, version } = mapVersion;
    if (!mapId || !version) {
      return;
    }

    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      // 保存済みの棚卸スケジュールを取得
      await dispatch(
        searchInventorySchedule(
          { mapId, version },
          ({
            data: { zoneCode, doCode, inventoryDates } = initialData,
            mapVersion: { note = initialData.note, rowVersion } = initialData,
          }) => {
            setZoneCode(zoneCode);
            setDoCode(doCode);
            setInventoryDates(inventoryDates);
            setNote(note);
            setInitMapData({
              zoneCode,
              doCode,
              inventoryDates,
              note,
            });
            setRowVersion(rowVersion);

            dispatch(appModule.actions.updateLoading(false));
          },
        ),
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventorySchedules]);

  useEffect(() => {
    if (!isOpen) {
      resetState();
      return;
    }

    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      // 選択肢の棚卸スケジュールを取得
      const { mapId, version } = mapVersion;
      if (!mapId || !version) {
        await dispatch(
          searchInventorySchedules({ ...mapStore }, ({ data }) => {
            setInventorySchedules(data);
            dispatch(appModule.actions.updateLoading(false));
          }),
        );
        return;
      }

      await dispatch(
        searchInventorySchedules(
          { ...mapStore, mapId, version },
          ({ data }) => {
            setInventorySchedules(data);
            dispatch(appModule.actions.updateLoading(false));
          },
        ),
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Component
      {...props}
      onClickCancel={cancel}
      onClickViewEditor={viewEditor}
      onClickMinus={(index, e) =>
        inventoryDates.length === 1
          ? updateInventoryDates(index, '')
          : updateInventoryDates(index)
      }
      onClickPlus={(e) => setInventoryDates([...inventoryDates, ''])}
      onClickSave={save}
      onChangeZoneCode={(e) => {
        setZoneCode(e.target.value);
        setDoCode(initialData.doCode);
        setInventoryDates(initialData.inventoryDates);
      }}
      onChangeDoCode={(e) => {
        setDoCode(e.target.value);
        setInventoryDates(initialData.inventoryDates);
      }}
      onChangeNote={(e) => setNote(e.target.value)}
      onChangeInventoryDate={(index, e) =>
        updateInventoryDates(index, e.target.value)
      }
      zoneCode={zoneCode}
      doCode={doCode}
      inventoryDates={inventoryDates}
      note={note}
      selectableZones={selectableZones}
      selectableDos={selectableDos}
      selectableInventoryDates={selectableInventoryDates}
      errors={errors}
    />
  );
};
