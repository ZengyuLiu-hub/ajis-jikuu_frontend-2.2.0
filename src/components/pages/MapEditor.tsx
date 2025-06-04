import React from 'react';
import Konva from 'konva';
import styled from 'styled-components';

import { EditData, LayoutData, StageScale } from '../../types';

import {
  EditorHeader,
  EditorLayoutTabs,
  EditorLocationInfo,
  EditorMainStage,
  EditorRulerX,
  EditorRulerY,
  EditorShapeControl,
  EditorSideMenu,
} from '../../containers/organisms';

import { AuthenticatedPageTemplate as Template } from '../templates';

const Outline = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: auto 1fr;
  height: 100%;
`;

const Main = styled.main`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr auto;
  grid-column-gap: 3px;
  background-color: rgba(80, 80, 80, 0.5);
  padding: 3px;
  min-width: 0;
  max-width: 100%;
  min-height: 0;
  max-height: 100%;

  .sketch-picker {
    * {
      box-sizing: content-box;
    }
  }
`;

const Editor = styled.div`
  overflow: hidden;
  position: relative;
  display: grid;
  grid-template-rows: auto auto 1fr;
  grid-row-gap: 3px;
  background-color: transparent;
  min-width: 0;
  max-width: 100%;
  min-height: 0;
  max-height: 100%;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  min-width: 0;
  max-width: 100%;
  min-height: 0;
  max-height: 100%;
`;

const RulerCorner = styled.div`
  display: ${(props) => `${props.theme.visible ? 'block' : 'none'}`};
  background-color: rgba(255, 255, 255, 1);
  width: 15px;
  height: 15px;
`;

interface EditorSideMenuProps {
  mapLayerRef: React.RefObject<Konva.Layer>;
}
const SideMenuContent = React.memo((props: EditorSideMenuProps) => (
  <EditorSideMenu mapLayer={props.mapLayerRef} />
));

interface LayoutTabProps {
  defaultLayout(): LayoutData;
  resetTab(): void;
  getCurrentShapeData(): EditData;
  destroyAllNodes(): void;
}
const LayoutTabContent = React.memo((props: LayoutTabProps) => (
  <EditorLayoutTabs
    defaultLayout={props.defaultLayout}
    resetTab={props.resetTab}
    getCurrentShapeData={props.getCurrentShapeData}
    destroyAllNodes={props.destroyAllNodes}
  />
));

interface EditorLocationInfoProps {
  mapLayerRef: React.RefObject<Konva.Layer>;
}
const LocationInfoContent = React.memo((props: EditorLocationInfoProps) => (
  <EditorLocationInfo mapLayerRef={props.mapLayerRef} />
));

interface RulerXProps {
  rulerXRef: any;
}
const RulerX = React.memo((props: RulerXProps) => (
  <EditorRulerX containerRef={props.rulerXRef} />
));

interface RulerYProps {
  rulerYRef: any;
}
const RulerY = React.memo((props: RulerYProps) => (
  <EditorRulerY containerRef={props.rulerYRef} />
));

interface Props extends LayoutTabProps, RulerXProps, RulerYProps {
  mapLayerRef: React.RefObject<Konva.Layer>;
  areaLayerRef: React.RefObject<Konva.Layer>;
  editLayerRef: React.RefObject<Konva.Layer>;
  transformer: React.RefObject<Konva.Transformer>;
  enabledRulers: boolean;
  getCurrentShapeData(): EditData;
  undo: () => void;
  redo: () => void;
  handleStageScale: (scale: StageScale, value?: number) => void;
}

export const MapEditor = (props: Props) => {
  RulerCorner.defaultProps = {
    theme: {
      visible: props.enabledRulers,
    },
  };

  return (
    <Template>
      <Outline>
        <EditorHeader
          getCurrentShapeData={props.getCurrentShapeData}
          undo={props.undo}
          redo={props.redo}
          handleStageScale={props.handleStageScale}
        />
        <SideMenuContent mapLayerRef={props.mapLayerRef} />
        <Main>
          <Editor>
            <LayoutTabContent {...props} />
            <LocationInfoContent mapLayerRef={props.mapLayerRef} />
            <ContentContainer>
              <RulerCorner></RulerCorner>
              <RulerX rulerXRef={props.rulerXRef} />
              <RulerY rulerYRef={props.rulerYRef} />
              <EditorMainStage
                rulerX={props.rulerXRef}
                rulerY={props.rulerYRef}
                mapLayer={props.mapLayerRef}
                editLayer={props.editLayerRef}
                areaLayer={props.areaLayerRef}
                transformer={props.transformer}
                getCurrentShapeData={props.getCurrentShapeData}
                undo={props.undo}
                redo={props.redo}
                handleStageScale={props.handleStageScale}
              />
            </ContentContainer>
          </Editor>
          <EditorShapeControl
            editLayer={props.editLayerRef}
            transformer={props.transformer}
          />
        </Main>
      </Outline>
    </Template>
  );
};
