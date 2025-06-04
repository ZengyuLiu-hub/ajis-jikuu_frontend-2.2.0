import Konva from 'konva';
import styled from 'styled-components';

import {
  ViewerHeader,
  ViewerLayoutTabs,
  ViewerLocationInfo,
  ViewerMainStage,
} from '../../containers/organisms';
import { AuthenticatedPageTemplate as Template } from '../templates';

const Outline = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
  height: 100%;
`;

const Main = styled.main`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
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

const Viewer = styled.div`
  overflow: hidden;
  position: relative;
  display: grid;
  grid-template-rows: auto auto 1fr;
  grid-row-gap: 3px;
  background-color: transparent;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  min-height: 0;
  max-height: 100%;
  height: 100%;
`;

interface Props {
  areaLayerRef: React.RefObject<Konva.Layer>;
  mapLayerRef: React.RefObject<Konva.Layer>;
  destroyAllNodes(): void;
  /** カウントロケーション更新 */
  updateCountLocation(): void;
}

/**
 * マップビューア
 */
export const MapViewer = (props: Props) => {
  return (
    <Template>
      <Outline>
        <ViewerHeader updateCountLocation={props.updateCountLocation} />
        <Main>
          <Viewer>
            <ViewerLayoutTabs destroyAllNodes={props.destroyAllNodes} />
            <ViewerLocationInfo />
            <ViewerMainStage
              areaLayerRef={props.areaLayerRef}
              mapLayerRef={props.mapLayerRef}
            />
          </Viewer>
        </Main>
      </Outline>
    </Template>
  );
};
