import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MapStore } from '../../types';
import {
  CancelButton,
  SubmitButton,
  Dropdown,
  ItemLabel,
  Button,
  TextArea,
} from '../atoms';
import { ModalCommands, ModalContent } from '../templates';
import { ModalTemplate as Template } from '../templates';

const Wrapper = styled.section`
  min-width: 500px;
`;

const MapVersionCreateRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 30px;
  min-height: 35px;
`;

const MapVersionCreateRowItem = styled.div`
  display: flex;
  align-items: center;

  > span {
    display: inline-block;
    font-weight: bold;
    margin-right: 5px;
    white-space: nowrap;
  }
`;

const MapStoreRow = styled(MapVersionCreateRow)``;

const MapStoreRowItem = styled(MapVersionCreateRowItem)`
  &:not(:first-child) {
    margin-left: 30px;
  }

  > span:first-child {
    color: rgba(102, 102, 102, 1);
  }

  > span:not(first-child) {
    color: rgba(75, 0, 130, 1);
  }
`;

const InventoryRow = styled(MapVersionCreateRow)`
  &:not(:first-child) {
    margin-top: 5px;
  }
`;

const InventoryRowItem = styled(MapVersionCreateRowItem)`
  > span:first-child {
    color: rgba(102, 102, 102, 1);
    min-width: 150px;
  }

  > button {
    margin-left: 10px;
  }

  .hidden {
    visibility: hidden;
  }

  > textarea {
    min-width: 400px;
    max-width: 100%;
    min-height: 100px;
    max-height: 300px;
  }
