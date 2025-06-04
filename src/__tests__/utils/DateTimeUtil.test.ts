import dayjs from 'dayjs';
import MockDate from 'mockdate';
import { Languages } from '../../types';

import { DateTimeUtil } from '../../utils/DateTimeUtil';

describe('DateTimeUtil.now', () => {
  beforeEach(() => {
    MockDate.set(new Date('2022-11-18T03:34:56Z'));
  });
  afterEach(() => {
    MockDate.reset();
  });

  it('success, omit timezone', () => {
    const actual = DateTimeUtil.now();

    expect(actual).not.toBeNull();
    expect(actual.format('YYYY-MM-DD HH:mm:ss')).toEqual('2022-11-18 03:34:56');
  });

  it.each`
    timezone        | expected
    ${'Asia/Tokyo'} | ${'2022-11-18 12:34:56'}
    ${'UTC'}        | ${'2022-11-18 03:34:56'}
  `('success, timezone $timezone', ({ timezone, expected }) => {
    const actual = DateTimeUtil.now(timezone);

    expect(actual).not.toBeNull();
    expect(actual.format('YYYY-MM-DD HH:mm:ss')).toEqual(expected);
  });
});

describe('DateTimeUtil.parseDateToDayjs', () => {
  it('success, omit timezone', () => {
    const actual = DateTimeUtil.parseDateToDayjs(
      new Date('2022-11-18T03:34:56Z'),
    );

    expect(actual).not.toBeNull();
    expect(actual?.format('YYYY-MM-DD HH:mm:ss')).toEqual(
      '2022-11-18 03:34:56',
    );
  });

  it.each`
    date                                | timezone        | expected
    ${new Date('2022-11-18T03:34:56Z')} | ${'Asia/Tokyo'} | ${'2022-11-18 12:34:56'}
    ${new Date('2022-11-18T12:34:56Z')} | ${'UTC'}        | ${'2022-11-18 12:34:56'}
  `(
    'success, date $date, timezone $timezone',
    ({ date, timezone, expected }) => {
      const actual = DateTimeUtil.parseDateToDayjs(date, timezone);

      expect(actual).not.toBeNull();
      expect(actual?.format('YYYY-MM-DD HH:mm:ss')).toEqual(expected);
    },
  );

  it.each`
    date
    ${undefined}
    ${null}
  `('success, date $date, omit date', ({ date }) => {
    const actual = DateTimeUtil.parseDateToDayjs(date);

    expect(actual).toBeNull();
  });
});

describe('DateTimeUtil.parseDateToFormatString', () => {
  it.each`
    date                                | format                       | lang            | expected
    ${new Date('2022-11-18T12:34:56Z')} | ${'YYYY-MM-DD HH:mm:ss'}     | ${Languages.en} | ${'2022-11-18 12:34:56'}
    ${new Date('2022-11-18T03:34:56Z')} | ${'YYYY年MM月DD日 HH:mm:ss'} | ${Languages.ja} | ${'2022年11月18日 03:34:56'}
    ${new Date('2022-11-18T03:34:56Z')} | ${'YYYY年MM月DD日 HH:mm:ss'} | ${Languages.cn} | ${'2022年11月18日 03:34:56'}
    ${new Date('2022-11-18T03:34:56Z')} | ${'YYYY年MM月DD日 HH:mm:ss'} | ${Languages.tw} | ${'2022年11月18日 03:34:56'}
    ${new Date('2022-11-18T03:34:56Z')} | ${'YYYY.MM.DD HH:mm:ss'}     | ${Languages.ko} | ${'2022.11.18 03:34:56'}
    ${new Date('2022-11-18T03:34:56Z')} | ${'DD-MM-YYYY HH:mm:ss'}     | ${Languages.vi} | ${'18-11-2022 03:34:56'}
    ${new Date('2022-11-18T03:34:56Z')} | ${'DD/MM/YYYY HH:mm:ss'}     | ${Languages.th} | ${'18/11/2022 03:34:56'}
    ${undefined}                        | ${'YYYY-MM-DD HH:mm:ss'}     | ${Languages.en} | ${''}
    ${null}                             | ${'YYYY-MM-DD HH:mm:ss'}     | ${Languages.en} | ${''}
  `(
    'success, date $date, format $format, lang $lang, omit timezone',
    ({ date, format, lang, expected }) => {
      const actual = DateTimeUtil.parseDateToFormatString(date, format, lang);

      expect(actual).not.toBeNull();
      expect(actual).toEqual(expected);
    },
  );

  it.each`
    date                                | format                       | lang            | timezone        | expected
    ${new Date('2022-11-18T12:34:56Z')} | ${'YYYY-MM-DD HH:mm:ss'}     | ${Languages.en} | ${'UTC'}        | ${'2022-11-18 12:34:56'}
    ${new Date('2022-11-18T03:34:56Z')} | ${'YYYY年MM月DD日 HH:mm:ss'} | ${Languages.ja} | ${'Asia/Tokyo'} | ${'2022年11月18日 12:34:56'}
  `(
    'success, date $date, format $format, lang $lang, timezone $timezone',
    ({ date, format, lang, timezone, expected }) => {
      const actual = DateTimeUtil.parseDateToFormatString(
        date,
        format,
        lang,
        timezone,
      );

      expect(actual).not.toBeNull();
      expect(actual).toEqual(expected);
    },
  );
});

