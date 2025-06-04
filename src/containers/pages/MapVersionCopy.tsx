import { useEffect, useState } from 'react';

import { useAppDispatch } from '../../app/hooks';
import { AuthorityTypes, Jurisdiction } from '../../types';

import { SecurityUtil } from '../../utils';

import { searchJurisdictions, searchStores } from '../../actions';
import { appModule } from '../../modules';
import { useLanguage, useUser } from '../../selectors';

import {
  MapVersionCopy as Component,
  Condition,
  ConditionEvent,
  DestinationCompany,
  DestinationData,
  DestinationStore,
  SourceData,
} from '../../components/pages/MapVersionCopy';

export type CopyMapVersion = {
  mapId?: string;
  version?: number;
};

interface Props extends ReactModal.Props {
  source: SourceData;
  onExecuteCopy(destination: DestinationData): void;
  errors: Map<string, string>;
}

/**
 * マップ版数コピー
 *
 * @param props プロパティ
 * @returns {React.ReactElement} ReactElement
 */
export const MapVersionCopy = (props: Props): JSX.Element => {
  const { isOpen, source } = props;

  const dispatch = useAppDispatch();

  const lang = useLanguage();
  const user = useUser();

  const [jurisdictions, setJurisdictions] = useState<Jurisdiction[]>([]);
  const [companies, setCompanies] = useState<DestinationCompany[]>([]);
  const [stores, setStores] = useState<DestinationStore[]>([]);

  const [initSource, setInitSource] = useState<SourceData>(source);

  const [jurisdictionClass, setJurisdictionClass] = useState<string>();
  const handleChangeJurisdictionClass = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => setJurisdictionClass(e.target.value);

  const [companyCode, setCompanyCode] = useState<string>();
  const handleCompanyCode = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setCompanyCode(e.target.value);

  const [storeCode, setStoreCode] = useState<string>();
  const handleStoreCode = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setStoreCode(e.target.value);

  /**
   * 閉じる
   */
  const executeClose = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // 画面を閉じる
    if (props.onRequestClose) {
      props.onRequestClose(e);
    }
  };

  /**
   * キャンセルボタン押下
   */
  const handleClickCancel = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    // 画面を閉じる
    executeClose(e);
  };

  /**
   * 反映ボタン押下
   */
  const handleClickSubmit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    // コピー指示
    props.onExecuteCopy({
      mapId: source.mapId,
      version: source.version,
      jurisdictionClass: jurisdictionClass ?? '',
      companyCode: companyCode ?? '',
      storeCode: storeCode ?? '',
    });
  };

  const condition: Condition = {
    jurisdictionClass,
    companyCode,
    storeCode,
  };

  const conditionEvent: ConditionEvent = {
    onChangeJurisdictionClass: handleChangeJurisdictionClass,
    onChangeCompanyCode: handleCompanyCode,
    onChangeStoreCode: handleStoreCode,
  };

  /**
   * 企業リストを更新.
   */
  useEffect(() => {
    if (!jurisdictionClass) {
      setCompanies([]);
      setCompanyCode('');
      return;
    }

    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      await dispatch(
        searchStores({ jurisdictionClass }, ({ data }) => {
          if (data?.length > 0) {
            const map = new Map();
            data.forEach((d) =>
              map.set(d.companyCode, {
                jurisdictionClass: d.jurisdictionClass,
                companyCode: d.companyCode,
                companyName: d.companyName,
              }),
            );
            const companies = Array.from(map.values());

            // 企業リスト更新
            setCompanies(companies);

            if (initSource.companyCode) {
              // 初期表示時にコピー元企業を選択
              setCompanyCode(initSource.companyCode);
              setInitSource((data) => ({
                ...data,
                companyCode: '',
              }));
            } else {
              // 先頭の企業を選択
              setCompanyCode(companies[0].companyCode);
            }
          } else {
            // 企業リスト更新
            setCompanies([]);
            setCompanyCode('');
          }
          dispatch(appModule.actions.updateLoading(false));
        }),
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jurisdictionClass]);

  /**
   * 店舗リストを更新.
   */
  useEffect(() => {
    if (!companyCode) {
      setStores([]);
      setStoreCode('');
      return;
    }

    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      await dispatch(
        searchStores({ jurisdictionClass, companyCode }, ({ data }) => {
          if (data?.length > 0) {
            const map = new Map();
            data.forEach((d) =>
              map.set(d.storeCode, {
                jurisdictionClass: d.jurisdictionClass,
                companyCode: d.companyCode,
                storeCode: d.storeCode,
                storeName: d.storeName,
              }),
            );
            const stores = Array.from(map.values());

            // 店舗リスト更新
            setStores(stores);

            if (initSource.storeCode) {
              // 初期表示時にコピー元店舗を選択
              setStoreCode(initSource.storeCode);
              setInitSource((data) => ({
                ...data,
                storeCode: '',
              }));
            } else {
              // 先頭の店舗を選択
              setStoreCode(stores[0].storeCode);
            }
          }
          dispatch(appModule.actions.updateLoading(false));
        }),
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyCode]);

  /**
   * Load, Unload 処理
   */
  useEffect(() => {
    if (!isOpen) {
      setJurisdictions([]);
      setJurisdictionClass('');
      return;
    }

    setInitSource({ ...source });

    (async () => {
      dispatch(appModule.actions.updateLoading(true));

      await dispatch(
        searchJurisdictions(({ data }) => {
          setJurisdictions(data);
          setJurisdictionClass(source.jurisdictionClass);
          setInitSource((data) => ({
            ...data,
            jurisdictionClass: '',
          }));
        }),
      );

      dispatch(appModule.actions.updateLoading(false));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Component
      {...props}
      lang={lang}
      timeZone={user.timeZone}
      jurisdictions={jurisdictions}
      companies={companies}
      stores={stores}
      condition={condition}
      conditionEvent={conditionEvent}
      canJurisdictionSelect={SecurityUtil.hasAnyAuthority(user, [
        AuthorityTypes.JURISDICTION_SELECT,
      ])}
      onClickCancel={handleClickCancel}
      onClickSubmit={handleClickSubmit}
      errors={props.errors}
    />
  );
};
