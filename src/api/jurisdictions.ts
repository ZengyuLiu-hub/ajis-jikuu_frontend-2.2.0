import { Jurisdiction } from '../types';

import { http, Result } from '../app/http';

export type JurisdictionsResult = {
  data: Jurisdiction[];
} & Result;

class Jurisdictions {
  /**
   * 管轄区分を取得します.
   *
   * @returns Promise<Response> リクエスト結果
   */
  getJurisdictions = async () => {
    return await http.get('api/jurisdictions');
  };
}

export const jurisdictions = new Jurisdictions();
