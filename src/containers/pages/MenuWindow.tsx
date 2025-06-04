import ReactModal from 'react-modal';
import { useLocation, useNavigate } from 'react-router-dom';

import * as routerConstants from '../../constants/router';

import { AuthorityTypes } from '../../types';
import { SecurityUtil } from '../../utils/SecurityUtil';

import { useAppDispatch } from '../../app/hooks';

import { unlockEditMap, verifyAuthentication } from '../../actions';

import { appModule } from '../../modules';
import {
  useEditMapVersion,
  useExclusiveLocked,
  useUser,
} from '../../selectors';

import { MenuWindow as Component } from '../../components/pages';

interface Props extends ReactModal.Props {
  onClose(): void;
}

/**
 * メニュー画面
 */
export const MenuWindow = (props: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const user = useUser();

  const editMapVersion = useEditMapVersion();
  const isExclusiveLocked = useExclusiveLocked();

  const { isOpen, onClose } = props;

  /**
   * 画面移動前処理
   */
  const beforeNavigate = async () => {
    // 現在の表示画面がマップ編集画面、かつ編集権限を有する、かつ自身がロックを取得している場合
    if (
      location.pathname.startsWith(routerConstants.PATH_MAPS) &&
      SecurityUtil.hasAnyAuthority(user, [AuthorityTypes.MAP_EDIT]) &&
      isExclusiveLocked
    ) {
      dispatch(unlockEditMap({ ...editMapVersion }));
    }
  };

  /**
   * メニュー選択
   */
  const handelClickMenu = async (path: string) => {
    dispatch(appModule.actions.updateLoading(true));

    await dispatch(
      verifyAuthentication(async () => {
        await beforeNavigate();

        navigate(path);
      }),
    );

    dispatch(appModule.actions.updateLoading(false));
  };

  return (
    <Component
      isOpen={isOpen}
      onClose={onClose}
      onClickMenu={handelClickMenu}
    />
  );
};
