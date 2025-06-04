/**
 * コレクションユーティリティ.
 */
export class CollectionUtil {
  /**
   * 指定した項目毎にグループ化します.
   *
   * @param arr 対象配列
   * @param fn 条件式
   * @return 条件式毎にグループ化された配列を返します
   */
  static groupBy = <T>(arr: T[], fn: (item: T) => any) =>
    arr.reduce<Record<string, T[]>>((prev, current) => {
      const key = fn(current);
      const group = prev[key] || [];
      group.push(current);
      return { ...prev, [key]: group };
    }, {});
}
