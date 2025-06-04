import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button, RangeSlider } from '../../components/atoms';

const Header = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 20px 0 10px;
  background-color: rgba(62, 62, 62, 1);
  width: 100%;
  height: 38px;
  grid-column-start: 1;
  grid-column-end: 3;

  div {
    display: flex;
    flex-direction: row;
    align-items: center;

    input + label {
      margin-left: 10px;
    }
  }

  > div {
    div + button {
      margin-left: 5px;
    }
  }

  div + div,
  button + label {
    margin-left: 10px;
  }

  label {
    display: flex;
    align-items: center;
    height: 27px;

    span {
      margin-right: 10px;
      color: rgba(255, 255, 255, 1);
    }
  }
`;

const BackButton = styled(Button)`
  position: relative;
  background-color: rgba(230, 230, 230, 1);
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48px' height='48px' viewBox='0 0 24 24' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M9 6l-6 6 6 6'/%3E%3Cpath d='M21 12H4'/%3E%3Cpath stroke-linecap='round' d='M3 12h1'/%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  width: 33px;
  height: 33px;

  &:hover {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48px' height='48px' viewBox='0 0 24 24' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M9 6l-6 6 6 6'/%3E%3Cpath d='M21 12H4'/%3E%3Cpath stroke-linecap='round' d='M3 12h1'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 30px 30px;
  }
`;

const OverallNoteButton = styled(Button)`
  background-color: rgba(230, 230, 230, 1);
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' width='48px' height='48px'%3E%3Cg%3E%3Cpath d='M17.763,181.363h44.603c9.806,0,17.763-7.956,17.763-17.779c0-9.816-7.957-17.772-17.763-17.772H17.763C7.956,145.812,0,153.768,0,163.584C0,173.407,7.956,181.363,17.763,181.363z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3Crect x='21.952' y='199.963' width='33.253' height='112.075' style='fill: rgb(62, 62, 62);'%3E%3C/rect%3E%3Cpath d='M80.13,348.417c0-9.816-7.957-17.78-17.763-17.78H17.763C7.956,330.638,0,338.602,0,348.417c0,9.814,7.956,17.771,17.763,17.771h44.603C72.173,366.188,80.13,358.232,80.13,348.417z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3Crect x='134.227' y='154.499' width='149.64' height='24.94' style='fill: rgb(62, 62, 62);'%3E%3C/rect%3E%3Crect x='134.227' y='245.946' width='149.64' height='24.94' style='fill: rgb(62, 62, 62);'%3E%3C/rect%3E%3Crect x='134.227' y='337.392' width='91.446' height='24.94' style='fill: rgb(62, 62, 62);'%3E%3C/rect%3E%3Cpath d='M55.205,78.648c0.008-3.824,3.118-6.933,6.938-6.942H315.65c8.48,0.008,15.998,3.385,21.571,8.93c5.545,5.578,8.926,13.095,8.934,21.572v59.614c10.899-16.205,21.96-30.826,33.253-43.418v-16.196c-0.012-35.218-28.54-63.746-63.759-63.755H62.143C39.935,38.47,21.964,56.444,21.952,78.648v48.565h33.253V78.648z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3Cpath d='M346.156,313.702v96.09c-0.008,8.475-3.389,15.993-8.934,21.562c-5.573,5.553-13.091,8.931-21.571,8.938H62.143c-3.82-0.007-6.929-3.117-6.938-6.941v-48.564H21.952v48.564c0.012,22.204,17.983,40.178,40.191,40.194H315.65c35.218-0.007,63.746-28.536,63.759-63.754v-114.17c-8.22,5.423-18.206,9.101-29.491,10.684C348.765,308.571,347.491,311.072,346.156,313.702z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3Cpath d='M457.935,95.486c-74.065,10.204-151.463,189.371-186.368,253.677c-8.768,16.156,11.622,29.64,20.645,14.175c6.503-11.114,41.968-81.12,41.968-81.12c38.64,1.274,52.892-25.703,37.446-42.46c51.926,1.072,77.657-27.506,62.935-44.847c15.485,4.904,28.905,1.624,48.824-9.238C525.898,162.487,523.913,84.875,457.935,95.486z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  width: 33px;
  height: 33px;

  &:hover {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' width='48px' height='48px'%3E%3Cg%3E%3Cpath d='M17.763,181.363h44.603c9.806,0,17.763-7.956,17.763-17.779c0-9.816-7.957-17.772-17.763-17.772H17.763C7.956,145.812,0,153.768,0,163.584C0,173.407,7.956,181.363,17.763,181.363z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3Crect x='21.952' y='199.963' width='33.253' height='112.075' style='fill: rgb(62, 62, 62);'%3E%3C/rect%3E%3Cpath d='M80.13,348.417c0-9.816-7.957-17.78-17.763-17.78H17.763C7.956,330.638,0,338.602,0,348.417c0,9.814,7.956,17.771,17.763,17.771h44.603C72.173,366.188,80.13,358.232,80.13,348.417z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3Crect x='134.227' y='154.499' width='149.64' height='24.94' style='fill: rgb(62, 62, 62);'%3E%3C/rect%3E%3Crect x='134.227' y='245.946' width='149.64' height='24.94' style='fill: rgb(62, 62, 62);'%3E%3C/rect%3E%3Crect x='134.227' y='337.392' width='91.446' height='24.94' style='fill: rgb(62, 62, 62);'%3E%3C/rect%3E%3Cpath d='M55.205,78.648c0.008-3.824,3.118-6.933,6.938-6.942H315.65c8.48,0.008,15.998,3.385,21.571,8.93c5.545,5.578,8.926,13.095,8.934,21.572v59.614c10.899-16.205,21.96-30.826,33.253-43.418v-16.196c-0.012-35.218-28.54-63.746-63.759-63.755H62.143C39.935,38.47,21.964,56.444,21.952,78.648v48.565h33.253V78.648z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3Cpath d='M346.156,313.702v96.09c-0.008,8.475-3.389,15.993-8.934,21.562c-5.573,5.553-13.091,8.931-21.571,8.938H62.143c-3.82-0.007-6.929-3.117-6.938-6.941v-48.564H21.952v48.564c0.012,22.204,17.983,40.178,40.191,40.194H315.65c35.218-0.007,63.746-28.536,63.759-63.754v-114.17c-8.22,5.423-18.206,9.101-29.491,10.684C348.765,308.571,347.491,311.072,346.156,313.702z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3Cpath d='M457.935,95.486c-74.065,10.204-151.463,189.371-186.368,253.677c-8.768,16.156,11.622,29.64,20.645,14.175c6.503-11.114,41.968-81.12,41.968-81.12c38.64,1.274,52.892-25.703,37.446-42.46c51.926,1.072,77.657-27.506,62.935-44.847c15.485,4.904,28.905,1.624,48.824-9.238C525.898,162.487,523.913,84.875,457.935,95.486z' style='fill: rgb(62, 62, 62);'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 30px 30px;
  }
