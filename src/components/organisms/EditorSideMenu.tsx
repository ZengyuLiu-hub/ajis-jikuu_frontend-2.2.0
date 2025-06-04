import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { SideMenuType, SideMenuTypes } from '../../types';

import packageInfo from '../../../package.json';

const MenuArea = styled.div`
  display: grid;
  grid-template-rows: 1fr auto;
  background-color: rgba(62, 62, 62, 1);
  width: 0;
  max-height: 100%;
  min-height: 0;
  height: 100%;
  visibility: hidden;

  &.visible {
    visibility: visible;
    width: 120px;
  }
`;

const Menu = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const MenuGroupTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  background-color: rgba(102, 102, 102, 1);
  color: rgba(200, 200, 200, 1);
`;

const MenuGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 60px);
  grid-auto-rows: 60px;
  background-color: rgba(62, 62, 62, 1);

  button {
    position: relative;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(80, 80, 80, 1);
    background: rgba(62, 62, 62, 1);
    color: rgba(200, 200, 200, 1);
    width: 60px;
    height: 60px;
    cursor: pointer;
    font-size: 9pt;
    font-weight: normal;

    &:hover {
      background: rgba(80, 80, 80, 1);
    }

    &:focus {
      outline: none;
    }

    &.selected {
      background: rgba(82, 82, 82, 1);
    }

    &.selectTool {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48' height='48' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%23c8c8c8' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpolygon points='7 20 7 4 19 16 12 16 7 21'/%3E%3C/svg%3E");
        background-size: 30px 30px;
      }
    }

    &.pen {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48' height='48' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%23c8c8c8' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%23c8c8c8'%3E%3Cpath d='M18.4142136 4.41421356L19.5857864 5.58578644C20.366835 6.36683502 20.366835 7.63316498 19.5857864 8.41421356L8 20 4 20 4 16 15.5857864 4.41421356C16.366835 3.63316498 17.633165 3.63316498 18.4142136 4.41421356zM14 6L18 10'/%3E%3C/svg%3E");
        background-size: 30px 30px;
      }
    }

    &.line {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48' height='48' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%23c8c8c8' stroke-width='1' stroke-linecap='butt' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cline x1='0' y1='11' x2='24' y2='11'/%3E%3C/svg%3E");
        background-size: 30px 30px;
      }
    }

    &.rect {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48' height='48' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%23c8c8c8' stroke-width='1' stroke-linecap='butt' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Crect x='0' y='0' width='24' height='24'/%3E%3C/svg%3E");
        background-size: 30px 30px;
      }
    }

    &.ellipse {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48' height='48' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%23c8c8c8' stroke-width='1' stroke-linecap='butt' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cellipse cx='11' cy='11' rx='10' ry='5'/%3E%3C/svg%3E");
        background-size: 30px 30px;
      }
    }

    &.text {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48' height='48' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%23c8c8c8' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%23c8c8c8'%3E%3Cpath d='M4 8L5 4H12M20 8L19 4H12M12 4V20M12 20H8M12 20H16'/%3E%3C/svg%3E");
        background-size: 30px 30px;
      }
    }

    &.image {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48' height='48' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%23c8c8c8' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%23c8c8c8'%3E%3Crect width='18' height='18' x='3' y='3'/%3E%3Cpath stroke-linecap='round' d='M3 14l4-4 11 11'/%3E%3Ccircle cx='13.5' cy='7.5' r='2.5'/%3E%3Cpath stroke-linecap='round' d='M13.5 16.5L21 9'/%3E%3C/svg%3E");
        background-size: 30px 30px;
      }
    }

    &.arrow1 {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 21 V27 H36 V34 L46 24 L36 14 V21 L2 21' fill='none' stroke='%23c8c8c8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1'/%3E%3C/svg%3E");
        background-size: 30px 30px;
      }
    }

    &.arrow2 {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 24 L12 34 V27 H36 V34 L46 24 L36 14 V21 H12 V14 L2 24' fill='none' stroke='%23c8c8c8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1'/%3E%3C/svg%3E");
        background-size: 30px 30px;
      }
    }

    &.pillar {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' stroke='%23c8c8c8' stroke-width='1' stroke-linecap='butt' stroke-linejoin='miter' fill='none'%3E%3Crect x='15' y='3' width='18' height='5'%3E%3C/rect%3E%3Crect x='19' y='8' width='10' height='32'%3E%3C/rect%3E%3Crect x='15' y='40' width='18' height='5'%3E%3C/rect%3E%3C/svg%3E");
        background-size: 36px 36px;
      }
    }

    &.rectText {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%23c8c8c8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1'%3E%3Crect x='1' y='1' width='46' height='46'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'  font-size='10pt'%3EText%3C/text%3E%3C/svg%3E");
        background-size: 36px 36px;
      }
    }

    &.ellipseText {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' stroke='%23c8c8c8' stroke-width='1' stroke-linecap='butt' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cellipse cx='24' cy='23' rx='23' ry='17'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='10pt'%3EText%3C/text%3E%3C/svg%3E");
        background-size: 36px 36px;
      }
    }

    &.area {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%23c8c8c8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1'%3E%3Crect x='1' y='1' width='46' height='46'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='10pt'%3EArea%3C/text%3E%3C/svg%3E");
        background-size: 36px 36px;
      }
    }

    &.gondola {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%23c8c8c8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1'%3E%3Crect x='1' y='9' width='46' height='27'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='10pt'%3E0101%3C/text%3E%3C/svg%3E");
        background-size: 36px 36px;
      }
    }

    &.meshend {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%23c8c8c8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1'%3E%3Ctext x='6' y='29' font-size='10pt'%3E0101%3C/text%3E%3Cline x1='3' y1='35' x2='44' y2='35' /%3E%3Cline x1='3' y1='38' x2='44' y2='38' /%3E%3C/svg%3E");
        background-size: 36px 36px;
      }
    }

    &.table {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%23c8c8c8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1'%3E%3Crect x='15' y='0' width='18' height='9'/%3E%3Crect x='15' y='9' width='9' height='15'/%3E%3Crect x='24' y='9' width='9' height='15'/%3E%3Crect x='15' y='24' width='9' height='15'/%3E%3Crect x='24' y='24' width='9' height='15'/%3E%3Crect x='15' y='39' width='18' height='9'/%3E%3C/svg%3E");
        background-size: 36px 36px;
      }
    }

    &.wall {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='none' stroke='%23c8c8c8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1'%3E%3Crect x='0' y='16' width='16' height='12'/%3E%3Crect x='16' y='16' width='16' height='12'/%3E%3Crect x='32' y='16' width='16' height='12'/%3E%3C/svg%3E");
        background-size: 36px 36px;
      }
    }

    &.specialShape {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2 2 H46 V12 H12 V46 H2 L2 2' fill='none' stroke='%23c8c8c8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1'/%3E%3C/svg%3E");
        background-size: 36px 36px;
      }
    }

    &.otherShapes {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='1'%3E%3C/circle%3E%3Ccircle cx='19' cy='12' r='1'%3E%3C/circle%3E%3Ccircle cx='5' cy='12' r='1'%3E%3C/circle%3E%3C/svg%3E");
        background-size: 36px 36px;
      }
    }

    &.circleArrow {
      &::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: transparent;
        background-position: center center;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='512' height='512' viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xml:space='preserve' version='1.1'%3E%3Cg%3E%3Cpath d='M508.112,236.074c-3.206-2.717-7.682-3.364-11.52-1.668l-28.206,12.446c-14.667-46.552-43.096-86.975-80.565-116.432c-40.739-32.058-92.228-51.202-148.08-51.195C107.327,79.234,0.007,186.554,0,318.96c0,3.061,1.272,5.979,3.514,8.049c2.242,2.084,5.246,3.133,8.293,2.903l111.229-8.408c5.914-0.445,10.405-5.504,10.147-11.426c-0.043-0.906-0.065-1.826-0.065-2.76c-0.014-10.362,2.479-22.788,6.719-35.486c6.331-19.065,16.514-38.777,26.682-54.155c5.074-7.69,10.147-14.316,14.574-19.173c2.199-2.429,4.24-4.412,5.943-5.836c0.668-0.574,1.272-1.02,1.811-1.408c39.086,0.647,74.608,14.186,101.764,36.082c25.62,20.675,43.692,48.658,50.526,80.192l-46.336,20.251c-3.852,1.682-6.404,5.425-6.576,9.623c-0.166,4.204,2.084,8.128,5.792,10.125l156.697,83.936c2.968,1.595,6.525,1.739,9.607,0.374c3.09-1.351,5.383-4.068,6.216-7.337l45.123-177.342C512.696,243.088,511.316,238.79,508.112,236.074z M448.717,405.489l-124.394-66.638l33.61-14.689c4.556-1.991,7.207-6.784,6.46-11.7c-6.173-40.753-28.271-76.634-59.998-102.217c-31.734-25.584-73.192-41.005-118.422-41.005c-0.108,0-0.208,0.015-0.309,0.015c-0.044,0-0.086,0-0.13,0c-24.569,0.05-48.025,4.642-69.405,12.949c-5.656,2.2-8.451,8.559-6.252,14.215c2.191,5.648,8.551,8.451,14.214,6.259c10.305-4.017,21.2-7.007,32.511-8.947c-1.861,2.444-3.737,4.995-5.62,7.704c-9.78,14.179-19.575,31.749-27.063,50.182c-6.511,16.097-11.333,32.777-12.49,48.744l-89.138,6.733c2.983-55.435,26.64-105.293,63.455-142.123c39.438-39.431,93.816-63.784,153.994-63.784c50.806,0,97.453,17.362,134.505,46.488c37.045,29.14,64.403,70.03,76.447,117.013c0.798,3.119,2.946,5.734,5.843,7.143c2.896,1.409,6.288,1.466,9.227,0.173l19.058-8.408L448.717,405.489z' style='fill: rgb(200, 200, 200);'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
        background-size: 30px 30px;
      }
    }
  }
`;