`;

const PlusButton = styled(Button)`
  padding: 0;
  border: 1px solid rgba (0, 0, 0, 1);
  background-color: rgba(255, 255, 255, 1);
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M20 12L4 12M12 4L12 20'/%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 15px 15px;
  width: 24px;
  height: 24px;

  &:hover {
    background-color: rgba(197, 197, 197, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M20 12L4 12M12 4L12 20'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 15px 15px;

    &:disabled {
      background-color: rgba(197, 197, 197, 1);
      background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M20 12L4 12M12 4L12 20'/%3E%3C/svg%3E");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 15px 15px;
    }
  }
`;

const MinusButton = styled(Button)`
  padding: 0;
  border: 1px solid rgba (0, 0, 0, 1);
  background-color: rgba(255, 255, 255, 1);
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M20,12 L4,12'/%3E%3C/svg%3E");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 15px 15px;
  width: 24px;
  height: 24px;

  &:hover {
    background-color: rgba(197, 197, 197, 1);
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M20,12 L4,12'/%3E%3C/svg%3E");
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 15px 15px;

    &:disabled {
      background-color: rgba(197, 197, 197, 1);
      background-image: url("data:image/svg+xml;charset=utf8,%3Csvg width='48px' height='48px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' stroke='%233e3e3e' stroke-width='1' stroke-linecap='square' stroke-linejoin='miter' fill='none' color='%233e3e3e'%3E%3Cpath d='M20,12 L4,12'/%3E%3C/svg%3E");
      background-position: center center;
      background-repeat: no-repeat;
      background-size: 15px 15px;
    }
  }
`;

const ErrorMessage = styled.span`
  color: rgba(255, 0, 0, 1);
`;

interface Props extends ReactModal.Props {
  onClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickViewEditor(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickMinus(
    index: number,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void;
  onClickPlus(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickSave(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onChangeZoneCode: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onChangeDoCode: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onChangeNote: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeInventoryDate: (
    index: number,
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  zoneCode: string;
  doCode: string;
  inventoryDates: string[];
  note: string;
  mapStore: MapStore;
  selectableZones: any[];
  selectableDos: any[];
  selectableInventoryDates: any[];
  errors: Map<string, string>;
}

export const MapVersionCreate = (props: Props) => {
  const [t] = useTranslation();

  const {
    mapStore,
    inventoryDates,
    selectableDos,
    selectableInventoryDates,
    errors,
  } = props;

  const hasNotSelectableDos = selectableDos.length <= 1;
  const hasNotSelectableInventoryDates = selectableInventoryDates.length <= 1;
  // 棚卸日が選択可能な件数以上かどうか
  const hasMoreThanEqualSelectableInventoryDates =
    inventoryDates.length >= selectableInventoryDates.length - 1;

  return (
    <Template
      {...props}
      title={t('pages:MapVersionCreate.title')}
      onRequestClose={props.onClickCancel}
      contentLabel="MapVersionCreate"
    >
      <Wrapper>
        <ModalContent>
          <MapStoreRow>
            <MapStoreRowItem>
              <span>
                {t('pages:MapVersionCreate.mapStore.jurisdiction.label')}
              </span>
              <span>{`${mapStore.jurisdictionName}`}</span>
            </MapStoreRowItem>
            <MapStoreRowItem>
              <span>{t('pages:MapVersionCreate.mapStore.company.label')}</span>
              <span>{`${mapStore.companyName} (${mapStore.companyCode})`}</span>
            </MapStoreRowItem>
            <MapStoreRowItem>
              <span>{t('pages:MapVersionCreate.mapStore.store.label')}</span>
              <span>{`${mapStore.storeName} (${mapStore.storeCode})`}</span>
            </MapStoreRowItem>
          </MapStoreRow>
          {errors.has('jurisdictionClass') && (
            <MapStoreRow>
              <ErrorMessage>{errors.get('jurisdictionClass')}</ErrorMessage>
            </MapStoreRow>
          )}
          {errors.has('companyCode') && (
            <MapStoreRow>
              <ErrorMessage>{errors.get('companyCode')}</ErrorMessage>
            </MapStoreRow>
          )}
          {errors.has('storeCode') && (
            <MapStoreRow>
              <ErrorMessage>{errors.get('storeCode')}</ErrorMessage>
            </MapStoreRow>
          )}
          <MapStoreRow>
            <MapStoreRowItem>
              <span>
                {t('pages:MapVersionCreate.mapStore.storeAddress.label')}
              </span>
              <span>{`${t(
                'pages:MapVersionCreate.mapStore.storeAddress.mark'
              )}${mapStore.zipCode} ${mapStore.address1}${mapStore.address2}${
                mapStore.addressDetail
              }`}</span>
            </MapStoreRowItem>
          </MapStoreRow>
          <MapStoreRow>
            <MapStoreRowItem>
              <span>{t('pages:MapVersionCreate.mapStore.tel.label')}</span>
              <span>{`${mapStore.tel}`}</span>
            </MapStoreRowItem>
            <MapStoreRowItem>
              <span>{t('pages:MapVersionCreate.mapStore.fax.label')}</span>
              <span>{`${mapStore.fax}`}</span>
            </MapStoreRowItem>
          </MapStoreRow>
          <InventoryRow>
            <InventoryRowItem>
              <ItemLabel
                label={t('pages:MapVersionCreate.inventory.zone.label')}
              />
              <Dropdown
                items={props.selectableZones}
                valueField="value"
                labelField="label"
                onChange={props.onChangeZoneCode}
                value={props.zoneCode}
              />
            </InventoryRowItem>
          </InventoryRow>
          <InventoryRow>
            <InventoryRowItem>
              <ItemLabel
                label={t('pages:MapVersionCreate.inventory.do.label')}
              />
              <Dropdown
                items={props.selectableDos}
                disabled={hasNotSelectableDos}
                valueField="value"
                labelField="label"
                onChange={props.onChangeDoCode}
                value={props.doCode}
              />
            </InventoryRowItem>
          </InventoryRow>
          {props.inventoryDates.map((inventoryDate, index) => (
            <InventoryRow key={index}>
              <InventoryRowItem>
                <ItemLabel
                  label={t(
                    'pages:MapVersionCreate.inventory.inventoryDate.label'
                  )}
                  className={index === 0 ? '' : 'hidden'}
                />
              </InventoryRowItem>
              <InventoryRowItem>
                <Dropdown
                  items={props.selectableInventoryDates}
                  disabled={hasNotSelectableInventoryDates}
                  valueField="value"
                  labelField="label"
                  onChange={(e) => props.onChangeInventoryDate(index, e)}
                  value={inventoryDate}
                />
                <MinusButton
                  onClick={(e) => props.onClickMinus(index, e)}
                  disabled={hasNotSelectableInventoryDates}
                ></MinusButton>
                <PlusButton
                  onClick={props.onClickPlus}
                  className={index === 0 ? '' : 'hidden'}
                  disabled={
                    hasNotSelectableInventoryDates ||
                    hasMoreThanEqualSelectableInventoryDates
                  }
                ></PlusButton>
              </InventoryRowItem>
            </InventoryRow>
          ))}
          <InventoryRow>
            <InventoryRowItem>
              <ItemLabel
                label={t('pages:MapVersionCreate.inventory.note.label')}
              />
              <TextArea
                onChange={props.onChangeNote}
                value={props.note}
                maxLength={500}
              ></TextArea>
            </InventoryRowItem>
          </InventoryRow>
        </ModalContent>
        <ModalCommands>
          <CancelButton onClick={props.onClickCancel}>
            {t('pages:MapVersionCreate.command.cancel')}
          </CancelButton>
          <SubmitButton onClick={props.onClickSave}>
            {t('pages:MapVersionCreate.command.save')}
          </SubmitButton>
          <SubmitButton onClick={props.onClickViewEditor}>
            {t('pages:MapVersionCreate.command.viewEditor')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
