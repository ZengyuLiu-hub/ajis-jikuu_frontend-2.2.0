import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

import * as constants from '../../constants/app';

import {
  AlertDialogData,
  DialogTypes,
  EditData,
  Layout,
  LayoutData,
  SaveData,
  ShapeOperations,
  SideMenuTypes,
} from '../../types';
import { useAppDispatch } from '../../app/hooks';

import {
  appModule,
  editorAreaModule,
  editorIslandModule,
  editorLayoutModule,
  editorModule,
  editorNodeModule,
  editorOpModule,
  editorPreferenceModule,
  editorShapeModule,
  editorTableModule,
  editorWallModule,
} from '../../modules';
import {
  useAddAreaLatestAreaId,
  useAddTableLatestTableId,
  useEditorWallState,
  useEditorIslandState,
  useCurrentLayout,
  useCurrentLayoutId,
  useEditMapVersion,
  useEditorPreferenceState,
  useLayoutTabs,
  useNodeConfigList,
  useLayoutName,
  useUser,
} from '../../selectors';

import {
  EditorLayoutTabs as Component,
  DragTab,
} from '../../components/organisms/EditorLayoutTabs';
import { EditorUtil } from '../../utils/EditorUtil';

interface Props {
  defaultLayout(): LayoutData;
  resetTab(): void;
  getCurrentShapeData(): EditData;
  destroyAllNodes(): void;
}

/**
 * マップエディタ：レイアウトタブ
 */