const MenuButton = styled.button``;

const OtherShapesMenu = styled.div`
  position: relative;
`;

const OtherShapesSubMenu = styled.div`
  position: fixed;
  z-index: 1;
`;

const AppVersion = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;

  > span {
    color: rgba(200, 200, 200, 1);
    font-size: 9pt;
  }
`;

interface SideMenuButtonProps {
  selected: boolean;
  onClickMenu(menuId: string): void;
}

const SelectTool = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.selectionGroup.selectTool')}`}
      className={classNames({
        selectTool: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.SELECT_TOOL)}
    ></MenuButton>
  );
});

const AreaButton = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.areaGroup.area')}`}
      className={classNames({
        area: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.AREA)}
    ></MenuButton>
  );
});

const TableButton = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.numberedGroup.table')}`}
      className={classNames({
        table: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.TABLE)}
    ></MenuButton>
  );
});

const WallButton = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.numberedGroup.wall')}`}
      className={classNames({
        wall: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.WALL)}
    ></MenuButton>
  );
});

const IslandButton = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.numberedGroup.island')}`}
      className={classNames({
        island: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.ISLAND)}
    >
      Island
    </MenuButton>
  );
});

const GondolaButton = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.numberedGroup.gondola')}`}
      className={classNames({
        gondola: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.GONDOLA)}
    ></MenuButton>
  );
});

