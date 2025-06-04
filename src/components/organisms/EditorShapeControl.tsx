import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import styled from 'styled-components';

import {
  EditorLocationItemList,
  EditorNoLocationItemList,
  EditorItemProperties,
} from '../../containers/organisms';
import Konva from 'konva';

const ShapeControlContainer = styled.div`
  overflow: hidden;
  position: relative;
  display: grid;
  grid-template-rows: 50% 50%;
  max-width: 330px;
  min-height: 0;
  max-height: 100%;

  &.collapse {
    display: none;
  }
`;

const TabContainer = styled.div`
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  min-height: 0;
  max-height: 100%;
  width: 100%;
  height: 100%;

  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: rgba(62, 62, 62, 1);
    order: -1;
  }
`;

const TabContent = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  max-height: calc(100% - 32px);
  height: 0;
  opacity: 0;
`;

const Tab = styled.label`
  position: relative;
  flex: 1;
  white-space: nowrap;
  padding: 4px 0;
  background: LightGray;
  height: 30px;
  font-size: 10pt;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  order: -1;

  &:not(:last-of-type) {
    margin-right: 1px;
  }
`;

const TabSwitch = styled.input`
  display: none;

  &:checked {
    & + ${Tab} {
      background: rgba(62, 62, 62, 1);
      color: rgba(255, 255, 255, 1);
    }

    & + ${Tab} + ${TabContent} {
      height: 100%;
      opacity: 1;
    }
  }
`;

const VisibleCheckBox = styled.input`
  position: absolute;
  top: 8px;
  left: 21px;
  box-sizing: border-box;
  display: inline-block;
  margin: 0;
  padding: 0;
  width: auto;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 0;
    display: block;
    background: #fff;
    border: 1px solid #231815;
    width: 25px;
    height: 24px;
  }

  &::after {
    content: '';
    position: absolute;
    top: -6px;
    left: 0;
    display: block;
    background-color: transparent;
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M20 9C20 9 19.6797 9.66735 19 10.5144M12 14C10.392 14 9.04786 13.5878 7.94861 13M12 14C13.608 14 14.9521 13.5878 16.0514 13M12 14V17.5M4 9C4 9 4.35367 9.73682 5.10628 10.6448M7.94861 13L5 16M7.94861 13C6.6892 12.3266 5.75124 11.4228 5.10628 10.6448M16.0514 13L18.5 16M16.0514 13C17.3818 12.2887 18.3535 11.3202 19 10.5144M5.10628 10.6448L2 12M19 10.5144L22 12'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 21px 21px;
    width: 25px;
    height: 24px;
  }

  &:checked::after {
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M22 12C22 12 19 18 12 18C5 18 2 12 2 12C2 12 5 6 12 6C19 6 22 12 22 12Z'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3C/svg%3E");
  }
`;

const LayerList = styled.div`
  position: relative;
  display: flex;
  padding: 2px 2px 2px 5px;
  border-top: 1px solid rgba(200, 200, 200, 1);
  border-right: 1px solid rgba(200, 200, 200, 1);
  border-left: 1px solid rgba(200, 200, 200, 1);
  background: rgba(255, 255, 255, 1);
  height: 30px;

  &:last-child {
    border-bottom: 1px solid rgba(200, 200, 200, 1);
  }

  ${VisibleCheckBox} {
    left: 4px;
  }

  label {
    display: flex;
    flex: 1;
    align-items: center;
    width: 100%;

    span {
      margin: auto 10px auto 30px;
    }
  }
`;

const Container = styled.div`
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid rgba(128, 128, 128, 1);
  height: 100%;
`;

const PropertyContainer = styled.div`
  width: 100%;
  height: 100%;