`;

const UnknownLocationListLabel = styled.div`
  background-color: transparent;
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'%3E%3Cpath d='M480-80Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q10 0 19.5.5T520-877v81q-10-2-20-3t-20-1q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186q122-112 181-203.5T720-552q0-2-.5-4t-.5-4h80q0 2 .5 4t.5 4q0 100-79.5 217.5T480-80Zm0-450Zm195-108 84-84 84 84 56-56-84-84 84-84-56-56-84 84-84-84-56 56 84 84-84 84 56 56ZM480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Z'/%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  border: none;
  width: 33px;
  height: 33px;
`;

const UnknownLocationListButton = styled(Button)`
  background-color: rgba(230, 230, 230, 1);
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'%3E%3Cpath d='M480-80Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q10 0 19.5.5T520-877v81q-10-2-20-3t-20-1q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186q122-112 181-203.5T720-552q0-2-.5-4t-.5-4h80q0 2 .5 4t.5 4q0 100-79.5 217.5T480-80Zm0-450Zm195-108 84-84 84 84 56-56-84-84 84-84-56-56-84 84-84-84-56 56 84 84-84 84 56 56ZM480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Z'/%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 30px 30px;
  border: none;
  width: 33px;
  height: 33px;

  &:hover {
    background-color: rgba(183, 183, 183, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' viewBox='0 -960 960 960' width='24'%3E%3Cpath d='M480-80Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q10 0 19.5.5T520-877v81q-10-2-20-3t-20-1q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186q122-112 181-203.5T720-552q0-2-.5-4t-.5-4h80q0 2 .5 4t.5 4q0 100-79.5 217.5T480-80Zm0-450Zm195-108 84-84 84 84 56-56-84-84 84-84-56-56-84 84-84-84-56 56 84 84-84 84 56 56ZM480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Z'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 30px 30px;
  }
`;

const InventoryProgress = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  > span {
    display: inline-flex;
    height: 24px;
    line-height: 24px;
    color: rgba(255, 255, 255, 1);

    + span {
      margin-left: 6px;
    }
  }
`;

const RefreshButton = styled(Button)`
  background-color: transparent;
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' fill='none' stroke='%23AAAAAA' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2.5 2v6h6M21.5 22v-6h-6'/%3E%3Cpath d='M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2'/%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 24px 24px;
  border: none;
  width: 38px;
  height: 38px;

  &:hover {
    background-color: transparent;
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 24 24' fill='none' stroke='%23DDDDDD' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2.5 2v6h6M21.5 22v-6h-6'/%3E%3Cpath d='M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 24px 24px;
  }
`;

const Refresh = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0 6px;

  > span {
    color: rgba(255, 255, 255, 1);
  }

  ${RefreshButton} {
    margin: 0 6px;
  }
`;

const ChangeSearchToggle = styled.div`
  width: 320px;
`;

const Toggle = styled.button`
  background: rgba(255, 255, 255, 1);
  color: rgba(36, 100, 215, 1);
  border: 1px solid rgba(36, 100, 215, 1);
  padding: 0 10px;
  min-height: 24px;
  width: 50%;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: rgba(220, 220, 220, 1);
  }

  &:disabled {
    background: rgba(66, 135, 245, 1);
    color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(36, 100, 215, 1);
    cursor: not-allowed;
  }

  &.planogram {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border-right: 0px;
  }

  &.countData {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    border-left: 0px;
  }
