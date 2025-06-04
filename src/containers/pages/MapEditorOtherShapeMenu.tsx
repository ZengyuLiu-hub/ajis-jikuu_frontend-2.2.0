import { SideMenuType } from '../../types';

import { MapEditorOtherShapeMenu as Component } from '../../components/pages';

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
  return <Component {...props} />;
};
