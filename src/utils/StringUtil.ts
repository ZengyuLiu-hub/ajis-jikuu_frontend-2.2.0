/**
 * 文字列ユーティリティ.
 */
export class StringUtil {
  /**
   * 文字列配列から Enum を生成します.
   *
   * @param array 配列
   */
  static toEnum<T extends string>(array: T[]): { [K in T]: K } {
    return array.reduce((accumulator, currentValue) => {
      accumulator[currentValue] = currentValue;
      return accumulator;
    }, Object.create(null));
  }
}