`;

// 戻るボタン
interface BackProps {
  canBack: boolean;
  onClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}
const BackContent = React.memo((props: BackProps) => {
  const [t] = useTranslation();

  if (props.canBack) {
    return (
      <div>
        <BackButton
          title={`${t('organisms:ViewerHeader.back')}`}
          onClick={props.onClick}
        ></BackButton>
      </div>
    );
  }
  return <></>;
});

// 棚卸メモ
interface NoteProps {
  onClickEditorNote(e: React.MouseEvent<HTMLButtonElement>): void;
}
const NoteContent = React.memo((props: NoteProps) => {
  const [t] = useTranslation();

  return (
    <div>
      <label>
        <OverallNoteButton
          title={`${t('organisms:ViewerHeader.showEditorNote')}`}
          onClick={props.onClickEditorNote}
        ></OverallNoteButton>
      </label>
    </div>
  );
});

// 棚割データ取込み
interface PlanogramCsvProps {
  onClickPlanogramCsvUpload(e: React.MouseEvent<HTMLButtonElement>): void;
}
const PlanogramCsvContent = React.memo((props: PlanogramCsvProps) => {
  const [t] = useTranslation();

  return (
    <div>
      <Button
        onClick={props.onClickPlanogramCsvUpload}
      >{`${t('organisms:ViewerHeader.showPlanogramCsvUpload')}`}</Button>
    </div>
  );
});

// 商品ロケーション検索
interface SearchProductLocationProps {
  onClickProductLocationSearch(e: React.MouseEvent<HTMLButtonElement>): void;
}
const SearchProductLocation = React.memo(
  (props: SearchProductLocationProps) => {
    const [t] = useTranslation();

    return (
      <div>
        <Button onClick={props.onClickProductLocationSearch}>
          {t('organisms:ViewerHeader.showProductLocationSearch')}
        </Button>
      </div>
    );
  },
);

interface ChangeSearchTargetProps {
  /** 棚割データ検索対象 */
  isPlanogramData: boolean;
  /** 検索対象切替 */
  onChangeSearchTarget(target: boolean): void;
}

const ChangeSearchTargetContent = React.memo(
  (props: ChangeSearchTargetProps) => {
    const [t] = useTranslation();

    return (
      <ChangeSearchToggle>
        <Toggle
          disabled={props.isPlanogramData}
          onClick={() => props.onChangeSearchTarget(true)}
          className={'planogram'}
        >
          {t('organisms:ViewerHeader.planogramData')}
        </Toggle>
        <Toggle
          disabled={!props.isPlanogramData}
          onClick={() => props.onChangeSearchTarget(false)}
          className={'countData'}
        >
          {t('organisms:ViewerHeader.countData')}
        </Toggle>
      </ChangeSearchToggle>
    );
  },
);

interface RangeSliderProps {
  stageScale: number;
  onChangeStageScale(e: number): void;
  onClickScaleUp(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickScaleDown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickScaleReset(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}
const RangeSliderContent = React.memo((props: RangeSliderProps) => {
  const [t] = useTranslation();

  return (
    <div>
      <RangeSlider
        min={20}
        max={150}
        step={10}
        value={props.stageScale}
        onChange={(e) => props.onChangeStageScale(Number(e.target.value))}
        onClickIncremental={props.onClickScaleUp}
        onClickDecremental={props.onClickScaleDown}
      />
      <Button onClick={() => props.onChangeStageScale(50)}>
        {t('organisms:ViewerHeader.scale.percent50')}
      </Button>
      <Button onClick={() => props.onChangeStageScale(100)}>
        {t('organisms:ViewerHeader.scale.percent100')}
      </Button>
      <Button onClick={() => props.onChangeStageScale(150)}>
        {t('organisms:ViewerHeader.scale.percent150')}
      </Button>
    </div>
  );
});

// 棚卸進捗率
interface InventoryProgressProps {
  /** 棚卸進捗率 */
  inventoryProgress: number;
  /** レイアウトロケーション数 */
  numOfLayoutLocation: number;
  /** カウントロケーション数 */
  numOfCountLocation: number;
}
const InventoryProgressContent = React.memo((props: InventoryProgressProps) => {
  const [t] = useTranslation();

  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

  return (
    <InventoryProgress>
      <span>{t('organisms:ViewerHeader.inventoryProgress.label')}</span>
      <span>{props.inventoryProgress}%</span>
      <span>{`(${numberFormat.format(
        props.numOfCountLocation,
      )}/${numberFormat.format(props.numOfLayoutLocation)})`}</span>
    </InventoryProgress>
  );
});

// レイアウトマップに存在しないロケーション一覧
interface UnknownLocationListProps {
  hasUnknownLocation: boolean;
  onClickUnknownLocationList(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ): void;
}

const UnknownLocationListContent = React.memo(
  (props: UnknownLocationListProps) => {
    const [t] = useTranslation();

    return (
      <div>
        {props.hasUnknownLocation ? (
          <UnknownLocationListButton
            title={`${t(
              'organisms:ViewerHeader.showUnknownLocationList.available',
            )}`}
            onClick={props.onClickUnknownLocationList}
          />
        ) : (
          <UnknownLocationListLabel
            title={`${t(
              'organisms:ViewerHeader.showUnknownLocationList.notAvailable',
            )}`}
          />
        )}
      </div>
    );
  },
);

interface RefreshProps {
  /** 最終更新日時 */
  latestUpdate: string;
  /** 更新クリック */
  onClickRefresh(): void;
}
const RefreshContent = React.memo((props: RefreshProps) => (
  <Refresh>
    <span>{props.latestUpdate}</span>
    <RefreshButton onClick={props.onClickRefresh} />
  </Refresh>
));

interface Props
  extends NoteProps,
    PlanogramCsvProps,
    RangeSliderProps,
    SearchProductLocationProps,
    InventoryProgressProps,
    UnknownLocationListProps,
    RefreshProps,
    ChangeSearchTargetProps {
  enableBackButton: boolean;
  /** 棚割データ CSV アップロード可否 */
  canUploadPlanogramCsv: boolean;
  /** 商品ロケーション検索可否 */
  canSearchProductLocation: boolean;
  /** 棚割データ検索可否 */
  canSearchPlanogramData: boolean;
  /** 戻る押下 */
  onClickBack(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
}

/**
 * マップエディタ：ヘッダー
 */
export const ViewerHeader = (props: Props) => {
  return (
    <Header>
      <BackContent
        canBack={props.enableBackButton}
        onClick={props.onClickBack}
      />
      <NoteContent {...props} />
      <RangeSliderContent
        stageScale={props.stageScale}
        onChangeStageScale={props.onChangeStageScale}
        onClickScaleUp={props.onClickScaleUp}
        onClickScaleDown={props.onClickScaleDown}
        onClickScaleReset={props.onClickScaleReset}
      />
      {props.canUploadPlanogramCsv ? <PlanogramCsvContent {...props} /> : <></>}
      {props.canSearchProductLocation ? (
        <SearchProductLocation {...props} />
      ) : (
        <></>
      )}
      {props.canSearchPlanogramData ? (
        <ChangeSearchTargetContent {...props} />
      ) : (
        <></>
      )}
      <InventoryProgressContent {...props} />
      <UnknownLocationListContent {...props} />
      <RefreshContent {...props} />
    </Header>
  );
};
