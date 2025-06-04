import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import * as editorConstants from '../../constants/editor';

import { useAppDispatch } from '../../app/hooks';
import {
  DialogTypes,
  LocationSearchCategories,
  LocationSearchCategory,
} from '../../types';

import { appModule, editorNodeModule } from '../../modules';
import {
  useAreaIdLength,
  useBranchNumLength,
  useLocationNodes,
  useSelectedNodeIds,
  useTableIdLength,
} from '../../selectors';

import { EditorLocationItemList as Component } from '../../components/organisms/EditorLocationItemList';

/**
 * 付番有り
 */
export const EditorLocationItemList = () => {
  const [t] = useTranslation();
  const dispatch = useAppDispatch();

  const selectedNodeIds = useSelectedNodeIds();
  const locationNodes = useLocationNodes();

  const areaIdLength = useAreaIdLength();
  const tableIdLength = useTableIdLength();
  const branchNumLength = useBranchNumLength();

  const [searchCategory, setSearchCategory] = useState<LocationSearchCategory>(
    LocationSearchCategories.DUPLICATED_LOCATION_NUM,
  );
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState<any[]>([]);

  const [pressKeyControl, setPressKeyControl] = useState(false);

  /**
   * 検索カテゴリー変更イベントハンドラー.
   */
  const handleChangeSearchCategory = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSearchCategory(e.target.value as LocationSearchCategory);
      setSearchText('');
    },
    [],
  );

  /**
   * 検索ボタン押下イベントハンドラー.
   */
  const handleClickSearch = useCallback(() => {
    const existsDuplicated = (self: { areaId: string; locationNum: string }) =>
      locationNodes.filter(
        ({ missingNumber, emptyNumber, areaId, locationNum }) =>
          !missingNumber &&
          !emptyNumber &&
          areaId === self.areaId &&
          locationNum === self.locationNum,
      ).length > 1;

    // 検索カテゴリー毎にロケーションを検索（後方一致）
    const targets = locationNodes.filter((config: any) => {
      if (searchCategory === LocationSearchCategories.AREA_ID) {
        return config.areaId.endsWith(searchText);
      } else if (searchCategory === LocationSearchCategories.TABLE_ID) {
        return config.tableId.endsWith(searchText);
      } else if (searchCategory === LocationSearchCategories.LOCATION_NUM) {
        return config.locationNum.endsWith(searchText);
      } else if (
        searchCategory === LocationSearchCategories.DUPLICATED_LOCATION_NUM
      ) {
        return (
          !config.missingNumber &&
          !config.emptyNumber &&
          existsDuplicated(config)
        );
      } else if (searchCategory === LocationSearchCategories.AREA_ID_MISMATCH) {
        return (
          !config.missingNumber &&
          !config.emptyNumber &&
          config.areaId.length !== areaIdLength
        );
      }
      return false;
    });

    const sortedData = targets.sort((a: any, b: any) => {
      if (Number(a.locationNum) > Number(b.locationNum)) {
        return 1;
      }
      if (Number(a.locationNum) < Number(b.locationNum)) {
        return -1;
      }
      return 0;
    });
    setSearchResult(sortedData);
  }, [locationNodes, searchCategory, searchText, areaIdLength]);

  /**
   * 検索テキスト変更イベントハンドラー.
   */
  const handleChangeSearchText = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => setSearchText(e.target.value),
    [],
  );

  /**
   * KeyDown イベントハンドラー.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
      setPressKeyControl(true);
    }

    // シェイプ削除
    if (e.key.toLowerCase() === 'delete') {
      dispatch(editorNodeModule.actions.updateDeleteNodeIds(selectedNodeIds));
    }
  };

  /**
   * KeyUp イベントハンドラー.
   */
  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (pressKeyControl) {
      setPressKeyControl(false);
    }
  };

  /**
   * 全選択ボタン押下イベントハンドラー.
   */
  const handleClickSelectAll = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (searchResult.length === 0) {
      return;
    }
    const ids: string[] = searchResult.map((node) => node.uuid);

    // 選択数が上限に達している場合はエラー表示
    if (ids.length > editorConstants.MAX_SELECTION_SHAPES) {
      dispatch(
        appModule.actions.updateAlertDialog({
          type: DialogTypes.ERROR,
          message: t(
            'organisms:EditorOperationLayer.message.maxSelectionShapes',
            {
              maxSelectionShapes: editorConstants.MAX_SELECTION_SHAPES,
            },
          ),
        }),
      );

      // 選択数を規定数に変更
      dispatch(
        editorNodeModule.actions.updateSelectedNodeIds(
          ids.slice(0, editorConstants.MAX_SELECTION_SHAPES),
        ),
      );
    } else {
      dispatch(editorNodeModule.actions.updateSelectedNodeIds(ids));
    }
  };

  /**
   * 全解除ボタン押下イベントハンドラー.
   */
  const handleClickUnSelectAll = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (searchResult.length === 0) {
      return;
    }
    const ids: string[] = searchResult.map((node) => node.uuid);
    dispatch(editorNodeModule.actions.excludeSelectedNodeIds(ids));
  };

  /**
   * クリアボタン押下イベントハンドラー.
   */
  const handleClickClear = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => setSearchResult([]),
    [],
  );

  /**
   * リスト項目押下イベントハンドラー.
   */
  const handleClickItem = useCallback(
    (id: string) => {
      if (pressKeyControl) {
        if (selectedNodeIds.includes(id)) {
          dispatch(editorNodeModule.actions.excludeSelectedNodeIds([id]));
        } else {
          dispatch(editorNodeModule.actions.addSelectedNodeIds([id]));
        }
      } else {
        dispatch(editorNodeModule.actions.updateSelectedNodeIds([id]));
      }
    },
    [dispatch, pressKeyControl, selectedNodeIds],
  );

  // カテゴリ変更時の検索かどうか
  const isSearchOnChangeCategory =
    searchCategory === LocationSearchCategories.DUPLICATED_LOCATION_NUM ||
    searchCategory === LocationSearchCategories.AREA_ID_MISMATCH;

  // 検索カテゴリ変更時
  useEffect(() => {
    if (isSearchOnChangeCategory) {
      handleClickSearch();
    } else {
      setSearchResult([]);
    }
    dispatch(editorNodeModule.actions.updateSelectedNodeIds([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, searchCategory]);

  // ロケーション数変更時
  useEffect(() => {
    if (searchResult.length > 0 || locationNodes.length > 0) {
      handleClickSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationNodes]);

  return (
    <Component
      areaIdLength={areaIdLength}
      tableIdLength={tableIdLength}
      branchNumLength={branchNumLength}
      selectedNodeIds={selectedNodeIds}
      searchResult={searchResult}
      searchCategory={searchCategory}
      isSearchOnChangeCategory={isSearchOnChangeCategory}
      onChangeSearchCategory={handleChangeSearchCategory}
      onClickSearch={handleClickSearch}
      searchText={searchText}
      onBlurSearchText={handleChangeSearchText}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onClickSelectAll={handleClickSelectAll}
      onClickUnSelectAll={handleClickUnSelectAll}
      onClickClear={handleClickClear}
      onClickItem={handleClickItem}
    />
  );
};
