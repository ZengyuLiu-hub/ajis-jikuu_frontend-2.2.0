import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Jurisdiction, Language } from '../../types';
import { DateTimeUtil } from '../../utils/DateTimeUtil';

import {
  CancelButton,
  Dropdown,
  SubmitButton,
  ItemLabel as Title,
} from '../atoms';
import {
  ModalCommands,
  ModalContent,
  ModalTemplate as Template,
} from '../templates';

const Wrapper = styled.section`
  min-width: 800px;
`;

const MetaData = styled.div`
  display: grid;
  grid-template-columns: auto auto auto;
  grid-column-gap: 5px;
  margin-bottom: 30px;
`;

const Source = styled.div``;

const Destination = styled.div``;

const TitleRow = styled.div`
  width: 100%;
  height: 33px;
`;

const RightArrow = styled.div`
  position: relative;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 100%;

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
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='48' height='48' viewBox='0 0 512 512'%3E%3Cg%3E%3Cpath d='M499.436,225.905L295.858,24.536c-16.623-16.438-43.428-16.305-59.866,0.328c-16.438,16.613-16.294,43.418,0.329,59.856l130.356,128.958H42.329C18.956,213.679,0,232.624,0,255.997c0,23.383,18.956,42.328,42.329,42.328h324.347L236.321,427.273c-16.623,16.438-16.767,43.254-0.329,59.867c16.438,16.622,43.243,16.766,59.866,0.328l203.578-201.368c8.044-7.963,12.564-18.792,12.564-30.102C512,244.685,507.479,233.866,499.436,225.905z' fill='%234b4b4b'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");
    background-size: 30px 30px;
  }
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  min-height: 33px;
`;

const ItemLabel = styled.div`
  display: flex;
  align-items: center;
  min-width: 120px;
  height: 100%;
`;

const ItemValue = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  > span {
    color: rgba(75, 0, 130, 1);
  }
`;

const ErrorMessage = styled.span`
  color: rgba(255, 0, 0, 1);