const MeshendButton = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.numberedGroup.meshend')}`}
      className={classNames({
        meshend: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.MESH_END)}
    ></MenuButton>
  );
});

const PillarButton = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.unnumberedGroup.pillar')}`}
      className={classNames({
        pillar: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.PILLAR)}
    ></MenuButton>
  );
});

const EllipseTextButton = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.unnumberedGroup.ellipseText')}`}
      className={classNames({
        ellipseText: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.ELLIPSE_TEXT)}
    ></MenuButton>
  );
});

const RectTextButton = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.unnumberedGroup.rectText')}`}
      className={classNames({
        rectText: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.RECT_TEXT)}
    ></MenuButton>
  );
});

const Arrow1Button = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.unnumberedGroup.arrow1')}`}
      className={classNames({
        arrow1: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.ARROW1)}
    ></MenuButton>
  );
});

const Arrow2Button = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.unnumberedGroup.arrow2')}`}
      className={classNames({
        arrow2: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.ARROW2)}
    ></MenuButton>
  );
});

const SpecialShapeButton = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.unnumberedGroup.specialShape')}`}
      className={classNames({
        specialShape: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.SPECIAL_SHAPE)}
    ></MenuButton>
  );
});

const PenButton = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.commonGroup.pen')}`}
      className={classNames({
        pen: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.PEN)}
    ></MenuButton>
  );
});

