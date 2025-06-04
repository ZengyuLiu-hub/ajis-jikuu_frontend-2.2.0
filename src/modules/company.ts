// src/modules/company.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Company } from '../types/company';

export type CompanyState = {
  data: Company[];         // 企业数据列表
  hits: number;           // 总记录数
};

const initialState: CompanyState = {
  data: [],
  hits: 0,
};

const slice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    // 设置企业数据
    setData(state: CompanyState, action: PayloadAction<Company[]>) {
      state.data = action.payload;
    },
    // 设置总记录数
    setHits(state: CompanyState, action: PayloadAction<number>) {
      state.hits = action.payload;
    },
    // 清除状态
    clearState(state: CompanyState) {
      return initialState;
    },
  },
});

export const companyModule = slice;