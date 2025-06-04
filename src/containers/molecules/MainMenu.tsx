import { useCallback, useState } from 'react';

import { MainMenu as Component } from '../../components/molecules';
import { MenuWindow } from '../pages/MenuWindow';

export const MainMenu = () => {
  const [menuWindowOpen, setMenuWindowOpen] = useState(false);

  const showMenuWindow = () => {
    setMenuWindowOpen(true);
  };

  const hideMenuWindow = useCallback(
    () => setMenuWindowOpen(false),
    []
  );

  return (
    <>
      <Component onClickMenu={showMenuWindow} />
      <MenuWindow isOpen={menuWindowOpen} onClose={hideMenuWindow} />
    </>
  );
};