`;

export type SourceData = {
  mapId: string;
  version: number;
  jurisdictionClass: string;
  jurisdictionName: string;
  companyCode: string;
  companyName: string;
  storeCode: string;
  storeName: string;
  inventoryDate?: Date;
  zoneCode: string;
  zoneName: string;
  doCode: string;
  doName: string;
};

export type DestinationData = {
  mapId: string;
  version: number;
  jurisdictionClass: string;
  companyCode: string;
  storeCode: string;
};

export type DestinationCompany = {
  jurisdictionClass: string;
  companyCode: string;
  companyName: string;
};

export type DestinationStore = {
  jurisdictionClass: string;
  companyCode: string;
  storeCode: string;
  storeName: string;
};

export type Condition = {
  jurisdictionClass?: string;
  companyCode?: string;
  storeCode?: string;
};

export type ConditionEvent = {
  onChangeJurisdictionClass(e: React.ChangeEvent<HTMLSelectElement>): void;
  onChangeCompanyCode(e: React.ChangeEvent<HTMLSelectElement>): void;
  onChangeStoreCode(e: React.ChangeEvent<HTMLSelectElement>): void;
};

interface Props extends ReactModal.Props {
  lang: Language;
  timeZone: string;
  jurisdictions: Jurisdiction[];
  companies: DestinationCompany[];
  stores: DestinationStore[];
  source: SourceData;
  condition: Condition;
  conditionEvent: ConditionEvent;
  canJurisdictionSelect: boolean;
  onClickCancel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  onClickSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  errors: Map<string, string>;
}

/**
 * マップ版数コピー
 */
export const MapVersionCopy = (props: Props) => {
  const { source, condition, conditionEvent, errors } = props;

  const [t] = useTranslation();

  return (
    <Template
      {...props}
      title={t('pages:MapVersionCopy.title')}
      onRequestClose={props.onClickCancel}
      contentLabel="MapVersionCopy"
    >
      <Wrapper>
        <ModalContent>
          <MetaData>
            {/** コピー元 */}
            <Source>
              <TitleRow>
                <Title
                  label={t('pages:MapVersionCopy.metaData.source.title')}
                />
              </TitleRow>
              <ItemRow>
                <ItemLabel>
                  <span>
                    {t('pages:MapVersionCopy.metaData.source.jurisdictionName')}
                  </span>
                </ItemLabel>
                <ItemValue>
                  <span>{source.jurisdictionName}</span>
                </ItemValue>
              </ItemRow>
              <ItemRow>
                <ItemLabel>
                  <span>
                    {t('pages:MapVersionCopy.metaData.source.companyName')}
                  </span>
                </ItemLabel>
                <ItemValue>
                  <span>{source.companyName}</span>
                </ItemValue>
              </ItemRow>
              <ItemRow>
                <ItemLabel>
                  <span>
                    {t('pages:MapVersionCopy.metaData.source.storeName')}
                  </span>
                </ItemLabel>
                <ItemValue>
                  <span>{source.storeName}</span>
                </ItemValue>
              </ItemRow>
              <ItemRow>
                <ItemLabel>
                  <span>
                    {t('pages:MapVersionCopy.metaData.source.zoneName')}
                  </span>
                </ItemLabel>
                <ItemValue>
                  <span>{source.zoneName}</span>
                </ItemValue>
              </ItemRow>
              <ItemRow>
                <ItemLabel>
                  <span>
                    {t('pages:MapVersionCopy.metaData.source.doName')}
                  </span>
                </ItemLabel>
                <ItemValue>
                  <span>{source.doName}</span>
                </ItemValue>
              </ItemRow>
              <ItemRow>
                <ItemLabel>
                  <span>
                    {t(
                      'pages:MapVersionCopy.metaData.source.inventoryDate.label',
                    )}
                  </span>
                </ItemLabel>
                <ItemValue>
                  <span>
                    {source.inventoryDate &&
                      DateTimeUtil.parseDateToFormatString(
                        source.inventoryDate,
                        t(
                          'pages:MapVersionCopy.metaData.source.inventoryDate.format',
                        ),
                        props.lang,
                        props.timeZone,
                      )}
                  </span>
                </ItemValue>
              </ItemRow>
              <ItemRow>
                <ItemLabel>
                  <span>
                    {t('pages:MapVersionCopy.metaData.source.version')}
                  </span>
                </ItemLabel>
                <ItemValue>
                  <span>{source.version}</span>
                </ItemValue>
              </ItemRow>
            </Source>
            <RightArrow />
            {/** コピー先 */}
            <Destination>
              <TitleRow>
                <Title
                  label={t('pages:MapVersionCopy.metaData.destination.title')}
                />
              </TitleRow>
              <ItemRow>
                <ItemLabel>
                  <span>
                    {t(
                      'pages:MapVersionCopy.metaData.destination.jurisdictionName',
                    )}
                  </span>
                </ItemLabel>
                <ItemValue>
                  <Dropdown
                    items={props.jurisdictions}
                    valueField="jurisdictionClass"
                    labelField="jurisdictionName"
                    onChange={conditionEvent.onChangeJurisdictionClass}
                    value={condition.jurisdictionClass}
                    disabled={!props.canJurisdictionSelect}
                  />
                </ItemValue>
              </ItemRow>
              <ItemRow>
                <ItemLabel>
                  <span>
                    {t('pages:MapVersionCopy.metaData.destination.companyName')}
                  </span>
                </ItemLabel>
                <ItemValue>
                  <Dropdown
                    items={props.companies}
                    valueField="companyCode"
                    labelField="companyName"
                    onChange={conditionEvent.onChangeCompanyCode}
                    value={condition.companyCode}
                    disabled={!condition.companyCode}
                  />
                </ItemValue>
              </ItemRow>
              {errors.has('companyCode') && (
                <ItemRow>
                  <ErrorMessage>{errors.get('companyCode')}</ErrorMessage>
                </ItemRow>
              )}
              <ItemRow>
                <ItemLabel>
                  <span>
                    {t('pages:MapVersionCopy.metaData.destination.storeName')}
                  </span>
                </ItemLabel>
                <ItemValue>
                  <Dropdown
                    items={props.stores}
                    valueField="storeCode"
                    labelField="storeName"
                    onChange={conditionEvent.onChangeStoreCode}
                    value={condition.storeCode}
                    disabled={!condition.storeCode}
                  />
                </ItemValue>
              </ItemRow>
              {errors.has('storeCode') && (
                <ItemRow>
                  <ErrorMessage>{errors.get('storeCode')}</ErrorMessage>
                </ItemRow>
              )}
            </Destination>
          </MetaData>
        </ModalContent>
        <ModalCommands>
          <CancelButton onClick={props.onClickCancel}>
            {t('pages:MapVersionCopy.command.cancel')}
          </CancelButton>
          <SubmitButton onClick={props.onClickSubmit}>
            {t('pages:MapVersionCopy.command.submit')}
          </SubmitButton>
        </ModalCommands>
      </Wrapper>
    </Template>
  );
};
