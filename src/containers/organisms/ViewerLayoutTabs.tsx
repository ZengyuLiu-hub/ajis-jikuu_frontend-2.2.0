import { useEffect } from 'react';

import * as constants from '../../constants/app';

import { EditorUtil } from '../../utils/EditorUtil';

import { useAppDispatch } from '../../app/hooks';
import { Layout, LayoutData, ShapeOperations } from '../../types';

import {
  appModule,
  viewerModule,
  viewerNodeModule,
  viewerPreferenceModule,
  viewerShapeModule,
} from '../../modules';
import {
  useUser,
  useViewCurrentLayout,
  useViewCurrentLayoutId,
  useViewLayoutTabs,
  useViewMapVersion,
  useViewerPreferenceState,
} from '../../selectors';

import { ViewerLayoutTabs as Component } from '../../components/organisms';

interface Props {
  destroyAllNodes(): void;
}

/**
 * マップビューア：レイアウトタブ
 */
export const ViewerLayoutTabs = (props: Props) => {
  const dispatch = useAppDispatch();

  const user = useUser();

  const mapVersion = useViewMapVersion();

  const preferences = useViewerPreferenceState();

  const layoutTabs = useViewLayoutTabs();
  const currentLayout = useViewCurrentLayout();
  const currentLayoutId = useViewCurrentLayoutId();

  /**
   * レイアウト切替.
   */
  const changeLayout = async (layout: Layout) => {
    const { userId } = user;
    const { mapId, version } = mapVersion;
    const storeKey = `${constants.STORAGE_KEY_VIEWER_DATA}.${userId}.${mapId}.${version}`;

    // 切替先のレイアウトデータを取得
    const switchLayout = (await EditorUtil.getStoreItem(
      `${storeKey}.${layout.layoutId}`,
    )) as LayoutData;

    // ステージをクリア
    props.destroyAllNodes();

    // 表示切替
    // エリア、マップ
    if (switchLayout) {
      const areas = switchLayout.areas ?? [];
      const maps = switchLayout.maps ?? [];

      // マップの復元
      dispatch(
        viewerShapeModule.actions.updateMapHistory({
          operation: ShapeOperations.ADD,
          present: areas.concat(maps),
        }),
      );
    }

    // レイアウト環境設定
    if (switchLayout?.preferences) {
      dispatch(
        viewerPreferenceModule.actions.updatePreference({
          ...preferences,
          ...switchLayout.preferences,
        }),
      );
    }

    // 表示レイアウト
    dispatch(viewerModule.actions.updateCurrentLayout(layout));

    // 選択を解除
    dispatch(viewerNodeModule.actions.updateSelectedNodeIds([]));

    // スクロール位置を初期位置へリセット
    dispatch(viewerModule.actions.updateScrollPosition({ top: 0, left: 0 }));
  };

  /**
   * タブ（フロア）選択.
   */
  const handleClickTab = async (layout: Layout) => {
    if (layout.layoutId === currentLayoutId) {
      return;
    }

    // ローディング表示
    dispatch(appModule.actions.updateLoading(true));

    await changeLayout(layout);
  };

  /**
   * タブ一覧変更.
   */
  useEffect(() => {
    if (layoutTabs.length === 0) {
      return;
    }

    const tab = layoutTabs.find((d) => d.layoutId === currentLayoutId);
    if (!tab) {
      dispatch(viewerModule.actions.updateCurrentLayout(layoutTabs[0]));
    }
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
      companyCode={mapVersion?.companyCode ?? ''}
      companyName={mapVersion?.companyName ?? ''}
      storeCode={mapVersion?.storeCode ?? ''}
      storeName={mapVersion?.storeName ?? ''}
      layoutTabs={layoutTabs}
      currentLayoutId={currentLayoutId}
      onChangeLayout={handleClickTab}
    />
  );
};