const LineButton = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.commonGroup.line')}`}
      className={classNames({
        line: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.LINE)}
    ></MenuButton>
  );
});

const RectButton = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.commonGroup.rect')}`}
      className={classNames({
        rect: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.RECT)}
    ></MenuButton>
  );
});

const EllipseButton = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.commonGroup.ellipse')}`}
      className={classNames({
        ellipse: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.ELLIPSE)}
    ></MenuButton>
  );
});

const PolygonButton = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.commonGroup.polygon')}`}
      className={classNames({
        polygon: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.POLYGON)}
    >
      {t('organisms:EditorSideMenu.commonGroup.polygon')}
    </MenuButton>
  );
});

const TextButton = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.commonGroup.text')}`}
      className={classNames({
        text: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.TEXT)}
    ></MenuButton>
  );
});

const CircleArrowButton = React.memo((props: SideMenuButtonProps) => {
  const [t] = useTranslation();

  return (
    <MenuButton
      title={`${t('organisms:EditorSideMenu.commonGroup.circleArrow')}`}
      className={classNames({
        circleArrow: true,
        selected: props.selected,
      })}
      onClick={() => props.onClickMenu(SideMenuTypes.CIRCLE_ARROW)}
    ></MenuButton>
  );
});

interface OtherShapesButtonProps {
  otherShapeSubMenuRef: any;
  selectedWc: boolean;
  selectedRestArea: boolean;
  selectedOutlet: boolean;
  isOpenOtherShapes: boolean;
  onClickOtherShapes(): void;
}

const OtherShapesButton = React.memo(
  ({
    otherShapeSubMenuRef,
    selectedWc,
    selectedRestArea,
    selectedOutlet,
    isOpenOtherShapes,
    onClickOtherShapes,
  }: OtherShapesButtonProps) => {
    const [t] = useTranslation();

    return (
      <OtherShapesMenu>
        <OtherShapesSubMenu ref={otherShapeSubMenuRef} />
        <MenuButton
          title={`${t('organisms:EditorSideMenu.commonGroup.otherShapes')}`}
          className={classNames({
            otherShapes: true,
            selected:
              isOpenOtherShapes ||
              selectedWc ||
              selectedRestArea ||
              selectedOutlet,
          })}
          onClick={onClickOtherShapes}
        />
      </OtherShapesMenu>
    );
  },
);

interface Props {
  selectedMenu: SideMenuType;
  visible: boolean;
  onClickMenu(menuId: string): void;
  onScrollMenu(e: React.UIEvent<HTMLDivElement>): void;
  otherShapeSubMenuRef: any;
  isOpenOtherShapes: boolean;
  onRequestCloseOtherShapes(): void;
  onClickOtherShapes(): void;
}

/**
 * マップエディタ：サイドメニュー
 */
