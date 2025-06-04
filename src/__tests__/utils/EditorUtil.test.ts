/**
 * @jest-environment jsdom
 */

import {
  LocationDisplayFormatTypes,
  PaperSizes,
  SelectIdTypes,
  StageRegulationSizes,
} from '../../types';
import { EditorUtil } from '../../utils/EditorUtil';

describe('EditorUtil.calcGuideGridSize', () => {
  it('success, latticeSize is 0', () => {
    const expected = 9;
    const actual = EditorUtil.calcGuideGridSize(9, 0);

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, omit round pattern 1', () => {
    const expected = 10;
    const actual = EditorUtil.calcGuideGridSize(9, 5);

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, omit round pattern 2', () => {
    const expected = 5;
    const actual = EditorUtil.calcGuideGridSize(4, 5);

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as floor pattern 1', () => {
    const expected = 0;
    const actual = EditorUtil.calcGuideGridSize(1, 5, 'floor');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as floor pattern 2', () => {
    const expected = 0;
    const actual = EditorUtil.calcGuideGridSize(2, 5, 'floor');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as floor pattern 3', () => {
    const expected = 0;
    const actual = EditorUtil.calcGuideGridSize(3, 5, 'floor');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as floor pattern 4', () => {
    const expected = 0;
    const actual = EditorUtil.calcGuideGridSize(4, 5, 'floor');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as floor pattern 5', () => {
    const expected = 5;
    const actual = EditorUtil.calcGuideGridSize(5, 5, 'floor');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as floor pattern 6', () => {
    const expected = 5;
    const actual = EditorUtil.calcGuideGridSize(6, 5, 'floor');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as floor pattern 7', () => {
    const expected = 5;
    const actual = EditorUtil.calcGuideGridSize(7, 5, 'floor');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as floor pattern 8', () => {
    const expected = 5;
    const actual = EditorUtil.calcGuideGridSize(8, 5, 'floor');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as floor pattern 9', () => {
    const expected = 5;
    const actual = EditorUtil.calcGuideGridSize(9, 5, 'floor');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as ceil pattern 1', () => {
    const expected = 5;
    const actual = EditorUtil.calcGuideGridSize(1, 5, 'ceil');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as ceil pattern 2', () => {
    const expected = 5;
    const actual = EditorUtil.calcGuideGridSize(2, 5, 'ceil');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as ceil pattern 3', () => {
    const expected = 5;
    const actual = EditorUtil.calcGuideGridSize(3, 5, 'ceil');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as ceil pattern 4', () => {
    const expected = 5;
    const actual = EditorUtil.calcGuideGridSize(4, 5, 'ceil');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as ceil pattern 5', () => {
    const expected = 5;
    const actual = EditorUtil.calcGuideGridSize(5, 5, 'ceil');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as ceil pattern 6', () => {
    const expected = 10;
    const actual = EditorUtil.calcGuideGridSize(6, 5, 'ceil');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as ceil pattern 7', () => {
    const expected = 10;
    const actual = EditorUtil.calcGuideGridSize(7, 5, 'ceil');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as ceil pattern 8', () => {
    const expected = 10;
    const actual = EditorUtil.calcGuideGridSize(8, 5, 'ceil');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as ceil pattern 9', () => {
    const expected = 10;
    const actual = EditorUtil.calcGuideGridSize(9, 5, 'ceil');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as round pattern 1', () => {
    const expected = 0;
    const actual = EditorUtil.calcGuideGridSize(1, 5, 'round');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as round pattern 2', () => {
    const expected = 0;
    const actual = EditorUtil.calcGuideGridSize(2, 5, 'round');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as round pattern 3', () => {
    const expected = 5;
    const actual = EditorUtil.calcGuideGridSize(3, 5, 'round');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as round pattern 4', () => {
    const expected = 5;
    const actual = EditorUtil.calcGuideGridSize(4, 5, 'round');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as round pattern 5', () => {
    const expected = 5;
    const actual = EditorUtil.calcGuideGridSize(5, 5, 'round');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as round pattern 6', () => {
    const expected = 5;
    const actual = EditorUtil.calcGuideGridSize(6, 5, 'round');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as round pattern 7', () => {
    const expected = 5;
    const actual = EditorUtil.calcGuideGridSize(7, 5, 'round');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as round pattern 8', () => {
    const expected = 10;
    const actual = EditorUtil.calcGuideGridSize(8, 5, 'round');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('success, round as round pattern 9', () => {
    const expected = 10;
    const actual = EditorUtil.calcGuideGridSize(9, 5, 'round');

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });
});

describe('EditorUtil.pageSizeToPixel', () => {
  it('success, unspecified', () => {
    const expected = { width: 842, height: 595 };
    const actual = EditorUtil.pageSizeToPixel();

    expect(actual).not.toBeNull();
    expect(actual).toMatchObject(expected);
  });

  it('success, A4', () => {
    const expected = { width: 842, height: 595 };
    const actual = EditorUtil.pageSizeToPixel(PaperSizes.A4);

    expect(actual).not.toBeNull();
    expect(actual).toMatchObject(expected);
  });

  it('success, B4', () => {
    const expected = { width: 1032, height: 729 };
    const actual = EditorUtil.pageSizeToPixel(PaperSizes.B4);

    expect(actual).not.toBeNull();
    expect(actual).toMatchObject(expected);
  });

  it('success, A3', () => {
    const expected = { width: 1191, height: 842 };
    const actual = EditorUtil.pageSizeToPixel(PaperSizes.A3);

    expect(actual).not.toBeNull();
    expect(actual).toMatchObject(expected);
  });

  it('success, B3', () => {
    const expected = { width: 1460, height: 1032 };
    const actual = EditorUtil.pageSizeToPixel(PaperSizes.B3);

    expect(actual).not.toBeNull();
    expect(actual).toMatchObject(expected);
  });

  it('success, A2', () => {
    const expected = { width: 1684, height: 1191 };
    const actual = EditorUtil.pageSizeToPixel(PaperSizes.A2);

    expect(actual).not.toBeNull();
    expect(actual).toMatchObject(expected);
  });

  it('success, B2', () => {
    const expected = { width: 2064, height: 1460 };
    const actual = EditorUtil.pageSizeToPixel(PaperSizes.B2);

    expect(actual).not.toBeNull();
    expect(actual).toMatchObject(expected);
  });

  it('success, A1', () => {
    const expected = { width: 2384, height: 1684 };
    const actual = EditorUtil.pageSizeToPixel(PaperSizes.A1);

    expect(actual).not.toBeNull();
    expect(actual).toMatchObject(expected);
  });

  it('success, B1', () => {
    const expected = { width: 2920, height: 2064 };
    const actual = EditorUtil.pageSizeToPixel(PaperSizes.B1);

    expect(actual).not.toBeNull();
    expect(actual).toMatchObject(expected);
  });

  it('success, A0', () => {
    const expected = { width: 3370, height: 2384 };
    const actual = EditorUtil.pageSizeToPixel(PaperSizes.A0);

    expect(actual).not.toBeNull();
    expect(actual).toMatchObject(expected);
  });

  it('success, B0', () => {
    const expected = { width: 4127, height: 2920 };
    const actual = EditorUtil.pageSizeToPixel(PaperSizes.B0);

    expect(actual).not.toBeNull();
    expect(actual).toMatchObject(expected);
  });
});

describe('EditorUtil.downloadFile', () => {
  it('success', () => {
    const link: any = {
      click: jest.fn(),
      remove: jest.fn(),
    };

    expect(link).not.toBeNull();

    const spy = jest
      .spyOn(document, 'createElement')
      .mockImplementation(() => link);

    EditorUtil.downloadFile(
      'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
      'file.gif'
    );

    spy.mockRestore();
  });
});

describe('EditorUtil.generateDisplayLocationNum', () => {
  it('STANDARD, locationNum is empty', () => {
    const expected = '';
    const actual = EditorUtil.generateDisplayLocationNum(
      '',
      LocationDisplayFormatTypes.STANDARD,
      []
    );

    expect(actual).not.toBeNull();
    expect(actual).toBe(expected);
  });

  it('STANDARD, locationNum is not empty', () => {
    const expected = '0101';
    const actual = EditorUtil.generateDisplayLocationNum(
      '0101',
      LocationDisplayFormatTypes.STANDARD,
      []
    );

    expect(actual).not.toBeNull();
    expect(actual).toBe(expected);
  });

  it('CUSTOM, customFormats is empty', () => {
    const expected = '0010001';
    const actual = EditorUtil.generateDisplayLocationNum(
      '0010001',
      LocationDisplayFormatTypes.CUSTOM,
      []
    );

    expect(actual).not.toBeNull();
    expect(actual).toBe(expected);
  });

  it('CUSTOM, customFormats is not empty', () => {
    const customFormats = [
      {
        sequence: 1,
        selectIdType: SelectIdTypes.T,
        startIndex: 0,
        endIndex: 1,
      },
      {
        sequence: 2,
        selectIdType: SelectIdTypes.T,
        startIndex: 1,
        endIndex: 2,
      },
      {
        sequence: 3,
        selectIdType: SelectIdTypes.T,
        startIndex: 2,
        endIndex: 3,
      },
      {
        sequence: 4,
        selectIdType: SelectIdTypes.B,
        startIndex: 4,
        endIndex: 5,
      },
      {
        sequence: 5,
        selectIdType: SelectIdTypes.B,
        startIndex: 5,
        endIndex: 6,
      },
      {
        sequence: 6,
        selectIdType: SelectIdTypes.B,
        startIndex: 6,
        endIndex: 7,
      },
    ];

    const expected = '123567';
    const actual = EditorUtil.generateDisplayLocationNum(
      '1234567',
      LocationDisplayFormatTypes.CUSTOM,
      customFormats
    );

    expect(actual).not.toBeNull();
    expect(actual).toBe(expected);
  });

  it('CUSTOM, lack of location num digits', () => {
    const customFormats = [
      {
        sequence: 1,
        selectIdType: SelectIdTypes.T,
        startIndex: 0,
        endIndex: 1,
      },
      {
        sequence: 2,
        selectIdType: SelectIdTypes.T,
        startIndex: 1,
        endIndex: 2,
      },
      {
        sequence: 3,
        selectIdType: SelectIdTypes.T,
        startIndex: 2,
        endIndex: 3,
      },
      {
        sequence: 4,
        selectIdType: SelectIdTypes.B,
        startIndex: 4,
        endIndex: 5,
      },
      {
        sequence: 5,
        selectIdType: SelectIdTypes.B,
        startIndex: 5,
        endIndex: 6,
      },
      {
        sequence: 6,
        selectIdType: SelectIdTypes.B,
        startIndex: 6,
        endIndex: 7,
      },
    ];

    const expected = '12356';
    const actual = EditorUtil.generateDisplayLocationNum(
      '123456',
      LocationDisplayFormatTypes.CUSTOM,
      customFormats
    );

    expect(actual).not.toBeNull();
    expect(actual).toBe(expected);
  });
});

describe('EditorUtil.stageRegulationSizeToPixel', () => {
  it('VERY_SMALL', () => {
    const expected = {
      width: 1270,
      height: 730,
    };
    const actual = EditorUtil.stageRegulationSizeToPixel(
      StageRegulationSizes.VERY_SMALL
    );

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('SMALL', () => {
    const expected = {
      width: 1524,
      height: 876,
    };
    const actual = EditorUtil.stageRegulationSizeToPixel(
      StageRegulationSizes.SMALL
    );

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('MEDIUM', () => {
    const expected = {
      width: 2438,
      height: 1400,
    };
    const actual = EditorUtil.stageRegulationSizeToPixel(
      StageRegulationSizes.MEDIUM
    );

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('LARGE', () => {
    const expected = {
      width: 3200,
      height: 1835,
    };
    const actual = EditorUtil.stageRegulationSizeToPixel(
      StageRegulationSizes.LARGE
    );

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('EXTRA_LARGE', () => {
    const expected = {
      width: 3810,
      height: 2190,
    };
    const actual = EditorUtil.stageRegulationSizeToPixel(
      StageRegulationSizes.EXTRA_LARGE
    );

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });

  it('undefined', () => {
    const expected = {
      width: 1270,
      height: 730,
    };
    const actual = EditorUtil.stageRegulationSizeToPixel();

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });
});
