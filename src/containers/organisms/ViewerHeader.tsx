import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { AuthorityTypes, StageScale, StageScales } from '../../types';
import { DateTimeUtil, SecurityUtil } from '../../utils';

import { useAppDispatch } from '../../app/hooks';

import { appModule, viewerModule, viewerNodeModule } from '../../modules';
import {
  useCountLocations,
  useHasUnknownCountLocation,
  useIsPlanogramData,
  useNumOfLayoutLocation,
  useUser,
  useViewMapVersion,
  useViewStageScale,
} from '../../selectors';
import { verifyAuthentication } from '../../actions';

import { ViewerHeader as Component } from '../../components/organisms';
import {
  MapViewerNote,
  MapViewerPlanogramCsvUpload,
  MapViewerProductLocationSearch,
} from '../pages';
import { MapViewerUnknownLocationList } from '../pages/MapViewerUnknownLocationList';

const modalShowStatuses = {
  isNoteOpen: false,
  isPlanogramCsvUploadOpen: false,
  isProductSearchOpen: false,
  isUnknownLocationListOpen: false,
};

interface Props {
  /** カウントロケーション更新 */
  updateCountLocation(): void;
}

/**
 * マップビューア：ヘッダー
 *
 * @param props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const ViewerHeader = (props: Props) => {
  const dispatch = useAppDispatch();
  const [t] = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();

  const user = useUser();

  const mapVersion = useViewMapVersion();

  const stageScale = useViewStageScale();

  const countLocations = useCountLocations();
  const numOfLayoutLocation = useNumOfLayoutLocation();
  const hasUnknownCountLocation = useHasUnknownCountLocation();

  // モーダル表示/非表示
  const [modalShowStatus, modalShowEvent] = useReducer(
    (
      prev: typeof modalShowStatuses,
      next: { [key in keyof typeof modalShowStatuses]?: boolean },
    ) => ({
      ...prev,
      ...next,
    }),
    modalShowStatuses,
  );

  const isPlanogramData = useIsPlanogramData();

  const [stateHistories, setStateHistories] = useState<any[]>([]);
  const [enableBackButton, setEnableBackButton] = useState<boolean>(false);

  const [inventoryProgress, setInventoryProgress] = useState(0);
  const [numOfCountLocation, setNumOfCountLocation] = useState(0);
  const [latestUpdate, setLatestUpdate] = useState('');

  const handleClickChangeSearchTarget = (isPlanogramData: boolean) => {
    dispatch(viewerModule.actions.updateIsPlanogramData(isPlanogramData));
  };

  // 棚割データ検索の権限有無
  const canSearchPlanogramData = SecurityUtil.hasAnyAuthority(user, [
    AuthorityTypes.PLANOGRAM_SEARCH,
  ]);

  /**
   * 戻るボタン押下
   */
  const handleClickBack = useCallback(async () => {
    dispatch(appModule.actions.updateLoading(true));

    await dispatch(
      verifyAuthentication(() => {
        if (stateHistories.length > 0) {
          const { referer } = stateHistories.slice(-1)[0];
          navigate(referer, { state: { stateHistories }, replace: true });
          return;
        }
        navigate(-1);
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateHistories]);

  const handleClickScaleUp = () => handleStageScale(StageScales.UP);
  const handleClickScaleDown = () => handleStageScale(StageScales.DOWN);
  const handleClickScaleReset = () => handleStageScale(StageScales.RESET);
  const handleChangeStageScale = (e: number) =>
    handleStageScale(StageScales.DIRECT, e);

  const handleStageScale = (scale: StageScale, value?: number) => {
    const current = Math.floor(stageScale);
    if (scale === StageScales.UP) {
      // 拡大
      if (stageScale < 150) {
        dispatch(viewerModule.actions.updateStageScale(current + 10));
      }
    } else if (scale === StageScales.DOWN) {
      // 縮小
      if (stageScale > 20) {
        dispatch(viewerModule.actions.updateStageScale(current - 10));
      }
    } else if (scale === StageScales.RESET) {
      // リセット
      dispatch(viewerModule.actions.updateStageScale(100));
    } else if (scale === StageScales.DIRECT && value) {
      // 直接指定
      dispatch(viewerModule.actions.updateStageScale(value));
    }
    // 選択を解除
    dispatch(viewerNodeModule.actions.updateSelectedNodeIds([]));
  };

  /**
   * 拡大・縮小の値を更新.
   */
  const scale = useMemo(() => stageScale, [stageScale]);

  /**
   * 棚卸進捗率を表示
   */
  useEffect(() => {
    (async () => {
      if (numOfCountLocation === 0) {
        setInventoryProgress(0);
        return;
      }

      // 進捗率を設定（小数点以下切り捨て）
      setInventoryProgress(
        Math.floor((numOfCountLocation / numOfLayoutLocation) * 100),
      );
    })();
  }, [
    user,
    mapVersion,
    numOfLayoutLocation,
    countLocations,
    numOfCountLocation,
  ]);

  /**
   * 最終更新日時を表示
   */
  useEffect(() => {
    // カウントロケーション数を更新
    const length = countLocations.length;
    setNumOfCountLocation(length);

    if (length === 0) {
      setLatestUpdate(t('organisms:ViewerHeader.latestUpdate.nothingData'));
      return;
    }

    // 最終更新日時を取得
    const value = countLocations
      .map((d) => new Date(d.createdAt))
      .reduce((a, b) => (a > b ? a : b));

    const latestUpdate = DateTimeUtil.parseDateToDayjs(
      value,
      user.timeZone,
    )?.format(t('organisms:ViewerHeader.latestUpdate.format'));

    setLatestUpdate(
      latestUpdate ?? t('organisms:ViewerHeader.latestUpdate.nothingData'),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countLocations]);

  /**
   * Load, Unload 処理
   */
  useEffect(() => {
    // 棚割データ検索権限がない場合、カウントデータを検索する
    if (!canSearchPlanogramData) {
      dispatch(viewerModule.actions.updateIsPlanogramData(false));
    }

    const histories = location?.state?.stateHistories ?? [];
    if (histories.length === 0) {
      return;
    }

    const { referer, payload } = histories.slice(-1)[0];
    setEnableBackButton(!!referer);

    if (payload?.condition && referer === location.pathname) {
      const prevHistories = histories.slice(0, -1);
      setEnableBackButton(prevHistories.length !== 0);

      setStateHistories(prevHistories);
    } else {
      setStateHistories(histories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Component
        enableBackButton={enableBackButton}
        stageScale={scale}
        inventoryProgress={inventoryProgress}
        numOfLayoutLocation={numOfLayoutLocation}
        numOfCountLocation={numOfCountLocation}
        hasUnknownLocation={hasUnknownCountLocation}
        latestUpdate={latestUpdate}
        canUploadPlanogramCsv={SecurityUtil.hasAnyAuthority(user, [
          AuthorityTypes.PLANOGRAM_CSV_UPLOAD,
        ])}
        canSearchProductLocation={SecurityUtil.hasAnyAuthority(user, [
          AuthorityTypes.PRODUCT_LOCATION_SEARCH,
        ])}
        canSearchPlanogramData={canSearchPlanogramData}
        isPlanogramData={isPlanogramData}
        onChangeSearchTarget={handleClickChangeSearchTarget}
        onClickBack={handleClickBack}
        onClickEditorNote={() => modalShowEvent({ isNoteOpen: true })}
        onClickPlanogramCsvUpload={() =>
          modalShowEvent({ isPlanogramCsvUploadOpen: true })
        }
        onClickProductLocationSearch={() =>
          modalShowEvent({ isProductSearchOpen: true })
        }
        onClickUnknownLocationList={() =>
          modalShowEvent({ isUnknownLocationListOpen: true })
        }
        onChangeStageScale={handleChangeStageScale}
        onClickScaleUp={handleClickScaleUp}
        onClickScaleDown={handleClickScaleDown}
        onClickScaleReset={handleClickScaleReset}
        onClickRefresh={props.updateCountLocation}
      />
      <MapViewerNote
        isOpen={modalShowStatus.isNoteOpen}
        onRequestClose={() => modalShowEvent({ isNoteOpen: false })}
      />
      <MapViewerPlanogramCsvUpload
        isOpen={modalShowStatus.isPlanogramCsvUploadOpen}
        onRequestClose={() =>
          modalShowEvent({ isPlanogramCsvUploadOpen: false })
        }
      />
      <MapViewerProductLocationSearch
        isOpen={modalShowStatus.isProductSearchOpen}
        canSearchPlanogramData={canSearchPlanogramData}
        isPlanogramData={isPlanogramData}
        onRequestClose={() => modalShowEvent({ isProductSearchOpen: false })}
        onChangeSearchTarget={handleClickChangeSearchTarget}
      />
      <MapViewerUnknownLocationList
        isOpen={modalShowStatus.isUnknownLocationListOpen}
        onRequestClose={() =>
          modalShowEvent({ isUnknownLocationListOpen: false })
        }
      />
    </>
  );
};
