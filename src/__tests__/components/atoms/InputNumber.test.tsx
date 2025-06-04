import { fireEvent, render, screen } from '@testing-library/react';
import { InputNumber } from '../../../components/atoms';

describe('InputNumber', () => {
  const setup = ({
    value,
    nullBehavior = 'DEFAULT',
    onBlur,
  }: {
    value?: string;
    nullBehavior?: 'DEFAULT' | 'NOTHING';
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => {};
  }) => {
    render(
      <InputNumber
        data-testid="input-number"
        nullBehavior={nullBehavior}
        value={value}
        min={-100}
        max={100}
        onBlur={onBlur}
      />,
    );
    const input = screen.getByTestId('input-number') as HTMLInputElement;
    return { input };
  };

  const variation = [
    ['15', '15'],
    ['-15', '-15'],
    ['１５', '15'],
    ['－１５', '-15'],
    ['０', '0'],
    ['１', '1'],
    ['２', '2'],
    ['３', '3'],
    ['４', '4'],
    ['５', '5'],
    ['６', '6'],
    ['７', '7'],
    ['８', '8'],
    ['９', '9'],
    ['‐1', '-1'],
    ['－1', '-1'],
    ['―1', '-1'],
    ['ー1', '-1'],
    ['−1', '-1'],
    ['abcdefghijklmnopqrstuvwxyz1', '1'],
    ['1-', '1'],
    ['012', '12'],
  ];

  describe('onChange', () => {
    it.each([
      ...variation,
      ['-0', '-'],
      ['0-', '-'],
      // マイナスのみが変換されない
      ['-', '-'],
      // 入力値を削除
      ['', '0'],
    ])('nullBehavior: DEFAULT, value "%s" to "%s"', (inputValue, expected) => {
      const value = '10';
      const { input } = setup({ value });
      expect(input).toHaveValue(value);

      fireEvent.change(input, { target: { value: inputValue } });

      expect(input).toHaveValue(expected);
    });

    it.each([
      ...variation,
      ['-0', '-'],
      ['0-', '-'],
      // マイナスのみが変換されない
      ['-', '-'],
      // 入力値を削除
      ['', ''],
    ])('nullBehavior: NOTHING, value "%s" to "%s"', (inputValue, expected) => {
      const value = '10';
      const { input } = setup({ value, nullBehavior: 'NOTHING' });
      expect(input).toHaveValue(value);

      fireEvent.change(input, { target: { value: inputValue } });

      expect(input).toHaveValue(expected);
    });
  });

  describe('onBlur', () => {
    it.each([
      ...variation,
      // min / max で補正される
      ['-101', '-100'],
      ['101', '100'],
      // マイナスのみが変換される
      ['-', '-1'],
      // 入力値を削除
      ['', '0'],
    ])('nullBehavior: DEFAULT, value "%s" to "%s"', (inputValue, expected) => {
      const handleBlur = jest.fn();

      const value = '10';
      const { input } = setup({ value, onBlur: handleBlur });
      expect(input).toHaveValue(value);

      fireEvent.change(input, { target: { value: inputValue } });
      fireEvent.blur(input);

      expect(input).toHaveValue(expected);
      expect(handleBlur).toHaveBeenCalled();
    });

    it.each([
      ...variation,
      // min / max で補正される
      ['-101', '-100'],
      ['101', '100'],
      // マイナスのみが変換される
      ['-', '-1'],
      // 入力値を削除
      ['', ''],
    ])('nullBehavior: NOTHING, value "%s" to "%s"', (inputValue, expected) => {
      const handleBlur = jest.fn();

      const value = '10';
      const { input } = setup({
        value,
        nullBehavior: 'NOTHING',
        onBlur: handleBlur,
      });
      expect(input).toHaveValue(value);

      fireEvent.change(input, { target: { value: inputValue } });
      fireEvent.blur(input);

      expect(input).toHaveValue(expected);
      expect(handleBlur).toHaveBeenCalled();
    });
  });
});
