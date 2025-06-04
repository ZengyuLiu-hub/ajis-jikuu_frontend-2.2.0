import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import * as RV from 'react-virtualized';
import styled from 'styled-components';

import { ShapeData } from '../../types';

import {
  useAreaIdLength,
  useBranchNumLength,
  useCustomFormats,
  useDefaultFontSize,
  useLocationDisplayFormatType,
  useTableIdLength,
} from '../../selectors';

import { CheckBox, Dropdown, InputText } from '../../components/atoms';
import {
  MapEditorLocationList as Component,
  Condition,
  ConditionEvent,
} from '../../components/pages/MapEditorLocationList';
import * as editorConstants from '../../constants/editor';
import { EditorUtil } from '../../utils/EditorUtil';

const CellMeasurer =
  RV.CellMeasurer as unknown as React.FC<RV.CellMeasurerProps>;

const LabelCell = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  height: 100%;

  > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    font-size: 11pt;
  }
`;

const InputTextCell = styled(LabelCell)`
  > input {
    min-width: 50px;
    width: 100%;
  }
`;

const CheckBoxCell = styled(LabelCell)``;

const DropdownCell = styled(LabelCell)``;

const Checked = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  &.checked::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: transparent;
    background-position: center center;
    background-repeat: no-repeat;
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%232329D6' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%232329D6'%3E%3Cpolyline points='4 13 9 18 20 7'/%3E%3C/svg%3E");
    background-size: 15px 15px;
  }
`;

interface Props extends ReactModal.Props {
  nodeConfigList: any[];
  onSuccess(newConfigList: any[]): void;
}

/**
 * ロケーション一覧
 */
