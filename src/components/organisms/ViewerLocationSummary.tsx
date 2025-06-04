import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  display: grid;
  grid-template-rows: auto auto;
  grid-row-gap: 9px;
  padding: 9px;
  border: 1px solid rgba(128, 128, 128, 1);
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0 10px 25px 0 rgba(0, 0, 0, 0.5);
  min-width: 322px;
  max-width: 600px;
  min-height: 120px;
`;

const Body = styled.div``;

const Property = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  width: 100%;
  min-height: 30px;

  > div {
    display: flex;
    align-items: center;
    padding: 3px 3px 3px 6px;
    border-bottom: 1px solid rgba(128, 128, 128, 1);
    color: rgba(255, 255, 255, 1);
    min-width: 180px;
    height: 100%;
  }

  &:last-child {
    > div {
      border-bottom: none;
    }
  }
`;

const Label = styled.div`
  border-right: 1px solid rgba(128, 128, 128, 1);
  white-space: nowrap;
  width: 180px;
`;

const Value = styled.div``;

export type DisplayPosition = {
  top: number;
  left: number;
};

interface Props {
  propertyContainerRef: React.RefObject<HTMLDivElement>;
  displayPosition: DisplayPosition;
  quantity: number;
  countTime: string;
  locationNumList: any[];
}

/**
 * マップビューア：ロケーション集計
 */
export const ViewerLocationSummary = (props: Props) => {
  const [t] = useTranslation();

  const numberFormat: Intl.NumberFormat = new Intl.NumberFormat('ja');

  return (
    <Container
      ref={props.propertyContainerRef}
      style={{
        top: props.displayPosition.top,
        left: props.displayPosition.left,
      }}
    >
      <Body>
        {/* 数量 */}
        <Property>
          <Label>
            {t('organisms:ViewerLocationSummary.property.quantity')}
          </Label>
          <Value>{numberFormat.format(props.quantity)}</Value>
        </Property>
        {/* カウント時間 */}
        <Property>
          <Label>
            {t('organisms:ViewerLocationSummary.property.countTime')}
          </Label>
          <Value>{props.countTime}</Value>
        </Property>
        {/* ロケーション数 */}
        <Property>
          <Label>
            {t('organisms:ViewerLocationSummary.property.countOfLocations')}
          </Label>
          <Value>{numberFormat.format(props.locationNumList.length)}</Value>
        </Property>
        {/* ロケーション番号一覧 */}
        <Property>
          <Label>
            {t('organisms:ViewerLocationSummary.property.locationNumList')}
          </Label>
          <Value>{props.locationNumList.join(', ')}</Value>
        </Property>
      </Body>
    </Container>
  );
};
