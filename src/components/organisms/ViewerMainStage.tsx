import Konva from 'konva';
import React from 'react';
import { Stage } from 'react-konva';
import {
  Provider,
  ReactReduxContext,
  ReactReduxContextValue,
} from 'react-redux';
import styled from 'styled-components';

import * as mapConstants from '../../constants/map';

import {
  ViewerAreaLayer,
  ViewerLocationSummary,
  ViewerMapLayer,
  ViewerOperationLayer,
  ViewerShapeProperty,
} from '../../containers/organisms';
import { CountLocation, RGBA, ViewLocationColorType } from '../../types';

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  min-width: 0;
  max-width: 100%;
  min-height: 0;
  max-height: 100%;
`;

const CanvasContainer = styled.div`
  overflow: auto;
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  min-width: 0;
  max-width: 100%;
  min-height: 0;
  max-height: 100%;
`;

const StageContainer = styled.div`
  outline: none;

  > div {
    background-color: rgba(255, 255, 255, 1);
  }
`;

interface Props {
  canvasContainerRef: React.RefObject<HTMLDivElement>;
  stageRef: React.RefObject<Konva.Stage>;
  areaLayerRef: React.RefObject<Konva.Layer>;
  mapLayerRef: React.RefObject<Konva.Layer>;
  operationLayerRef: React.RefObject<Konva.Layer>;
  transformerRef: React.RefObject<Konva.Transformer>;
  latticeWidth: number;
  latticeHeight: number;
  stageScale: number;
  stageWidth: number;
  stageHeight: number;
  selectedShapeConfig?: any;
  selectedShapeCountLocation: any;
  jurisdictionClass: string;
  companyCode: string;
  storeCode: string;
  inventoryDates: Date[];
  selectedShapeCountLocations: any[];
  getViewLocationColor(
    loc: CountLocation,
    colorType?: ViewLocationColorType,
  ): { fillRgb: RGBA; fill: string };
  onStageClick(e: Konva.KonvaEventObject<MouseEvent>): void;
  onStageMouseDown(e: Konva.KonvaEventObject<MouseEvent>): void;
  onStageMouseMove(e: Konva.KonvaEventObject<MouseEvent>): void;
  onStageMouseUp(e: Konva.KonvaEventObject<MouseEvent>): void;
}

/**
 * マップビューア：ステージ
 */
export const ViewerMainStage = (props: Props) => {
  StageContainer.defaultProps = {
    theme: {
      latticeWidth: props.latticeWidth,
      latticeHeight: props.latticeHeight,
      scaleRatio: props.stageScale / 100,
      stageWidth: props.stageWidth,
      stageHeight: props.stageHeight,
    },
  };

  return (
    <ContentContainer>
      <CanvasContainer ref={props.canvasContainerRef}>
        <StageContainer id="container" tabIndex={1}>
          <ReactReduxContext.Consumer>
            {(reduxProps) => {
              const { store } = reduxProps as ReactReduxContextValue;

              return (
                <Stage
                  container="container"
                  ref={props.stageRef}
                  scaleX={props.stageScale / 100}
                  scaleY={props.stageScale / 100}
                  width={props.stageWidth * mapConstants.MAX_STAGE_SCALE_RATIO}
                  height={
                    props.stageHeight * mapConstants.MAX_STAGE_SCALE_RATIO
                  }
                  onClick={props.onStageClick}
                  onTap={props.onStageClick}
                  onMouseDown={props.onStageMouseDown}
                  onMouseMove={props.onStageMouseMove}
                  onMouseUp={props.onStageMouseUp}
                >
                  <Provider store={store}>
                    <ViewerAreaLayer layerRef={props.areaLayerRef} />
                    <ViewerMapLayer layerRef={props.mapLayerRef} />
                    <ViewerOperationLayer
                      layerRef={props.operationLayerRef}
                      transformerRef={props.transformerRef}
                    />
                  </Provider>
                </Stage>
              );
            }}
          </ReactReduxContext.Consumer>
        </StageContainer>
        {/* シェイププロパティ */}
        {props.selectedShapeConfig && (
          <ViewerShapeProperty
            canvasContainerRef={props.canvasContainerRef}
            selectedShapeConfig={props.selectedShapeConfig}
            selectedShapeCountLocation={props.selectedShapeCountLocation}
            jurisdictionClass={props.jurisdictionClass}
            companyCode={props.companyCode}
            storeCode={props.storeCode}
            inventoryDates={props.inventoryDates}
            getViewLocationColor={props.getViewLocationColor}
          />
        )}
        {/* ロケーション集計 */}
        {props.selectedShapeCountLocations.length > 0 && (
          <ViewerLocationSummary
            canvasContainerRef={props.canvasContainerRef}
            transformerRef={props.transformerRef}
            selectedShapeCountLocations={props.selectedShapeCountLocations}
          />
        )}
      </CanvasContainer>
    </ContentContainer>
  );
};
