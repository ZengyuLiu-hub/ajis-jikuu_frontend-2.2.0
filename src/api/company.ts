import { Company as  Companies } from '../types/company';

import { http, Result } from '../app/http';

export interface CompanyCondition {
  jurisdictionClass: string;
  companyCode: string;
}

export interface SearchCompaniesCondition {
  companyCode?: string;
  jurisdictionClass?: string;
  companyName?: string;
  page?: number;
  pageRecords?: number;
}
export type CompanyResult = {
  data: Companies;
} & Result;

export type CompaniesResult = {
  data: Companies[];
  totalHits: number;
} & Result;

class Company {
  /**
   * 企業を取得します.
   *
   * @param condition 検索条件
   * @param condition.companyCode 企業コード
   * @param condition.jurisdictionClass 管轄区分
   * @param condition.companyName 企業名
   * @param condition.page ページ番号
   * @param condition.pageRecords 1ページの表示件数
   * @returns Promise<Response> リクエスト結果
   */
  getCompanys = async ({
    companyCode,
    jurisdictionClass,
    companyName,
    page,
    pageRecords,
  }: SearchCompaniesCondition) => {
    const paths = [];
    paths.push('api');
    paths.push('companies');
        
    if (companyCode) {
      paths.push(companyCode);
    }
    paths.push('company');
     const queries = [];
    if (jurisdictionClass) {
      queries.push(`jc=${jurisdictionClass}`);
    }
    if (companyName) {
      queries.push(`cn=${companyName}`);
    }
    if (page) {
      queries.push(`p=${page}`);
    }
    if (pageRecords) {
      queries.push(`pr=${pageRecords}`);
    }

    const url = [paths.join('/'), queries.join('&')].join('?');

    return await http.get(url);
  };
}

export const company = new Company();