describe('DateTimeUtil.secondsToAccumulatedTime', () => {
  it('23:59:59, HH:mm:ss', () => {
    const seconds = 86399;
    const format = 'HH:mm:ss';

    const expected = '23:59:59';
    const actual = DateTimeUtil.secondsToAccumulatedTime(seconds, format);

    expect(actual).toEqual(expected);
  });

  it('23:59:59, H:m:s', () => {
    const seconds = 86399;
    const format = 'H:m:s';

    const expected = '23:59:59';
    const actual = DateTimeUtil.secondsToAccumulatedTime(seconds, format);

    expect(actual).toEqual(expected);
  });

  it('1:2:3, HH:mm:ss', () => {
    const seconds = 3723;
    const format = 'HH:mm:ss';

    const expected = '01:02:03';
    const actual = DateTimeUtil.secondsToAccumulatedTime(seconds, format);

    expect(actual).toEqual(expected);
  });

  it('1:2:3, H:m:s', () => {
    const seconds = 3723;
    const format = 'H:m:s';

    const expected = '1:2:3';
    const actual = DateTimeUtil.secondsToAccumulatedTime(seconds, format);

    expect(actual).toEqual(expected);
  });

  it('24:00:00, HH:mm:ss', () => {
    const seconds = 86400;
    const format = 'HH:mm:ss';

    const expected = '24:00:00';
    const actual = DateTimeUtil.secondsToAccumulatedTime(seconds, format);

    expect(actual).toEqual(expected);
  });

  it('25:12:34, HH:mm:ss', () => {
    const seconds = 90754;
    const format = 'HH:mm:ss';

    const expected = '25:12:34';
    const actual = DateTimeUtil.secondsToAccumulatedTime(seconds, format);

    expect(actual).toEqual(expected);
  });

  it('25:12:34, H:m:s', () => {
    const seconds = 90754;
    const format = 'H:m:s';

    const expected = '25:12:34';
    const actual = DateTimeUtil.secondsToAccumulatedTime(seconds, format);

    expect(actual).toEqual(expected);
  });

  it('25:12:34, H', () => {
    const seconds = 90754;
    const format = 'H';

    const expected = '25';
    const actual = DateTimeUtil.secondsToAccumulatedTime(seconds, format);

    expect(actual).toEqual(expected);
  });

  it('25:12:34, m', () => {
    const seconds = 90754;
    const format = 'm';

    const expected = '12';
    const actual = DateTimeUtil.secondsToAccumulatedTime(seconds, format);

    expect(actual).toEqual(expected);
  });

  it('25:12:34, s', () => {
    const seconds = 90754;
    const format = 's';

    const expected = '34';
    const actual = DateTimeUtil.secondsToAccumulatedTime(seconds, format);

    expect(actual).toEqual(expected);
  });

  it('48:01:02, HH:mm:ss', () => {
    const seconds = 172862;
    const format = 'HH:mm:ss';

    const expected = '48:01:02';
    const actual = DateTimeUtil.secondsToAccumulatedTime(seconds, format);

    expect(actual).toEqual(expected);
  });

  it('00:34:56, HH:mm:ss', () => {
    const seconds = 2096;
    const format = 'HH:mm:ss';

    const expected = '00:34:56';
    const actual = DateTimeUtil.secondsToAccumulatedTime(seconds, format);

    expect(actual).toEqual(expected);
  });
});