export const EditorLayoutTabs = (props: Props) => {
  /** タブ水平スクロール幅 */
  const TAB_HORIZON_SCROLL_WIDTH = 81;

  const dispatch = useAppDispatch();
  const [t] = useTranslation();

  const user = useUser();

  const editMapVersion = useEditMapVersion();

  const layoutTabs = useLayoutTabs();
  const currentLayout = useCurrentLayout();
  const currentLayoutId = useCurrentLayoutId();

  const latestAreaId = useAddAreaLatestAreaId();
  const latestTableId = useAddTableLatestTableId();
  const wallState = useEditorWallState();
  const islandState = useEditorIslandState();

  const preferences = useEditorPreferenceState();

  const nodeConfigList = useNodeConfigList();

  const layoutName = useLayoutName();

  const tabContainer = useRef<HTMLDivElement>(null);

  const [canHorizonScrollingRight, setHorizonScrollingRight] = useState(false);
  const [canHorizonScrollingLeft, setHorizonScrollingLeft] = useState(false);

  /**
   * レイアウト切替.
   */
  const changeLayout = async (layout: Layout) => {
    const { userId } = user;
    const { mapId, version } = editMapVersion;
    const storeKey = `${constants.STORAGE_KEY_EDITOR_DATA}.${userId}.${mapId}.${version}`;

    // 現在のレイアウト上のシェイプデータを取得
    const editData = props.getCurrentShapeData();

    // ステージをクリア
    props.destroyAllNodes();

    // 現在のレイアウトを退避
    if (layoutTabs.some((d) => d.layoutId === currentLayoutId)) {
      const newCurrentLayout: LayoutData = {
        ...currentLayout,
        ...wallState,
        ...islandState,
        latestAreaId: latestAreaId,
        latestTableId: latestTableId,
        maps: editData.map,
        areas: editData.area,
        preferences: {
          printSize: preferences.printSize,
          screenCaptureRange: preferences.screenCaptureRange,
          stageWidth: preferences.stageWidth,
          stageHeight: preferences.stageHeight,
          latticeWidth: preferences.latticeWidth,
          latticeHeight: preferences.latticeHeight,
        },
      };

      EditorUtil.updateStoreItem(
        `${storeKey}.${currentLayoutId}`,
        newCurrentLayout,
      );
    }

    // 切替先のレイアウトデータを取得
    const switchLayout = (await EditorUtil.getStoreItem(
      `${storeKey}.${layout.layoutId}`,
    )) as LayoutData;

    // エリア、マップ表示切替
    if (switchLayout) {
      const areas = switchLayout.areas ?? [];
      const maps = switchLayout.maps ?? [];

      // 採番IDの復元
      dispatch(
        editorAreaModule.actions.updateLatestAreaId(switchLayout.latestAreaId),
      );
      dispatch(
        editorTableModule.actions.updateLatestTableId(
          switchLayout.latestTableId,
        ),
      );
      dispatch(
        editorWallModule.actions.updateLatestWallBranchNum({
          ...switchLayout,
        }),
      );
      dispatch(editorIslandModule.actions.updateLatestIds({ ...switchLayout }));

      // メニュー選択状態リセット
      dispatch(
        editorOpModule.actions.updateOp({
          selectedMenu: SideMenuTypes.SELECT_TOOL,
          opHoldItems: [],
          finishOpHold: false,
        }),
      );
      // マップの復元
      dispatch(
        editorShapeModule.actions.updateMapHistory({
          operation: ShapeOperations.ADD,
          present: areas.concat(maps),
        }),
      );
    }

    // レイアウト環境設定
    if (switchLayout?.preferences) {
      dispatch(
        editorPreferenceModule.actions.updatePreference({
          ...preferences,
          ...switchLayout.preferences,
        }),
      );
    }

    // 表示レイアウト
    dispatch(editorModule.actions.updateCurrentLayout(layout));

    // スクロール位置を初期位置へリセット
    dispatch(editorModule.actions.updateScrollPosition({ top: 0, left: 0 }));
  };

  /**
   * タブ（フロア）選択.
   *
   * @param layout 切り替え先レイアウト
   */
  const handleClickTab = async (layout: Layout) => {
    if (layout.layoutId === currentLayoutId) {
      return;
    }

    // 選択シェイプ全解除
    dispatch(editorNodeModule.actions.clearSelectedNodeIds());

    // 自動保存解除
    dispatch(editorShapeModule.actions.updateWaitingAutoSave(false));

    // ローディング表示
    dispatch(appModule.actions.updateLoading(true));

    // 選択タブ変更（遅延実行）
    setTimeout(() => changeLayout(layout), 1);
  };

  /**
   * レイアウト（フロア）名変更確定.
   */
  const onChangeTabLabel = async ({
    layoutId,
    layoutName,
  }: {
    layoutId: string;
    layoutName: string;
  }) => {
    const { userId } = user;
    const { mapId, version } = editMapVersion;
    if (!userId || !mapId || version < 1) {
      return;
    }
    const storeKey = `${constants.STORAGE_KEY_EDITOR_DATA}.${userId}.${mapId}.${version}`;

    // 対象レイアウト更新
    const newCurrentLayout: Layout = { ...currentLayout, layoutName };

    await EditorUtil.updateStoreItem(
      `${storeKey}.${layoutId}`,
      newCurrentLayout,
    );

    // レイアウト一覧更新
    const newTabs: Layout[] = layoutTabs.map((d) => {
      if (d.layoutId === layoutId) {
        return { ...d, layoutName };
      }
      return d;
    });

    // レイアウト（フロア）一覧の更新
    dispatch(editorModule.actions.updateLayoutTabs(newTabs));

    // 選択レイアウト（フロア）の更新
    dispatch(editorModule.actions.updateCurrentLayout(newCurrentLayout));

    // 未保存状態オン
    dispatch(editorShapeModule.actions.updateUnsavedData(true));
  };

  /**
   * フロア削除（削除確認なし）.
   */
  const deleteLayout = async (layoutId: string) => {
    const { userId } = user;
    const { mapId, version } = editMapVersion;
    const storeKey = `${constants.STORAGE_KEY_EDITOR_DATA}.${userId}.${mapId}.${version}`;

    // レイアウト一覧から対象レイアウトを削除
    const layouts = layoutTabs.filter((d) => d.layoutId !== layoutId);

    // 保存データ削除
    EditorUtil.removeStoreItem(`${storeKey}.${layoutId}`);

    // 選択レイアウト変更
    if (layouts.length === 0) {
      props.resetTab();

      // 未保存状態更新
      dispatch(editorShapeModule.actions.updateUnsavedData(true));

      return;
    } else {
      // 選択タブ変更（先頭のタブを選択）
      await changeLayout(layouts[0]);
    }

    // レイアウト一覧更新
    dispatch(editorModule.actions.updateLayoutTabs(layouts));

    // 未保存状態更新
    dispatch(editorShapeModule.actions.updateUnsavedData(true));

    // ローディング表示オフ
    dispatch(appModule.actions.updateLoading(false));
  };

  /**
   * レイアウト（フロア）削除（削除確認あり）.
   */
  const deleteLayoutByConfirm = (layout: Layout) => {
    const dialogData: AlertDialogData = {
      type: DialogTypes.CONFIRM,
      message: t('organisms:EditorLayoutTabs.message.confirmDeleteData', {
        layoutName: layout.layoutName,
      }),
      positiveAction: () => {
        // ローディング表示オン
        dispatch(appModule.actions.updateLoading(true));

        // 表示中レイアウトの場合はノード全削除
        if (layout.layoutId === currentLayoutId) {
          props.destroyAllNodes();
        }
        deleteLayout(layout.layoutId);
      },
      negativeAction: () => {
        // ローディング表示オフ
        dispatch(appModule.actions.updateLoading(false));
      },
    };
    dispatch(appModule.actions.updateAlertDialog(dialogData));
  };

  /**
   * レイアウト（フロア）削除ボタン押下.
   */
  const handleClickDeleteTab = async (layout: Layout) => {
    let hasLayoutNodes = false;
    if (layout.layoutId === currentLayoutId) {
      // 表示中タブの場合
      hasLayoutNodes = nodeConfigList.length > 0;
    } else {
      // 表示中以外のタブの場合
      const { userId } = user;
      const { mapId, version } = editMapVersion;
      const storeKey = `${constants.STORAGE_KEY_EDITOR_DATA}.${userId}.${mapId}.${version}`;

      const targetLayout = (await EditorUtil.getStoreItem(
        `${storeKey}.${layout.layoutId}`,
      )) as LayoutData;

      hasLayoutNodes = targetLayout
        ? targetLayout.areas.length > 0 || targetLayout.maps.length > 0
        : false;
    }

    // レイアウトにシェイプが存在する場合は削除確認
    if (hasLayoutNodes) {
      deleteLayoutByConfirm(layout);
      return;
    }

    // ローディング表示オン
    dispatch(appModule.actions.updateLoading(true));

    // 削除
    deleteLayout(layout.layoutId);
  };

  /**
   * 水平スクロールボタン状態更新.
   */
  const updateTabHorizonScrollButton = () => {
    if (!tabContainer.current) {
      return;
    }

    // スクロール現在位置
    const currentLeft = tabContainer.current.scrollLeft;

    // 左スクロール
    setHorizonScrollingLeft(currentLeft !== 0);

    // スクロール最大位置
    const maxLeft =
      tabContainer.current.scrollWidth - tabContainer.current.clientWidth;

    // 右スクロール
    setHorizonScrollingRight(currentLeft !== maxLeft);
  };

  /**
   * レイアウト（フロア）右スクロールボタン押下.
   */
  const handleClickTabScrollRight = () => {
    if (!tabContainer.current) {
      return;
    }

    // スクロール最大位置
    const maxLeft =
      tabContainer.current.scrollWidth - tabContainer.current.clientWidth;

    // スクロール現在位置
    const currentLeft = tabContainer.current.scrollLeft;
    if (currentLeft === maxLeft) {
      return;
    }
    tabContainer.current.scrollLeft = currentLeft + TAB_HORIZON_SCROLL_WIDTH;

    updateTabHorizonScrollButton();
  };

  /**
   * レイアウト（フロア）左スクロールボタン押下.
   */
  const handleClickTabScrollLeft = () => {
    if (!tabContainer.current) {
      return;
    }

    // スクロール現在位置
    const currentLeft = tabContainer.current.scrollLeft;
    if (currentLeft === 0) {
      return;
    }
    tabContainer.current.scrollLeft = currentLeft - TAB_HORIZON_SCROLL_WIDTH;

    updateTabHorizonScrollButton();
  };

  /**
   * レイアウト（フロア）複製ボタン押下.
   */
  const handleClickCopyTab = async () => {
    const { userId } = user;
    const { mapId, version } = editMapVersion;
    const storeKey = `${constants.STORAGE_KEY_EDITOR_DATA}.${userId}.${mapId}.${version}`;

    // 選択中のレイアウトを取得
    const sourceData = props.getCurrentShapeData();

    // レイアウトをコピー
    const newLayout: LayoutData = {
      ...props.defaultLayout(),
      layoutName: `${currentLayout.layoutName} copy`,
      ...wallState,
      ...islandState,
      latestAreaId: latestAreaId,
      latestTableId: latestTableId,
      maps: sourceData.map.map((d) => {
        // UUID 再割り当て
        const uuid = uuidv4();
        return {
          id: uuid,
          config: {
            ...d.config,
            id: uuid,
            uuid: uuid,
          },
        };
      }),
      areas: sourceData.area.map((d) => {
        // UUID 再割り当て
        const uuid = uuidv4();
        return {
          id: uuid,
          config: {
            ...d.config,
            id: uuid,
            uuid: uuid,
          },
        };
      }),
      preferences: {
        printSize: preferences.printSize,
        screenCaptureRange: preferences.screenCaptureRange,
        stageWidth: preferences.stageWidth,
        stageHeight: preferences.stageHeight,
        latticeWidth: preferences.latticeWidth,
        latticeHeight: preferences.latticeHeight,
      },
    };

    // コピーレイアウトを退避
    await EditorUtil.updateStoreItem(
      `${storeKey}.${newLayout.layoutId}`,
      newLayout,
    );

    // レイアウト一覧更新（コピー元の右隣りへ配置）
    const newLayoutTabs: Layout[] = [];
    layoutTabs.forEach((d) => {
      newLayoutTabs.push(d);
      if (d.layoutId === currentLayoutId) {
        newLayoutTabs.push(newLayout);
      }
    });
    dispatch(editorModule.actions.updateLayoutTabs(newLayoutTabs));

    // 未保存データフラグ
    dispatch(editorShapeModule.actions.updateUnsavedData(true));

    // 選択シェイプ全解除
    dispatch(editorNodeModule.actions.clearSelectedNodeIds());

    // ローディング表示
    dispatch(appModule.actions.updateLoading(true));

    // 選択タブ変更（遅延実行）
    setTimeout(() => changeLayout(newLayout), 1);
  };

  /**
   * レイアウト（フロア）追加ボタン押下.
   */
  const handleClickAddTab = async () => {
    const { userId } = user;
    const { mapId, version } = editMapVersion;
    const storeKey = `${constants.STORAGE_KEY_EDITOR_DATA}.${userId}.${mapId}.${version}`;

    // 新規レイアウト（フロア）
    const newLayout: LayoutData = {
      ...props.defaultLayout(),
      layoutName: `${layoutTabs.length + 1}F`,
    };

    // 新規レイアウトを退避
    await EditorUtil.updateStoreItem(
      `${storeKey}.${newLayout.layoutId}`,
      newLayout,
    );

    // レイアウト一覧更新
    const newLayoutTabs: Layout[] = [...layoutTabs, { ...newLayout }];

    // レイアウト一覧
    dispatch(editorModule.actions.updateLayoutTabs(newLayoutTabs));

    // 未保存データフラグ
    dispatch(editorShapeModule.actions.updateUnsavedData(true));
  };

  /**
   * レイアウトタブの順序変更.
   */
  const handleDropTab = async (value: DragTab) => {
    dispatch(appModule.actions.updateLoading(true));

    const { userId } = user;
    const { mapId, version } = editMapVersion;
    const storeKey = `${constants.STORAGE_KEY_EDITOR_DATA}.${userId}.${mapId}.${version}`;

    const data = (await EditorUtil.getStoreItem(storeKey)) as SaveData;

    // レイアウト一覧更新
    const dragLayout = data.layouts.find((d) => d.layoutId === value.dragTabId);

    const newLayouts: Layout[] = [];
    if (value.dropTabId) {
      // ドロップタブの前に挿入する
      data.layouts.forEach((d) => {
        if (dragLayout && d.layoutId === value.dropTabId) {
          newLayouts.push(dragLayout);
        }
        if (d.layoutId !== value.dragTabId) {
          newLayouts.push(d);
        }
      });
    } else {
      // ドロップタブが存在しない場合、最後尾タブの後に挿入する
      data.layouts.forEach((d) => {
        if (d.layoutId !== value.dragTabId) {
          newLayouts.push(d);
        }
      });
      dragLayout && newLayouts.push(dragLayout);
    }

    // 変更がない場合は終了
    if (
      data.layouts.map((d) => d.layoutId).toString() ===
      newLayouts.map((d) => d.layoutId).toString()
    ) {
      dispatch(appModule.actions.updateLoading(false));
      return;
    }

    // 新規レイアウトを退避
    await EditorUtil.updateStoreItem(storeKey, {
      ...data,
      layouts: newLayouts,
    });

    // レイアウト一覧
    dispatch(editorModule.actions.updateLayoutTabs(newLayouts));

    // 未保存データフラグ
    dispatch(editorShapeModule.actions.updateUnsavedData(true));

    dispatch(appModule.actions.updateLoading(false));
  };

  // レイアウト名をタブに反映
  useEffect(() => {
    if (!layoutName) {
      return;
    }
    onChangeTabLabel({
      layoutId: currentLayoutId,
      layoutName: layoutName?.trim() || '1F',
    });
    dispatch(editorLayoutModule.actions.updateLayoutName(undefined));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutName]);

  /**
   * タブ一覧変更.
   */
  useEffect(() => {
    if (
      layoutTabs.length === 0 ||
      !tabContainer.current ||
      tabContainer.current.clientWidth >= tabContainer.current.scrollWidth
    ) {
      setHorizonScrollingRight(false);
      setHorizonScrollingLeft(false);
      return;
    }

    // 選択中のタブが存在しない場合は先頭のタブを選択
    const tab = layoutTabs.find((d) => d.layoutId === currentLayoutId);
    if (!tab) {
      dispatch(editorModule.actions.updateCurrentLayout(layoutTabs[0]));
    }

    // 水平スクロールボタン制御
    updateTabHorizonScrollButton();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutTabs]);

  /**
   * 選択タブ変更時処理.
   */
  useEffect(() => {
    dispatch(appModule.actions.updateLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLayout]);

  return (
    <Component
      companyCode={editMapVersion?.companyCode ?? ''}
      companyName={editMapVersion?.companyName ?? ''}
      storeCode={editMapVersion?.storeCode ?? ''}
      storeName={editMapVersion?.storeName ?? ''}
      tabContainerRef={tabContainer}
      layoutTabs={layoutTabs}
      currentTab={currentLayoutId}
      canHorizonScrollingRight={canHorizonScrollingRight}
      canHorizonScrollingLeft={canHorizonScrollingLeft}
      onClickTab={handleClickTab}
      onChangeTabLabel={onChangeTabLabel}
      onClickDeleteTab={handleClickDeleteTab}
      onClickTabScrollRight={handleClickTabScrollRight}
      onClickTabScrollLeft={handleClickTabScrollLeft}
      onClickCopyTab={handleClickCopyTab}
      onClickAddTab={handleClickAddTab}
      onDropTab={handleDropTab}
    />
  );
};
