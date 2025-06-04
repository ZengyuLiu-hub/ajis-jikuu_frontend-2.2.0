import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector } from '../app/hooks';
import { CompanyState } from '../modules/company';

export const useCompanyState = (): CompanyState =>
  useAppSelector(({ company }) => company);

const companyData = createSelector(
  (state: CompanyState) => state.data,
  (data) => data
);
export const useCompanyData = () =>
  useAppSelector(({ company }) => companyData(company));

const companyTotalHits = createSelector(
  (state: CompanyState) => state.hits,
  (hits) => hits
);
export const useCompanyTotalHits = () =>
  useAppSelector(({ company }) => companyTotalHits(company));
