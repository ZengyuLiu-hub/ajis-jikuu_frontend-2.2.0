import { useState } from 'react';
import ReactModal from 'react-modal';

import { Language } from '../../types';
import { useAppDispatch } from '../../app/hooks';

import { appModule, authModule } from '../../modules';
import { useLanguage, useUser } from '../../selectors';

import { PersonalWindow as Component } from '../../components/pages';

interface Props extends ReactModal.Props {
  onClose(): void;
}

export const PersonalWindow = (props: Props) => {
  const dispatch = useAppDispatch();

  const { isOpen } = props;

  const currentLang = useLanguage();
  const user = useUser();

  const [lang, setLang] = useState<Language>(currentLang);

  const handleChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value as Language);
    dispatch(appModule.actions.updateLanguage(e.target.value as Language));
  };

  const handleClickLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    // ログアウト指示オン
    dispatch(authModule.actions.updateDoLogout(true));

    // 閉じる
    props.onClose();
  };

  return (
    <Component
      isOpen={isOpen}
      onRequestClose={props.onClose}
      userName={user.userName}
      selectedLang={lang}
      onChangeLang={handleChangeLang}
      onClickLogout={handleClickLogout}
    />
  );
};
