import { StringUtil } from '../../utils/StringUtil';

describe('StringUtil.toEnum', () => {
  it('success, value is empty', () => {
    const expected = {};
    const actual = StringUtil.toEnum([]);

    expect(actual).not.toBeNull();
    expect(actual).toMatchObject(expected);
  });

  it('success, value is [ABC, DEF, GHI]', () => {
    const expected = { ABC: 'ABC', DEF: 'DEF', GHI: 'GHI' };
    const actual = StringUtil.toEnum(['ABC', 'DEF', 'GHI']);

    expect(actual).not.toBeNull();
    expect(actual).toMatchObject(expected);
  });
});
