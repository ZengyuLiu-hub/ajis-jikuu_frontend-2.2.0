import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import ja from 'dayjs/locale/ja';
import cn from 'dayjs/locale/zh-cn';
import tw from 'dayjs/locale/zh-tw';
import ko from 'dayjs/locale/ko';
import vi from 'dayjs/locale/vi';
import th from 'dayjs/locale/th';

import { Language, Languages } from '../types';

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(timezone);

/**
 * 日時ユーティリティ.
 */
export class DateTimeUtil {
  /**
   * 現在日時をで取得します.
   *
   * @param {string} [timezone] タイムゾーン
   * @returns {dayjs.Dayjs} Dayjs オブジェクト
   */
  static now(timezone?: string): dayjs.Dayjs {
    if (timezone) {
      return dayjs().tz(timezone);
    }
    return dayjs.utc();
  }

  /**
   * 指定の日時で取得します.
   *
   * @param {Date} date 日付
   * @param {string} [timezone] タイムゾーン
   * @returns {dayjs.Dayjs} Dayjs オブジェクト, 日付が未指定の場合は null
   */
  static parseDateToDayjs(date: Date, timezone?: string): dayjs.Dayjs | null {
    if (!date) {
      return null;
    }
    if (timezone) {
      return dayjs(date).tz(timezone);
    }
    return dayjs(date).utc();
  }

  /**
   * 日時を指定フォーマットに変換します.
   *
   * @param {Date} date 日付
   * @param {string} format フォーマット
   * @param {Language} lang 言語
   * @param {string} [timezone] タイムゾーン
   * @returns {string} フォーマットされた日付文字列, 日付が未指定の場合は空文字
   */
  static parseDateToFormatString(
    date: Date,
    format: string,
    lang: Language,
    timezone?: string,
  ): string {
    const value = this.parseDateToDayjs(date, timezone);
    if (!value) {
      return '';
    }
    if (lang === Languages.ja) {
      return value.locale(ja).format(format);
    }
    if (lang === Languages.cn) {
      return value.locale(cn).format(format);
    }
    if (lang === Languages.tw) {
      return value.locale(tw).format(format);
    }
    if (lang === Languages.ko) {
      return value.locale(ko).format(format);
    }
    if (lang === Languages.vi) {
      return value.locale(vi).format(format);
    }
    if (lang === Languages.th) {
      return value.locale(th).format(format);
    }
    return value.format(format);
  }

  /**
   * 秒を累積時間に変換します.
   * 24時間を超えている場合は、時が24超えた値で表現されます.
   *
   * @param {number} seconds 秒
   * @param {string} format 表示フォーマット（時間）
   */
  static secondsToAccumulatedTime(seconds: number, format: string): string {
    const duration = dayjs.duration(seconds, 'seconds');
    const date = dayjs.utc(duration.asMilliseconds());

    // カウント時間の集計値が24時間を超える場合
    if (duration.asSeconds() >= 86400) {
      const day = Math.floor(duration.asSeconds() / 86400);

      const hour = date.hour() + 24 * day;
      const minute = date.format('mm');
      const second = date.format('ss');

      return format
        .replace('HH', `${hour}`)
        .replace('H', `${hour}`)
        .replace('mm', minute)
        .replace('m', minute)
        .replace('ss', second)
        .replace('s', second);
    }
    return date.format(format);
  }
}