export const EditorSideMenu = (props: Props) => {
  const [t] = useTranslation();

  return (
    <MenuArea className={classNames({ visible: props.visible })}>
      <Menu onScroll={props.onScrollMenu}>
        <MenuGroup>
          {/* 選択ツール */}
          <SelectTool
            selected={
              props.selectedMenu === SideMenuTypes.SELECT_TOOL ||
              props.selectedMenu === SideMenuTypes.PASTE
            }
            onClickMenu={props.onClickMenu}
          />
        </MenuGroup>
        <MenuGroupTitle>
          {t('organisms:EditorSideMenu.areaGroup.title')}
        </MenuGroupTitle>
        <MenuGroup>
          {/* エリア */}
          <AreaButton
            selected={props.selectedMenu === SideMenuTypes.AREA}
            onClickMenu={props.onClickMenu}
          />
        </MenuGroup>
        <MenuGroupTitle>
          {t('organisms:EditorSideMenu.numberedGroup.title')}
        </MenuGroupTitle>
        <MenuGroup>
          {/* テーブル */}
          <TableButton
            selected={props.selectedMenu === SideMenuTypes.TABLE}
            onClickMenu={props.onClickMenu}
          />
          {/* ウォール */}
          <WallButton
            selected={props.selectedMenu === SideMenuTypes.WALL}
            onClickMenu={props.onClickMenu}
          />
          {/* アイランド */}
          <IslandButton
            selected={
              props.selectedMenu === SideMenuTypes.CIRCLE_TABLE ||
              props.selectedMenu === SideMenuTypes.SQUARE_TABLE ||
              props.selectedMenu === SideMenuTypes.REGISTER_TABLE ||
              props.selectedMenu === SideMenuTypes.FREE_TEXT
            }
            onClickMenu={props.onClickMenu}
          />
          {/* ゴンドラ  */}
          <GondolaButton
            selected={props.selectedMenu === SideMenuTypes.GONDOLA}
            onClickMenu={props.onClickMenu}
          />
          {/* 編目エンド */}
          <MeshendButton
            selected={props.selectedMenu === SideMenuTypes.MESH_END}
            onClickMenu={props.onClickMenu}
          />
        </MenuGroup>
        <MenuGroupTitle>
          {t('organisms:EditorSideMenu.unnumberedGroup.title')}
        </MenuGroupTitle>
        <MenuGroup>
          {/* 長方形テキスト  */}
          <RectTextButton
            selected={props.selectedMenu === SideMenuTypes.RECT_TEXT}
            onClickMenu={props.onClickMenu}
          />
          {/* 楕円形テキスト  */}
          <EllipseTextButton
            selected={props.selectedMenu === SideMenuTypes.ELLIPSE_TEXT}
            onClickMenu={props.onClickMenu}
          />
          {/* 矢印１  */}
          <Arrow1Button
            selected={props.selectedMenu === SideMenuTypes.ARROW1}
            onClickMenu={props.onClickMenu}
          />
          {/* 矢印２  */}
          <Arrow2Button
            selected={props.selectedMenu === SideMenuTypes.ARROW2}
            onClickMenu={props.onClickMenu}
          />
          {/* 特殊型 */}
          <SpecialShapeButton
            selected={props.selectedMenu === SideMenuTypes.SPECIAL_SHAPE}
            onClickMenu={props.onClickMenu}
          />
          {/* 柱 */}
          <PillarButton
            selected={props.selectedMenu === SideMenuTypes.PILLAR}
            onClickMenu={props.onClickMenu}
          />
        </MenuGroup>
        <MenuGroupTitle>
          {t('organisms:EditorSideMenu.commonGroup.title')}
        </MenuGroupTitle>
        <MenuGroup>
          {/* ペン */}
          <PenButton
            selected={props.selectedMenu === SideMenuTypes.PEN}
            onClickMenu={props.onClickMenu}
          />
          {/* 線 */}
          <LineButton
            selected={props.selectedMenu === SideMenuTypes.LINE}
            onClickMenu={props.onClickMenu}
          />
          {/* 長方形 */}
          <RectButton
            selected={props.selectedMenu === SideMenuTypes.RECT}
            onClickMenu={props.onClickMenu}
          />
          {/* 楕円 */}
          <EllipseButton
            selected={props.selectedMenu === SideMenuTypes.ELLIPSE}
            onClickMenu={props.onClickMenu}
          />
          {/* 多角形 */}
          <PolygonButton
            selected={props.selectedMenu === SideMenuTypes.POLYGON}
            onClickMenu={props.onClickMenu}
          />
          {/* テキスト */}
          <TextButton
            selected={props.selectedMenu === SideMenuTypes.TEXT}
            onClickMenu={props.onClickMenu}
          />
          {/* 回転矢印 */}
          <CircleArrowButton
            selected={props.selectedMenu === SideMenuTypes.CIRCLE_ARROW}
            onClickMenu={props.onClickMenu}
          />
          {/* その他のシェイプ */}
          <OtherShapesButton
            {...props}
            selectedWc={props.selectedMenu === SideMenuTypes.WC}
            selectedRestArea={props.selectedMenu === SideMenuTypes.REST_AREA}
            selectedOutlet={props.selectedMenu === SideMenuTypes.OUTLET}
          />
        </MenuGroup>
      </Menu>
      <AppVersion>
        <span>{`v${packageInfo.version}`}</span>
      </AppVersion>
    </MenuArea>
  );
};