`;

interface NumberedProps {
  shapeControlTab: string;
  onChangeShapeControlTab(e: React.ChangeEvent<HTMLInputElement>): void;
  onClickShapeControlTab(e: string): void;
}
const NumberedContent = React.memo((props: NumberedProps) => {
  const [t] = useTranslation();

  const handleClickLocationShapeTab = () =>
    props.onClickShapeControlTab('locationShape');

  return (
    <>
      <TabSwitch
        type="radio"
        name="shapeControlTab"
        value="locationShape"
        onChange={props.onChangeShapeControlTab}
        checked={props.shapeControlTab === 'locationShape'}
      />
      <Tab onClick={handleClickLocationShapeTab}>
        {t('organisms:EditorLocationItemList.title')}
      </Tab>
      <TabContent>
        <EditorLocationItemList />
      </TabContent>
    </>
  );
});

interface UnnumberedProps {
  shapeControlTab: string;
  onChangeShapeControlTab(e: React.ChangeEvent<HTMLInputElement>): void;
  onClickShapeControlTab(e: string): void;
}
const UnnumberedContent = React.memo((props: UnnumberedProps) => {
  const [t] = useTranslation();

  const handleClickOtherShapeTab = () =>
    props.onClickShapeControlTab('noLocationShape');

  return (
    <>
      <TabSwitch
        type="radio"
        name="shapeControlTab"
        value="noLocationShape"
        onChange={props.onChangeShapeControlTab}
        checked={props.shapeControlTab === 'noLocationShape'}
      />
      <Tab onClick={handleClickOtherShapeTab}>
        {t('organisms:EditorNoLocationItemList.title')}
      </Tab>
      <TabContent>
        <EditorNoLocationItemList />
      </TabContent>
    </>
  );
});

interface LayersProps {
  layers: LayerData[];
  shapeControlTab: string;
  onChangeShapeControlTab(e: React.ChangeEvent<HTMLInputElement>): void;
  onClickShapeControlTab(e: string): void;
}
const LayersContent = React.memo((props: LayersProps) => {
  const [t] = useTranslation();

  const handleClickLayerTab = () => props.onClickShapeControlTab('layer');

  return (
    <>
      <TabSwitch
        type="radio"
        name="shapeControlTab"
        value="layer"
        onChange={props.onChangeShapeControlTab}
        checked={props.shapeControlTab === 'layer'}
      />
      <Tab onClick={handleClickLayerTab}>
        {t('organisms:EditorOtherItemList.title')}
      </Tab>
      <TabContent>
        <Container>
          {props.layers.map((d, i) => (
            <LayerList key={i}>
              <VisibleCheckBox
                type="checkbox"
                onChange={d.onChange}
                checked={d.checked}
              />
              <label>
                <span>{d.label}</span>
              </label>
            </LayerList>
          ))}
        </Container>
      </TabContent>
    </>
  );
});

export type LayerData = {
  label: string;
  checked: boolean;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
};

interface Props extends NumberedProps, UnnumberedProps, LayersProps {
  layers: LayerData[];
  editLayer: React.RefObject<Konva.Layer>;
  transformer: React.RefObject<Konva.Transformer>;
  shapeControlTab: string;
  onChangeShapeControlTab(e: React.ChangeEvent<HTMLInputElement>): void;
  onClickShapeControlTab(e: string): void;
  shapeControlExpand: boolean;
}

/**
 * マップエディタ：シェイプ操作
 */
export const EditorShapeControl = (props: Props) => {
  return (
    <ShapeControlContainer
      className={classNames({ collapse: !props.shapeControlExpand })}
    >
      <TabContainer>
        <NumberedContent
          shapeControlTab={props.shapeControlTab}
          onChangeShapeControlTab={props.onChangeShapeControlTab}
          onClickShapeControlTab={props.onClickShapeControlTab}
        />
        <UnnumberedContent
          shapeControlTab={props.shapeControlTab}
          onChangeShapeControlTab={props.onChangeShapeControlTab}
          onClickShapeControlTab={props.onClickShapeControlTab}
        />
        <LayersContent
          layers={props.layers}
          shapeControlTab={props.shapeControlTab}
          onChangeShapeControlTab={props.onChangeShapeControlTab}
          onClickShapeControlTab={props.onClickShapeControlTab}
        />
      </TabContainer>
      <PropertyContainer>
        <EditorItemProperties
          editLayer={props.editLayer}
          transformer={props.transformer}
        />
      </PropertyContainer>
    </ShapeControlContainer>
  );
};
