import { useCallback, useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import dayjs from 'dayjs';

import * as viewerConstants from '../../constants/viewer';
import { DateTimeUtil } from '../../utils/DateTimeUtil';

import { ViewerLocationSummary as Component } from '../../components/organisms';
import { DisplayPosition } from '../../components/organisms/ViewerLocationSummary';

export type TransformerClientRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type DisplayPositionProps = {
  parentWidth: number;
  parentHeight: number;
  parentScrollTop: number;
  parentScrollLeft: number;
  propertyWidth: number;
  propertyHeight: number;
  transformerClientRect: TransformerClientRect;
};

interface Props {
  canvasContainerRef: React.RefObject<HTMLDivElement>;
  transformerRef: React.RefObject<Konva.Transformer>;
  selectedShapeCountLocations: any[];
}

/**
 * マップビューア：ロケーション集計
 */
export const ViewerLocationSummary = (props: Props) => {
  const { canvasContainerRef, transformerRef, selectedShapeCountLocations } =
    props;

  const POSITION_OFFSET = 50;

  const propertyContainer = useRef<HTMLDivElement>(null);

  // 数量
  const [quantity, setQuantity] = useState(0);

  // カウント時間
  const [countTime, setCountTime] = useState('');

  // ロケーション番号一覧
  const [locationNumList, setLocationNumList] = useState<string[]>([]);

  // 表示位置
  const [displayPosition, setDisplayPosition] = useState<DisplayPosition>({
    top: 0,
    left: 0,
  });

  // 集計計算を実行します.
  const calcAggregate = () => {
    const quantities: number[] = [];
    const countTimes: number[] = [];
    const locationNums: string[] = [];

    props.selectedShapeCountLocations.forEach((d) => {
      // 数量
      quantities.push(d.quantity ?? 0);

      // カウント時間
      if (d.countTime) {
        const time = dayjs(
          `1900-01-01 ${d.countTime}`,
          viewerConstants.DATE_TIME_FORMAT_COUNT_TIME,
        );
        const seconds = time.hour() * 3600 + time.minute() * 60 + time.second();
        countTimes.push(seconds);
      } else {
        countTimes.push(0);
      }

      // ロケーション番号一覧
      locationNums.push(d.locationNum);
    });

    // 集計：数量
    setQuantity(quantities.reduce((a, b) => a + b, 0));

    // 集計：カウント時間
    const seconds = countTimes.reduce((a, b) => a + b, 0);
    setCountTime(
      DateTimeUtil.secondsToAccumulatedTime(
        seconds,
        viewerConstants.DATE_TIME_FORMAT_COUNT_TIME,
      ),
    );

    // 集計：ロケーション番号一覧
    setLocationNumList(locationNums);
  };

  // 表示位置を取得します.
  const getDisplayPosition = useCallback((props: DisplayPositionProps) => {
    // 選択範囲の X、Y 座標を取得
    const rangeX = props.transformerClientRect.x;
    const rangeY = props.transformerClientRect.y;

    // 選択範囲の幅、高さを取得
    const rangeWidth = props.transformerClientRect.width;
    const rangeHeight = props.transformerClientRect.height;

    // 選択範囲の右端、下端を取得
    const rightEnd = rangeX + rangeWidth;
    const bottomEnd = rangeY + rangeHeight;

    // デフォルトの戻り値
    const position = {
      top: bottomEnd - rangeHeight / 2 - Math.round(props.propertyHeight / 2),
      left: rightEnd + POSITION_OFFSET,
    };

    // 配置すると右側がスクロールに隠れるような位置の場合に横位置を訂正
    const propertyRightEnd = rightEnd + POSITION_OFFSET + props.propertyWidth;
    if (propertyRightEnd > props.parentWidth + props.parentScrollLeft) {
      position.left = rangeX - POSITION_OFFSET - props.propertyWidth;
    }

    // 配置すると上側がスクロールに隠れるような位置の場合に縦位置を訂正
    const propertyBottomStart = rangeY - Math.round(props.propertyHeight / 2);
    if (propertyBottomStart < props.parentScrollTop) {
      position.top = bottomEnd;
    }

    // 配置すると下側がスクロールに隠れるような位置の場合に縦位置を訂正
    const propertyBottomEnd =
      bottomEnd + props.propertyHeight - Math.round(props.propertyHeight / 2);
    if (propertyBottomEnd > props.parentHeight + props.parentScrollTop) {
      position.top = rangeY - props.propertyHeight;
    }

    // ステージ表示範囲の基準座標（左上）
    const zeroX = props.parentScrollLeft;
    const zeroY = props.parentScrollTop;

    // x 軸方向に画面からはみ出してしまった場合の補正
    const calculatedRightEnd = position.left + props.propertyWidth;
    if (props.parentWidth + zeroX < calculatedRightEnd) {
      position.left =
        position.left -
        (POSITION_OFFSET + calculatedRightEnd - props.parentWidth);
    }

    // y 軸方向に画面からはみ出してしまった場合の補正
    const calculatedBottomEnd = position.top + props.propertyHeight;
    if (props.parentHeight + zeroY < calculatedBottomEnd) {
      position.top =
        position.top -
        (POSITION_OFFSET + calculatedBottomEnd - props.parentHeight);
    }

    // x 軸がマイナス値になっている場合の補正
    if (position.left < zeroX) {
      position.left = zeroX + POSITION_OFFSET;
    }

    // y 軸がマイナス値になっている場合の補正
    if (position.top < zeroY) {
      position.top = zeroY + POSITION_OFFSET;
    }

    return position;
  }, []);

  // 選択ロケーション変更
  useEffect(() => {
    if (
      !canvasContainerRef.current ||
      !transformerRef.current ||
      !propertyContainer.current
    ) {
      return;
    }

    // 再計算
    calcAggregate();

    const displayPositionProps = {
      parentWidth: canvasContainerRef.current.clientWidth,
      parentHeight: canvasContainerRef.current.clientHeight,
      parentScrollTop: canvasContainerRef.current.scrollTop,
      parentScrollLeft: canvasContainerRef.current.scrollLeft,
      propertyWidth: propertyContainer.current.clientWidth,
      propertyHeight: propertyContainer.current.clientHeight,
      transformerClientRect: {
        x: transformerRef.current.x(),
        y: transformerRef.current.y(),
        width: transformerRef.current.width(),
        height: transformerRef.current.height(),
      },
    };

    // 表示位置を更新
    setDisplayPosition(getDisplayPosition(displayPositionProps));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShapeCountLocations, propertyContainer.current]);

  return (
    <>
      <Component
        propertyContainerRef={propertyContainer}
        displayPosition={displayPosition}
        quantity={quantity}
        countTime={countTime}
        locationNumList={locationNumList}
      />
    </>
  );
};
