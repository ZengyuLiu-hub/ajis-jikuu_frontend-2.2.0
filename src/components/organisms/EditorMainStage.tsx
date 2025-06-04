import React from 'react';
import {
  ReactReduxContext,
  Provider,
  ReactReduxContextValue,
} from 'react-redux';
import { Stage } from 'react-konva';
import Konva from 'konva';
import classNames from 'classnames';
import styled from 'styled-components';

import {
  EditorAreaLayer,
  EditorEditLayer,
  EditorMapLayer,
  EditorOperationLayer,
} from '../../containers/organisms';

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

    &::after {
      position: absolute;
      content: '';
      top: 0;
      left: 0;
      border-right: 3px solid rgba(43, 50, 255, 0.6);
      border-bottom: 3px solid rgba(43, 50, 255, 0.6);
      width: ${(props) =>
        `${props.theme.stageWidth * props.theme.scaleRatio}px`};
      height: ${(props) =>
        `${props.theme.stageHeight * props.theme.scaleRatio}px`};
    }
  }

  &.lattice > div {
    position: relative;

    background-image: repeating-linear-gradient(
        90deg,
        rgba(80, 80, 80, 0.1),
        rgba(80, 80, 80, 0.1) 1px,
        transparent 1px,
        transparent
          ${(props) => `${props.theme.latticeWidth * props.theme.scaleRatio}px`}
      ),
      repeating-linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0.2) 1px,
        transparent 1px,
        transparent
          ${(props) =>
            `${props.theme.latticeWidth * 10 * props.theme.scaleRatio}px`}
      ),
      repeating-linear-gradient(
        -180deg,
        rgba(80, 80, 80, 0.1),
        rgba(80, 80, 80, 0.1) 1px,
        transparent 1px,
        transparent
          ${(props) =>
            `${props.theme.latticeHeight * props.theme.scaleRatio}px`}
      ),
      repeating-linear-gradient(
        -180deg,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0.2) 1px,
        transparent 1px,
        transparent
          ${(props) =>
            `${props.theme.latticeHeight * 10 * props.theme.scaleRatio}px`}
      );
  }
`;

interface Props {
  wrapperRef: any;
  stageRef: React.RefObject<Konva.Stage>;
  transformer: React.RefObject<Konva.Transformer>;
  mapLayerRef: React.RefObject<Konva.Layer>;
  editLayerRef: React.RefObject<Konva.Layer>;
  areaLayerRef: React.RefObject<Konva.Layer>;
  operationLayerRef: React.RefObject<Konva.Layer>;
  latticeWidth: number;
  latticeHeight: number;
  enabledLattice: boolean;
  stageScale: number;
  stageWidth: number;
  stageHeight: number;
  onScrollWrapper(e: React.UIEvent<HTMLDivElement>): void;
  onKeyDown(e: React.KeyboardEvent<HTMLElement>): void;
  onKeyUp(e: React.KeyboardEvent<HTMLDivElement>): void;
  onStageClick(e: Konva.KonvaEventObject<MouseEvent>): void;
  onStageMouseDown(e: Konva.KonvaEventObject<MouseEvent>): void;
  onStageMouseMove(e: Konva.KonvaEventObject<MouseEvent>): void;
  onStageMouseUp(e: Konva.KonvaEventObject<MouseEvent>): void;
}

export const EditorMainStage = (props: Props) => {
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
    <CanvasContainer ref={props.wrapperRef} onScroll={props.onScrollWrapper}>
      <StageContainer
        id="container"
        className={classNames({ lattice: props.enabledLattice })}
        tabIndex={1}
        onKeyDown={props.onKeyDown}
        onKeyUp={props.onKeyUp}
      >
        <ReactReduxContext.Consumer>
          {(reduxProps) => {
            const { store } = reduxProps as ReactReduxContextValue;

            return (
              <Stage
                container="container"
                ref={props.stageRef}
                scaleX={props.stageScale / 100}
                scaleY={props.stageScale / 100}
                width={props.stageWidth * 1.5}
                height={props.stageHeight * 1.5}
                onClick={props.onStageClick}
                onMouseDown={props.onStageMouseDown}
                onMouseMove={props.onStageMouseMove}
                onMouseUp={props.onStageMouseUp}
              >
                <Provider store={store}>
                  <EditorAreaLayer layerRef={props.areaLayerRef} />
                  <EditorMapLayer layerRef={props.mapLayerRef} />
                  <EditorEditLayer layerRef={props.editLayerRef} />
                  <EditorOperationLayer
                    layerRef={props.operationLayerRef}
                    transformerRef={props.transformer}
                  />
                </Provider>
              </Stage>
            );
          }}
        </ReactReduxContext.Consumer>
      </StageContainer>
    </CanvasContainer>
  );
};
