import ReactModal from 'react-modal';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { SideMenuType, SideMenuTypes } from '../../types';

const OtherShapesMenuContent = styled.div`
  width: 100%;
  height: 100%;

  ul {
    display: flex;
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      position: relative;
      display: flex;
      width: 60px;
      height: 60px;
      background: rgba(62, 62, 62, 1);
      color: rgba(255, 255, 255, 1);
      border: 1px solid rgba(80, 80, 80, 1);

      &:hover {
        cursor: pointer;
        background: rgba(80, 80, 80, 1);
      }

      &:focus {
        outline: none;
      }

      &.selected {
        background: rgba(82, 82, 82, 1);
      }

      &.wc {
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
          background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 512 512' width='64px' height='64px' fill='%234B4B4B'%3E%3Cg%3E%3Crect x='247.09' y='18.527' width='29.967' height='474.002' fill='%23CCCCCC'%3E%3C/rect%3E%3Cpath d='M106.846,97.722c21.867,0,39.598-17.73,39.598-39.606c0-21.867-17.73-39.589-39.598-39.589c-21.885,0-39.598,17.722-39.598,39.589C67.248,79.992,84.961,97.722,106.846,97.722z' fill='%23CCCCCC'%3E%3C/path%3E%3Cpath d='M184.04,154.202c-8.026-27.097-26.002-45.054-46.244-45.054c-14.994,0-30.95,0-30.95,0s-15.956,0-30.949,0c-20.243,0-38.238,17.958-46.264,45.054L0.478,257.652c-2.153,8.715,3.172,17.608,11.877,19.742c8.724,2.153,17.448-2.946,19.6-11.66l29.062-103.13h8.573L19.02,341.994H66.7v133.068c0,10.169,8.252,18.411,18.411,18.411c10.178,0,18.429-8.242,18.429-18.411V341.994h10.141v133.068c0,10.169,8.252,18.411,18.43,18.411c10.159,0,18.411-8.242,18.411-18.411V341.994h44.13l-50.569-179.389h8.573l29.061,103.13c2.152,8.714,10.895,13.813,19.6,11.66c8.724-2.134,14.03-11.028,11.877-19.742L184.04,154.202z' fill='%23CCCCCC'%3E%3C/path%3E%3Cpath d='M423.174,97.722c21.886,0,39.598-17.73,39.598-39.606c0-21.867-17.712-39.589-39.598-39.589c-21.866,0-39.598,17.722-39.598,39.589C383.577,79.992,401.308,97.722,423.174,97.722z' fill='%23CCCCCC'%3E%3C/path%3E%3Cpath d='M471.93,108.902H367.884c-19.184,0-40.07,20.884-40.07,40.07v133.097c0,9.593,7.78,17.373,17.373,17.373c9.592,0,17.372-7.78,17.372-17.373V172.642h8.006v297.067c0,12.604,10.215,22.82,22.829,22.82c12.614,0,22.829-10.216,22.829-22.82V297.307h7.365v172.402c0,12.604,10.215,22.82,22.829,22.82c12.595,0,22.83-10.216,22.83-22.82V172.642h8.006v109.426c0,9.593,7.78,17.373,17.372,17.373c9.593,0,17.373-7.78,17.373-17.373V148.971C512,129.786,491.115,108.902,471.93,108.902z' fill='%23CCCCCC'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
          background-size: 36px 36px;
        }
      }

      &.restArea {
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
          background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23CCCCCC' d='M14.911 10c-.308 3.325-1.398 5.712-2.949 8h-4.925c-1.373-2.009-2.612-4.372-2.948-8h10.822zm2.089-2h-15c0 5.716 1.826 8.996 4 12h7c2.12-2.911 4-6.333 4-12zm1.119 2c-.057.701-.141 1.367-.252 2h1.55c-.449 1.29-1.5 2.478-2.299 2.914-.358 1.038-.787 1.981-1.26 2.852 3.274-1.143 5.846-4.509 6.142-7.766h-3.881zm-7.745-3.001c4.737-4.27-.98-4.044.117-6.999-3.783 3.817 1.409 3.902-.117 6.999zm-2.78.001c3.154-2.825-.664-3.102.087-5.099-2.642 2.787.95 2.859-.087 5.099zm9.406 15h-15v2h15v-2z'/%3E%3C/svg%3E");
          background-size: 36px 36px;
        }
      }

      &.outlet {
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
          background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 0 24 24' width='24px' fill='%23CCCCCC'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M12 2.02c-5.51 0-9.98 4.47-9.98 9.98s4.47 9.98 9.98 9.98 9.98-4.47 9.98-9.98S17.51 2.02 12 2.02zm0 17.96c-4.4 0-7.98-3.58-7.98-7.98S7.6 4.02 12 4.02 19.98 7.6 19.98 12 16.4 19.98 12 19.98zM12.75 5l-4.5 8.5h3.14V19l4.36-8.5h-3z'/%3E%3C/svg%3E");
          background-size: 36px 36px;
        }
      }
    }
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: 'rgba(0, 0, 0, 0)';
  width: 100vw;
  height: 100vh;
`;

interface Props extends ReactModal.Props {
  otherShapeSubMenuRef: any;
  scrollOffset: number;
  selectedMenu: SideMenuType;
  onClickMenu(menuId: string): void;
  onClickOtherShapes(): void;
}

/**
 * その他シェイプのサブメニュー
 */
export const MapEditorOtherShapeMenu = (props: Props) => {
  const [t] = useTranslation();

  return (
    <ReactModal
      {...props}
      parentSelector={() => props.otherShapeSubMenuRef.current}
      style={{
        overlay: {
          position: 'absolute',
          top: '0',
          left: '60px',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          width: '180px',
          height: '60px',
        },
        content: {
          top: -props.scrollOffset,
          left: '0',
          padding: '0',
          backgroundColor: 'rgba(40, 40, 40, 0.9)',
          border: 'none',
          borderRadius: '0',
          boxShadow: '3px 3px 10px rgba(0, 0, 0, 0.3)',
          width: '180px',
          height: '60px',
        },
      }}
      contentLabel="MapEditorOtherShapeMenu"
      overlayElement={(overlayProps, contentElement) => (
        <>
          <Overlay onClick={props.onRequestClose} />
          <div {...overlayProps}>{contentElement}</div>
        </>
      )}
    >
      <OtherShapesMenuContent onClick={props.onRequestClose}>
        <ul>
          <li
            title={`${t('pages:MapEditorOtherShapeMenu.subMenu.wc')}`}
            className={classNames({
              wc: true,
              selected: props.selectedMenu === SideMenuTypes.WC,
            })}
            onClick={() => props.onClickMenu(SideMenuTypes.WC)}
          />
          <li
            title={`${t('pages:MapEditorOtherShapeMenu.subMenu.restArea')}`}
            className={classNames({
              restArea: true,
              selected: props.selectedMenu === SideMenuTypes.REST_AREA,
            })}
            onClick={() => props.onClickMenu(SideMenuTypes.REST_AREA)}
          />
          <li
            title={`${t('pages:MapEditorOtherShapeMenu.subMenu.outlet')}`}
            className={classNames({
              outlet: true,
              selected: props.selectedMenu === SideMenuTypes.OUTLET,
            })}
            onClick={() => props.onClickMenu(SideMenuTypes.OUTLET)}
          />
        </ul>
      </OtherShapesMenuContent>
    </ReactModal>
  );
};