export const MapEditorLocationList = (props: Props) => {
  const { isOpen } = props;

  const CELL_PADDING_WIDTH = 4 * 2;

  const [t] = useTranslation();

  const areaIdLength = useAreaIdLength();
  const tableIdLength = useTableIdLength();
  const branchNumLength = useBranchNumLength();

  const formatType = useLocationDisplayFormatType();
  const customFormats = useCustomFormats();
  const defaultFontSize = useDefaultFontSize();

  const [oldNodes, setOldNodes] = useState<any[]>([]);
  const [nodes, setNodes] = useState<any[]>([]);
  const [filteredNodes, setFilteredNodes] = useState<any[]>([]);
  const [changingNodes, setChangingNodes] = useState<Set<string>>(new Set());

  const [countOfArea, setCountOfArea] = useState(0);
  const [countOfTable, setCountOfTable] = useState(0);
  const [countOfLocation, setCountOfLocation] = useState(0);
  const [countOfMissingNumber, setCountOfMissingNumber] = useState(0);
  const [countOfEmptyNumber, setCountOfEmptyNumber] = useState(0);

  const [areaId, setAreaId] = useState('');
  const [areaIdOption, setAreaIdOption] = useState('UNSPECIFIED');
  const [tableIdFrom, setTableIdFrom] = useState('');
  const [tableIdTo, setTableIdTo] = useState('');
  const [locationNumFrom, setLocationNumFrom] = useState('');
  const [locationNumTo, setLocationNumTo] = useState('');
  const [ignoreLocation, setIgnoreLocation] = useState('NONE');
  const [showFullLocationNum, setShowFullLocationNum] = useState('NONE');
  const [text, setText] = useState('');
  const [remarks, setRemarks] = useState('');
  const [changingStatus, setChangingStatus] = useState('NONE');
  const [operationMode, setOperationMode] = useState('VIEW');

  const [maximizedModal, setMaximizedModal] = useState(false);

  const [reSearch, setReSearch] = useState(false);

  const handleChangeAreaId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAreaId(e.target.value);
    setAreaIdOption('SPECIFIED');
  };

  const handleChangeAreaIdOption = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAreaIdOption(e.target.value);

  const handleChangeTableIdFrom = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTableIdFrom(e.target.value);

  const handleChangeTableIdTo = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTableIdTo(e.target.value);

  const handleChangeLocationNumFrom = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setLocationNumFrom(e.target.value);

  const handleChangeLocationNumTo = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLocationNumTo(e.target.value);

  const handleChangeIgnoreLocation = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIgnoreLocation(e.target.value);

  const handleChangeShowFullLocationNum = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setShowFullLocationNum(e.target.value);

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) =>
    setText(e.target.value);

  const handleChangeRemarks = (e: React.ChangeEvent<HTMLInputElement>) =>
    setRemarks(e.target.value);

  const handleChangeChangingStatus = (e: React.ChangeEvent<HTMLInputElement>) =>
    setChangingStatus(e.target.value);

  const handleChangeOperationMode = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setOperationMode(e.target.value);

    // 表示モードに変更した場合はソートを実行
    if (e.target.value === 'VIEW') {
      executeSearch();
    }
  };

  const [bulkShowFullLocationNum, setBulkShowFullLocationNum] = useState(false);
  const [bulkAreaId, setBulkAreaId] = useState('');
  const [bulkIgnoreLocation, setBulkIgnoreLocation] = useState<string>(
    editorConstants.IGNORE_LOCATION_ITEM_UNSELECT,
  );
  const [bulkTableId, setBulkTableId] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [bulkFontSize, setBulkFontSize] = useState(defaultFontSize);
  const [bulkRemarks, setBulkRemarks] = useState('');
  const [selectedBulkIgnoreLocation, setSelectedBulkIgnoreLocation] =
    useState(false);
  const [selectedBulkAreaId, setSelectedBulkAreaId] = useState(false);
  const [selectedBulkTableId, setSelectedBulkTableId] = useState(false);
  const [selectedBulkText, setSelectedBulkText] = useState(false);
  const [selectedBulkFontSize, setSelectedBulkFontSize] = useState(false);
  const [selectedBulkRemarks, setSelectedBulkRemarks] = useState(false);

  // 更新フィールドを取得
  const getChangeFields = (newConfig: any) => {
    const oldConfig = oldNodes.find((d) => d.uuid === newConfig.uuid);
    if (!oldConfig) {
      return [];
    }

    const changeFields: string[] = [];
    Object.keys(oldConfig).forEach((key) => {
      if (newConfig[key] !== oldConfig[key]) {
        changeFields.push(key);
      }
    });
    return changeFields;
  };

  // 一括更新
  const bulkUpdate = (bulkData: any) => {
    const newChangingNodes = new Set(changingNodes);

    const newFilteredNodes = filteredNodes.map((current) => {
      const newConfig = { ...current, ...bulkData };

      // 変更有無チェック
      const changeFields = getChangeFields(newConfig);
      if (changeFields.length === 0) {
        newChangingNodes.delete(current.uuid);
      } else {
        newChangingNodes.add(current.uuid);
      }
      return newConfig;
    });

    // 表示中のデータに反映
    setNodes((prev) =>
      prev.map((d1) => {
        const newConfig = newFilteredNodes.find((d2) => d2.uuid === d1.uuid);
        if (newConfig) {
          return newConfig;
        }
        return d1;
      }),
    );
    setFilteredNodes(newFilteredNodes);

    // 反映待ちを更新
    setChangingNodes(newChangingNodes);
  };

  // 一括変更：フル桁変更イベント処理
  const handleChangeBulkShowFullLocationNum = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { checked } = e.target;
    setBulkShowFullLocationNum(checked);

    // 一括更新
    bulkUpdate({ showFullLocationNum: checked });
  };

  // 一括変更：除外変更イベント処理
  const handleChangeBulkIgnoreLocation = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (
      e.target.value === editorConstants.IGNORE_LOCATION_ITEM_MISSING_NUMBER
    ) {
      setBulkIgnoreLocation(e.target.value);
    } else if (
      e.target.value === editorConstants.IGNORE_LOCATION_ITEM_EMPTY_NUMBER
    ) {
      setBulkIgnoreLocation(e.target.value);
    } else {
      setBulkIgnoreLocation(e.target.value);
    }
  };

  // 一括変更：エリア変更イベント処理
  const handleChangeBulkAreaId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBulkAreaId(e.target.value);
  };

  // 一括変更：テーブル変更イベント処理
  const handleChangeBulkTableId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBulkTableId(e.target.value);
  };

  // 一括変更：テキスト変更イベント処理
  const handleChangeBulkText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBulkText(e.target.value);
  };

  // 一括変更：フォントサイズ変更イベント処理
  const handleChangeBulkFontSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBulkFontSize(Number(e.target.value));
  };

  // 一括変更：メモ変更イベント処理
  const handleChangeBulkRemarks = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBulkRemarks(e.target.value);
  };

  // 一括変更列選択：除外
  const handleChangeSelectedBulkIgnoreLocation = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSelectedBulkIgnoreLocation(e.target.checked);
  };

  // 一括変更列選択：エリアID
  const handleChangeSelectedBulkAreaId = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSelectedBulkAreaId(e.target.checked);
  };

  // 一括変更列選択：テーブルID列
  const handleChangeSelectedBulkTableId = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSelectedBulkTableId(e.target.checked);
  };

  // 一括変更列選択：テキスト列
  const handleChangeSelectedBulkText = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSelectedBulkText(e.target.checked);
  };

  // 一括変更列選択：フォントサイズ
  const handleChangeSelectedBulkFontSize = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSelectedBulkFontSize(e.target.checked);
  };

  // 一括変更列選択：メモ列
  const handleChangeSelectedBulkRemarks = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSelectedBulkRemarks(e.target.checked);
  };

  // 一括変更ボタン押下処理
  const handleClickBulkChange = () => {
    const bulkData: any = {};

    // 除外
    if (selectedBulkIgnoreLocation) {
      bulkData.ignoreLocation = bulkIgnoreLocation;
      if (
        bulkIgnoreLocation ===
        editorConstants.IGNORE_LOCATION_ITEM_MISSING_NUMBER
      ) {
        bulkData.missingNumber = true;
        bulkData.emptyNumber = false;
      } else if (
        bulkIgnoreLocation === editorConstants.IGNORE_LOCATION_ITEM_EMPTY_NUMBER
      ) {
        bulkData.missingNumber = false;
        bulkData.emptyNumber = true;
      } else {
        bulkData.missingNumber = false;
        bulkData.emptyNumber = false;
      }
    }

    // エリアID
    if (selectedBulkAreaId) {
      bulkData.areaId = bulkAreaId;
    }

    // テーブルID
    if (selectedBulkTableId) {
      bulkData.tableId = bulkTableId;
    }

    // テキスト
    if (selectedBulkText) {
      bulkData.text = bulkText;
    }

    // フォントサイズ
    if (selectedBulkFontSize) {
      bulkData.fontSize = bulkFontSize;
    }

    // メモ
    if (selectedBulkRemarks) {
      bulkData.remarks = bulkRemarks;
    }

    // 変更がない場合は終了
    if (Object.keys(bulkData).length === 0) {
      return;
    }

    // 一括更新
    bulkUpdate(bulkData);
  };

  // 指定の条件で検索を実行します
  const executeSearch = () => {
    const filtered = Array.from(nodes.values())
      .filter((node) =>
        showFullLocationNum === 'NONE'
          ? true
          : showFullLocationNum === 'SHOW'
            ? node.showFullLocationNum === true
            : node.showFullLocationNum === false,
      )
      .filter((node) => {
        if (ignoreLocation === 'NONE') {
          return true;
        } else if (ignoreLocation === 'MISSING') {
          return node.missingNumber;
        } else if (ignoreLocation === 'EMPTY') {
          return node.emptyNumber;
        }
        return true;
      })
      .filter((node) =>
        changingStatus === 'NONE'
          ? true
          : changingStatus === 'WAIT'
            ? changingNodes.has(node.uuid)
            : false,
      )
      .filter((node) =>
        areaIdOption === 'UNSPECIFIED' ? true : node.areaId === areaId,
      )
      .filter((node) => {
        if (tableIdFrom && tableIdTo) {
          return tableIdFrom <= node.tableId && tableIdTo >= node.tableId;
        } else if (tableIdFrom && !tableIdTo) {
          return tableIdFrom <= node.tableId;
        } else if (!tableIdFrom && tableIdTo) {
          return tableIdTo >= node.tableId;
        }
        return true;
      })
      .filter((node) => {
        if (locationNumFrom && locationNumTo) {
          return (
            locationNumFrom <= node.locationNum &&
            locationNumTo >= node.locationNum
          );
        } else if (locationNumFrom && !locationNumTo) {
          return locationNumFrom <= node.locationNum;
        } else if (!locationNumFrom && locationNumTo) {
          return locationNumTo >= node.locationNum;
        }
        return true;
      })
      .filter((node) => (text ? node.text.includes(text) : true))
      .filter((node) => (remarks ? node.remarks.includes(remarks) : true))
      .sort((a, b) => {
        if (a.locationNum && b.locationNum) {
          if (a.locationNum < b.locationNum) {
            return -1;
          }
          if (a.locationNum > b.locationNum) {
            return 1;
          }
        }
        return 0;
      });

    // 表示用データ
    const format: any[] = [];
    filtered.forEach((node) => {
      let ignoreLocation;
      if (node.missingNumber) {
        ignoreLocation = editorConstants.IGNORE_LOCATION_ITEM_MISSING_NUMBER;
      } else if (node.emptyNumber) {
        ignoreLocation = editorConstants.IGNORE_LOCATION_ITEM_EMPTY_NUMBER;
      } else {
        ignoreLocation = editorConstants.IGNORE_LOCATION_ITEM_UNSELECT;
      }
      format.push({ ...node, ignoreLocation });
    });

    setFilteredNodes(format);
  };

  // 検索ボタン押下処理
  const handleClickSearch = () => executeSearch();

  // 条件クリアボタン押下処理
  const handleClickClearSearchCondition = () => clearCondition();

  // モーダル最大化押下
  const handleChangeMaximizedModal = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMaximizedModal(e.target.checked);

  // 検索条件を初期化します
  const clearCondition = () => {
    setAreaId('');
    setAreaIdOption('UNSPECIFIED');
    setTableIdFrom('');
    setTableIdTo('');
    setLocationNumFrom('');
    setLocationNumTo('');
    setIgnoreLocation('NONE');
    setShowFullLocationNum('NONE');
    setText('');
    setRemarks('');
    setChangingStatus('NONE');
    setOperationMode('VIEW');
  };

  // 一括反映の内容を初期化します
  const clearBulkInputs = () => {
    setBulkShowFullLocationNum(false);
    setBulkIgnoreLocation('');
    setBulkAreaId('');
    setBulkTableId('');
    setBulkText('');
    setBulkFontSize(defaultFontSize);
    setBulkRemarks('');

    setSelectedBulkIgnoreLocation(false);
    setSelectedBulkAreaId(false);
    setSelectedBulkTableId(false);
    setSelectedBulkText(false);
    setSelectedBulkFontSize(false);
    setSelectedBulkRemarks(false);
  };

  // 状態をリセットします
  const resetState = () => {
    clearCondition();
    clearBulkInputs();

    setChangingNodes(new Set());

    setReSearch(true);
    setNodes([...props.nodeConfigList]);
    setOldNodes([...props.nodeConfigList]);

    setMaximizedModal(false);
  };

  // とじるボタン押下処理
  const executeClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  // キャンセルボタン押下処理
  const executeCancel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    executeClose(e);
  };

  // 反映ボタン押下処理
  const executeSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    const result: any[] = [];
    if (changingNodes.size > 0) {
      changingNodes.forEach((id) => {
        const node = nodes.find((d) => d.uuid === id);
        if (node) {
          const config: any = { ...node };
          const { tableId, branchNum } = config;
          const locationNum = `${tableId}${branchNum}`;
          const displayLocationNum = EditorUtil.generateDisplayLocationNum(
            locationNum,
            formatType,
            customFormats,
          );
          // 編集画面表示用のプロパティを削除
          if (config.hasOwnProperty('ignoreLocation')) {
            delete config.ignoreLocation;
          }
          result.push({ ...config, locationNum, displayLocationNum });
        }
      });
    }
    props.onSuccess(result);

    executeClose(e);
  };

  // キャッシュ
  const cache = new RV.CellMeasurerCache({
    defaultWidth: 100,
    minWidth: 75,
    fixedHeight: true,
  });

  // 値の変更時、反映待ち処理を実行します.
  const handleChangeTextValue = (newNode: any) => {
    // 変更前の状態を取得
    const prevNode = nodes.find((d) => d.uuid === newNode.uuid);
    if (!prevNode) {
      return;
    }

    // 変更フィールドを取得
    const diffFields: string[] = [];
    Object.keys(newNode).forEach((key) => {
      if (newNode[key] !== prevNode[key]) {
        diffFields.push(key);
      }
    });

    // 変更がない場合は終了
    if (diffFields.length === 0) {
      return;
    }

    // 既に更新済みの場合は終了
    const excluded = diffFields
      .map((name) => (prevNode[name] !== newNode[name] ? name : undefined))
      .filter(Boolean);
    if (excluded.length === 0) {
      return;
    }

    // ロケーションリスト更新
    setNodes((prev) =>
      prev.map((d) => {
        if (d.uuid === newNode.uuid) {
          return newNode;
        }
        return d;
      }),
    );
    setFilteredNodes((prev) =>
      prev.map((d) => {
        if (d.uuid === newNode.uuid) {
          return newNode;
        }
        return d;
      }),
    );

    // 画面表示直後の状態を取得
    const oldNode: any = oldNodes.find((d) => d.uuid === newNode.uuid);
    if (!oldNode) {
      return;
    }

    // 画面表示直後と比較
    const changeFields: string[] = [];
    Object.keys(oldNode).forEach((key) => {
      if (oldNode[key] !== newNode[key]) {
        changeFields.push(key);
      }
    });

    // 画面表示直後と変わらない場合は、反映待ちから削除
    const newChangingNodes = new Set(changingNodes);
    if (changeFields.length === 0) {
      if (newChangingNodes.has(newNode.uuid)) {
        newChangingNodes.delete(newNode.uuid);
        setChangingNodes(newChangingNodes);
      }
      return;
    }

    // 反映待ちを更新
    if (!newChangingNodes.has(newNode.uuid)) {
      newChangingNodes.add(newNode.uuid);
      setChangingNodes(newChangingNodes);
    }
  };

  // ロケーション番号
  const locationRenderer = (cellData: RV.TableCellProps) => {
    const { dataKey, parent, columnIndex, rowIndex, rowData } = cellData;

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}
      >
        <LabelCell>
          <span>{rowData.locationNum}</span>
        </LabelCell>
      </CellMeasurer>
    );
  };

  // エリア
  const areaIdRenderer = (cellData: RV.TableCellProps) => {
    const { dataKey, parent, columnIndex, rowIndex, rowData } = cellData;

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}
      >
        <InputTextCell>
          {operationMode === 'VIEW' ? (
            <span>{rowData.areaId}</span>
          ) : (
            <InputText
              valueMode="HALF_WIDTH_ALPHABET_AND_NUMBER"
              maxLength={areaIdLength}
              value={rowData.areaId}
              onBlur={(e) => {
                const { value } = e.target;

                const areaId =
                  value.length === 0
                    ? value
                    : `${value}`.padStart(areaIdLength, '0');

                handleChangeTextValue({ ...rowData, areaId });
              }}
            />
          )}
        </InputTextCell>
      </CellMeasurer>
    );
  };

  // テーブル
  const tableIdRenderer = (cellData: RV.TableCellProps) => {
    const { dataKey, parent, columnIndex, rowIndex, rowData } = cellData;

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}
      >
        <InputTextCell>
          {operationMode === 'VIEW' ? (
            <span>{rowData.tableId}</span>
          ) : (
            <InputText
              valueMode="HALF_WIDTH_NUMBER"
              maxLength={tableIdLength}
              value={rowData.tableId}
              onBlur={(e) => {
                const { value } = e.target;

                const tableId = `${value}`.padStart(tableIdLength, '0');

                handleChangeTextValue({ ...rowData, tableId });
              }}
            />
          )}
        </InputTextCell>
      </CellMeasurer>
    );
  };

  // 枝番
  const branchNumRenderer = (cellData: RV.TableCellProps) => {
    const { dataKey, parent, columnIndex, rowIndex, rowData } = cellData;

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}
      >
        <InputTextCell>
          {operationMode === 'VIEW' ? (
            <span>{rowData.branchNum}</span>
          ) : (
            <InputText
              valueMode="HALF_WIDTH_NUMBER"
              maxLength={branchNumLength}
              value={rowData.branchNum}
              onBlur={(e) => {
                const { value } = e.target;

                const branchNum = `${value}`.padStart(branchNumLength, '0');

                handleChangeTextValue({ ...rowData, branchNum });
              }}
            />
          )}
        </InputTextCell>
      </CellMeasurer>
    );
  };

  // チェックボックス
  const checkboxRenderer: RV.TableCellRenderer = (
    cellData: RV.TableCellProps,
  ) => {
    const { dataKey, parent, columnIndex, rowIndex, rowData } = cellData;

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}
      >
        {rowData.hasOwnProperty(dataKey) && (
          <CheckBoxCell>
            {operationMode === 'VIEW' ? (
              <Checked
                className={classNames({
                  checked: rowData[dataKey],
                })}
              ></Checked>
            ) : (
              <CheckBox
                checked={rowData[dataKey] as boolean}
                onChange={(e) => {
                  const newData: ShapeData = {
                    ...rowData,
                    [dataKey]: e.target.checked,
                  };
                  handleChangeTextValue(newData);
                }}
              />
            )}
          </CheckBoxCell>
        )}
      </CellMeasurer>
    );
  };

  const ignoreLocationItems = [
    {
      value: editorConstants.IGNORE_LOCATION_ITEM_UNSELECT,
      label: t('pages:MapEditorLocationList.ignoreLocationItems.unselect'),
    },
    {
      value: editorConstants.IGNORE_LOCATION_ITEM_MISSING_NUMBER,
      label: t('pages:MapEditorLocationList.ignoreLocationItems.missingNumber'),
    },
    {
      value: editorConstants.IGNORE_LOCATION_ITEM_EMPTY_NUMBER,
      label: t('pages:MapEditorLocationList.ignoreLocationItems.emptyNumber'),
    },
  ];

  /**
   * 除外ロケーションタイプの選択イベント.
   */
  const handleChangeIgnoreLocationItems = (rowData: any[], value: string) => {
    if (value === editorConstants.IGNORE_LOCATION_ITEM_MISSING_NUMBER) {
      handleChangeTextValue({
        ...rowData,
        missingNumber: true,
        emptyNumber: false,
        ignoreLocation: value,
      });
    } else if (value === editorConstants.IGNORE_LOCATION_ITEM_EMPTY_NUMBER) {
      handleChangeTextValue({
        ...rowData,
        missingNumber: false,
        emptyNumber: true,
        ignoreLocation: value,
      });
    } else {
      handleChangeTextValue({
        ...rowData,
        missingNumber: false,
        emptyNumber: false,
        ignoreLocation: value,
      });
    }
  };

  const dropdownRenderer: RV.TableCellRenderer = (
    cellData: RV.TableCellProps,
  ) => {
    const { dataKey, parent, columnIndex, rowIndex, rowData } = cellData;

    const value = rowData[dataKey];

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}
      >
        {rowData.hasOwnProperty(dataKey) && (
          <DropdownCell>
            {operationMode === 'VIEW' ? (
              <span title={value}>
                {t(`pages:MapEditorLocationList.ignoreLocationItems.${value}`)}
              </span>
            ) : (
              <Dropdown
                items={ignoreLocationItems}
                valueField="value"
                labelField="label"
                onChange={(e) => {
                  e.stopPropagation();
                  handleChangeIgnoreLocationItems(rowData, e.target.value);
                }}
                value={value}
              />
            )}
          </DropdownCell>
        )}
      </CellMeasurer>
    );
  };

  // テキスト
  const textRenderer = (cellData: RV.TableCellProps) => {
    const { dataKey, parent, columnIndex, rowIndex, rowData } = cellData;

    const value = rowData[dataKey];
    const child = parent.props.children[columnIndex];
    const { width } = child.props;

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}
      >
        <InputTextCell style={{ width: `${width - CELL_PADDING_WIDTH}px` }}>
          {operationMode === 'VIEW' ? (
            <span title={value}>{value}</span>
          ) : (
            <InputText
              maxLength={255}
              value={value}
              onBlur={(e) => {
                handleChangeTextValue({
                  ...rowData,
                  text: e.target.value,
                });
              }}
            />
          )}
        </InputTextCell>
      </CellMeasurer>
    );
  };

  // フォントサイズ
  const fontSizeRenderer = (cellData: RV.TableCellProps) => {
    const { dataKey, parent, columnIndex, rowIndex, rowData } = cellData;

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}
      >
        <InputTextCell>
          {operationMode === 'VIEW' ? (
            <span>{rowData.fontSize}</span>
          ) : (
            <InputText
              valueMode="HALF_WIDTH_NUMBER"
              min={editorConstants.FONT_SIZE_MIN}
              max={editorConstants.FONT_SIZE_MAX}
              value={rowData.fontSize}
              onBlur={(e) => {
                handleChangeTextValue({
                  ...rowData,
                  fontSize: Number(e.target.value),
                });
              }}
            />
          )}
        </InputTextCell>
      </CellMeasurer>
    );
  };

  // メモ
  const remarksRenderer = (cellData: RV.TableCellProps) => {
    const { dataKey, parent, columnIndex, rowIndex, rowData } = cellData;

    const value = rowData[dataKey];
    const child = parent.props.children[columnIndex];
    const { width } = child.props;

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}
      >
        {rowData.hasOwnProperty(dataKey) && (
          <InputTextCell style={{ width: `${width - CELL_PADDING_WIDTH}px` }}>
            {operationMode === 'VIEW' ? (
              <span title={value}>{value}</span>
            ) : (
              <InputText
                maxLength={500}
                value={value}
                onBlur={(e) => {
                  handleChangeTextValue({
                    ...rowData,
                    remarks: e.target.value,
                  });
                }}
              />
            )}
          </InputTextCell>
        )}
      </CellMeasurer>
    );
  };

  // 操作状態
  const changingRenderer = (cellData: RV.TableCellProps) => {
    const { dataKey, parent, columnIndex, rowIndex, rowData } = cellData;

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={columnIndex}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}
      >
        <LabelCell>
          <span>
            {changingNodes.has(rowData.uuid)
              ? t('pages:MapEditorLocationList.condition.changingStatus.WAIT')
              : ''}
          </span>
        </LabelCell>
      </CellMeasurer>
    );
  };

  // カラム定義
  const columns: RV.ColumnProps[] = [
    {
      // ロケーション
      label: t('pages:MapEditorLocationList.dataTable.locationNum.label'),
      dataKey: 'locationNum',
      cellRenderer: locationRenderer,
      width: 150,
    },
    {
      // フル桁
      label: t(
        'pages:MapEditorLocationList.dataTable.showFullLocationNum.label',
      ),
      dataKey: 'showFullLocationNum',
      cellRenderer: checkboxRenderer,
      width: 60,
      disableSort: true,
    },
    {
      // 除外
      label: t('pages:MapEditorLocationList.dataTable.ignoreLocation.label'),
      dataKey: 'ignoreLocation',
      cellRenderer: dropdownRenderer,
      width: 130,
      disableSort: true,
    },
    {
      // エリア
      label: t('pages:MapEditorLocationList.dataTable.areaId.label'),
      dataKey: 'areaId',
      cellRenderer: areaIdRenderer,
      width: 70,
    },
    {
      // テーブル
      label: t('pages:MapEditorLocationList.dataTable.tableId.label'),
      dataKey: 'tableId',
      cellRenderer: tableIdRenderer,
      width: 70,
    },
    {
      // 枝番
      label: t('pages:MapEditorLocationList.dataTable.branchNum.label'),
      dataKey: 'branchNum',
      cellRenderer: branchNumRenderer,
      width: 80,
    },
    {
      // テキスト
      label: t('pages:MapEditorLocationList.dataTable.text.label'),
      dataKey: 'text',
      cellRenderer: textRenderer,
      width: 200,
      disableSort: true,
    },
    {
      // フォントサイズ
      label: t('pages:MapEditorLocationList.dataTable.fontSize.label'),
      dataKey: 'fontSize',
      cellRenderer: fontSizeRenderer,
      width: 70,
      disableSort: true,
    },
    {
      // 備考
      label: t('pages:MapEditorLocationList.dataTable.remarks.label'),
      dataKey: 'remarks',
      cellRenderer: remarksRenderer,
      width: 330,
      disableSort: true,
    },
    {
      // 操作状態
      label: t('pages:MapEditorLocationList.dataTable.changingStatus.label'),
      dataKey: 'changingStatus',
      cellRenderer: changingRenderer,
      width: 80,
      flexGrow: 1,
      disableSort: true,
    },
  ];

  // ロケーション変更処理
  useEffect(
    () => {
      // エリア
      const areas = new Set();
      nodes.forEach((d) => d.areaId && areas.add(d.areaId));
      setCountOfArea(areas.size);

      // テーブル
      const areaTables = new Set();
      nodes.forEach((d) => areaTables.add(`${d.areaId}:${d.tableId}`));
      setCountOfTable(areaTables.size);

      // ロケーション
      setCountOfLocation(
        nodes.filter((d) => !d.missingNumber && !d.emptyNumber).length,
      );

      // 欠番
      setCountOfMissingNumber(nodes.filter((d) => d.missingNumber).length);

      // 空白
      setCountOfEmptyNumber(nodes.filter((d) => d.emptyNumber).length);

      // 再検索
      if (reSearch) {
        executeSearch();
        setReSearch(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes],
  );

  // Load, Unload 処理
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    resetState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const condition: Condition = {
    areaId,
    areaIdOption,
    tableIdFrom,
    tableIdTo,
    locationNumFrom,
    locationNumTo,
    ignoreLocation,
    showFullLocationNum,
    text,
    remarks,
    changingStatus,
    operationMode,
  };

  const conditionEvent: ConditionEvent = {
    onChangeAreaId: handleChangeAreaId,
    onChangeAreaIdOption: handleChangeAreaIdOption,
    onChangeTableIdFrom: handleChangeTableIdFrom,
    onChangeTableIdTo: handleChangeTableIdTo,
    onChangeLocationNumFrom: handleChangeLocationNumFrom,
    onChangeLocationNumTo: handleChangeLocationNumTo,
    onChangeIgnoreLocation: handleChangeIgnoreLocation,
    onChangeShowFullLocationNum: handleChangeShowFullLocationNum,
    onChangeText: handleChangeText,
    onChangeRemarks: handleChangeRemarks,
    onChangeChangingStatus: handleChangeChangingStatus,
    onChangeOperationMode: handleChangeOperationMode,
    onClickSearch: handleClickSearch,
    onClickClearSearchCondition: handleClickClearSearchCondition,
  };

  return (
    <Component
      {...props}
      areaIdLength={areaIdLength}
      tableIdLength={tableIdLength}
      locationNumLength={tableIdLength + branchNumLength}
      condition={condition}
      conditionEvent={conditionEvent}
      columns={columns}
      data={filteredNodes}
      totalRecords={props.nodeConfigList.length}
      countOfArea={countOfArea}
      countOfTable={countOfTable}
      countOfLocation={countOfLocation}
      countOfMissingNumber={countOfMissingNumber}
      countOfEmptyNumber={countOfEmptyNumber}
      bulkShowFullLocationNum={bulkShowFullLocationNum}
      bulkIgnoreLocation={bulkIgnoreLocation}
      bulkAreaId={bulkAreaId}
      bulkTableId={bulkTableId}
      bulkText={bulkText}
      bulkFontSize={bulkFontSize}
      bulkRemarks={bulkRemarks}
      selectedBulkAreaId={selectedBulkAreaId}
      selectedBulkTableId={selectedBulkTableId}
      selectedBulkText={selectedBulkText}
      selectedBulkFontSize={selectedBulkFontSize}
      selectedBulkRemarks={selectedBulkRemarks}
      maximizedModal={maximizedModal}
      ignoreLocationItems={ignoreLocationItems}
      selectedBulkIgnoreLocation={selectedBulkIgnoreLocation}
      onChangeBulkShowFullLocationNum={handleChangeBulkShowFullLocationNum}
      onChangeBulkIgnoreLocation={handleChangeBulkIgnoreLocation}
      onChangeBulkAreaId={handleChangeBulkAreaId}
      onChangeBulkTableId={handleChangeBulkTableId}
      onChangeBulkText={handleChangeBulkText}
      onChangeBulkFontSize={handleChangeBulkFontSize}
      onChangeBulkRemarks={handleChangeBulkRemarks}
      onChangeSelectedBulkIgnoreLocation={
        handleChangeSelectedBulkIgnoreLocation
      }
      onChangeSelectedBulkAreaId={handleChangeSelectedBulkAreaId}
      onChangeSelectedBulkTableId={handleChangeSelectedBulkTableId}
      onChangeSelectedBulkText={handleChangeSelectedBulkText}
      onChangeSelectedBulkFontSize={handleChangeSelectedBulkFontSize}
      onChangeSelectedBulkRemarks={handleChangeSelectedBulkRemarks}
      onChangeMaximizedModal={handleChangeMaximizedModal}
      onClickBulkChange={handleClickBulkChange}
      onClickClose={executeClose}
      onClickCancel={executeCancel}
      onClickSubmit={executeSubmit}
    />
  );
};
