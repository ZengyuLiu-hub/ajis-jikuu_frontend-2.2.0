import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '../../app/hooks';

import { editorViewModule, editorLayerModule } from '../../modules';
import {
  useVisibleRemarksIcon,
  useShapeControlTab,
  useShapeControlExpand,
  useVisibleAreaLayer,
  useVisibleMapLayer,
} from '../../selectors';

import {
  EditorShapeControl as Component,
  LayerData,
} from '../../components/organisms/EditorShapeControl';
import Konva from 'konva';

interface Props {
  editLayer: React.RefObject<Konva.Layer>;
  transformer: React.RefObject<Konva.Transformer>;
}

/**
 * マップエディタ：シェイプ操作
 */
export const EditorShapeControl = (props: Props) => {
  const [t] = useTranslation();
  const dispatch = useAppDispatch();

  const shapeControlTab = useShapeControlTab();
  const shapeControlExpand = useShapeControlExpand();
  const visibleAreaLayer = useVisibleAreaLayer();
  const visibleMapLayer = useVisibleMapLayer();
  const visibleRemarksIcon = useVisibleRemarksIcon();

  const handleChangeVisibleAreaLayer = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(
      editorLayerModule.actions.updateVisibleAreaLayer(e.target.checked),
    );
  };

  const handleChangeVisibleMapLayer = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(editorLayerModule.actions.updateVisibleMapLayer(e.target.checked));
  };

  const handleChangeVisibleRemarksIcon = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(
      editorViewModule.actions.updateVisibleRemarksIcon(e.target.checked),
    );
  };

  const layers: LayerData[] = useMemo(
    () => [
      {
        label: t('organisms:EditorOtherItemList.layer.area'),
        checked: visibleAreaLayer,
        onChange: handleChangeVisibleAreaLayer,
      },
      {
        label: t('organisms:EditorOtherItemList.layer.map'),
        checked: visibleMapLayer,
        onChange: handleChangeVisibleMapLayer,
      },
      {
        label: t('organisms:EditorOtherItemList.layer.locationNote'),
        checked: visibleRemarksIcon,
        onChange: handleChangeVisibleRemarksIcon,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visibleAreaLayer, visibleMapLayer, visibleRemarksIcon],
  );

  const handleChangeShapeControlTab = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(editorViewModule.actions.updateShapeControlTab(e.target.value));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handleClickShapeControlTab = useCallback((e: string) => {
    dispatch(editorViewModule.actions.updateShapeControlTab(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Component
      layers={layers}
      editLayer={props.editLayer}
      transformer={props.transformer}
      shapeControlTab={shapeControlTab}
      onChangeShapeControlTab={handleChangeShapeControlTab}
      onClickShapeControlTab={handleClickShapeControlTab}
      shapeControlExpand={shapeControlExpand}
    />
  );
};
