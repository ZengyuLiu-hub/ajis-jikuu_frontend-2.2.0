import { fireEvent, render } from '@testing-library/react';
import { InputText } from '../../../components/atoms';

describe('InputText', () => {
  const setup = ({
    value,
    valueMode,
    maxLength,
  }: {
    value?: string;
    valueMode?:
      | 'HALF_WIDTH_ALPHABET'
      | 'HALF_WIDTH_NUMBER'
      | 'HALF_WIDTH_ALPHABET_AND_NUMBER'
      | 'HALF_WIDTH';
    maxLength?: number;
  }) => {
    const { getByTestId } = render(
      <InputText
        data-testid="input-text"
        value={value}
        valueMode={valueMode}
        maxLength={maxLength}
      />,
    );
    const input = getByTestId('input-text') as HTMLInputElement;
    return { input };
  };

  describe('onChange', () => {
    describe('valueMode: HALF_WIDTH', () => {
      it.each`
        shiftKey | value   | expected
        ${false} | ${'あ'} | ${'a'}
        ${false} | ${'い'} | ${'i'}
        ${false} | ${'う'} | ${'u'}
        ${false} | ${'え'} | ${'e'}
        ${false} | ${'お'} | ${'o'}
        ${true}  | ${'あ'} | ${'A'}
        ${true}  | ${'い'} | ${'I'}
        ${true}  | ${'う'} | ${'U'}
        ${true}  | ${'え'} | ${'E'}
        ${true}  | ${'お'} | ${'O'}
      `(
        'Full-Width [ $value ] to shift [ $shift ] Half-Width [ $expected ]',
        ({ shiftKey, value, expected }) => {
          const { input } = setup({
            value: 'any',
            valueMode: 'HALF_WIDTH',
            maxLength: 1,
          });

          fireEvent.keyDown(input, { key: 'Shift', shiftKey });
          fireEvent.change(input, { target: { value } });

          expect(input).toHaveValue(expected);
        },
      );

      it.each`
        value   | expected
        ${'｀'} | ${'`'}
        ${'〜'} | ${'~'}
        ${'！'} | ${'!'}
        ${'＠'} | ${'@'}
        ${'＃'} | ${'#'}
        ${'＄'} | ${'$'}
        ${'％'} | ${'%'}
        ${'＾'} | ${'^'}
        ${'＆'} | ${'&'}
        ${'＊'} | ${'*'}
        ${'（'} | ${'('}
        ${'）'} | ${')'}
        ${'－'} | ${'-'}
        ${'＿'} | ${'_'}
        ${'＝'} | ${'='}
        ${'＋'} | ${'+'}
        ${'［'} | ${'['}
        ${'｛'} | ${'{'}
        ${'］'} | ${']'}
        ${'｝'} | ${'}'}
        ${'￥'} | ${'\\'}
        ${'｜'} | ${'|'}
        ${'；'} | ${';'}
        ${'：'} | ${':'}
        ${'’'}  | ${"'"}
        ${'”'}  | ${'"'}
        ${'，'} | ${','}
        ${'<'}  | ${'<'}
        ${'．'} | ${'.'}
        ${'＞'} | ${'>'}
        ${'／'} | ${'/'}
        ${'？'} | ${'?'}
        ${'　'} | ${' '}
        ${'１'} | ${'1'}
        ${'２'} | ${'2'}
        ${'３'} | ${'3'}
        ${'４'} | ${'4'}
        ${'５'} | ${'5'}
        ${'６'} | ${'6'}
        ${'７'} | ${'7'}
        ${'８'} | ${'8'}
        ${'９'} | ${'9'}
        ${'０'} | ${'0'}
        ${'ａ'} | ${'a'}
        ${'ｂ'} | ${'b'}
        ${'ｃ'} | ${'c'}
        ${'ｄ'} | ${'d'}
        ${'ｅ'} | ${'e'}
        ${'ｆ'} | ${'f'}
        ${'ｇ'} | ${'g'}
        ${'ｈ'} | ${'h'}
        ${'ｉ'} | ${'i'}
        ${'ｊ'} | ${'j'}
        ${'ｋ'} | ${'k'}
        ${'ｌ'} | ${'l'}
        ${'ｍ'} | ${'m'}
        ${'ｎ'} | ${'n'}
        ${'ｏ'} | ${'o'}
        ${'ｐ'} | ${'p'}
        ${'ｑ'} | ${'q'}
        ${'ｒ'} | ${'r'}
        ${'ｓ'} | ${'s'}
        ${'ｔ'} | ${'t'}
        ${'ｕ'} | ${'u'}
        ${'ｖ'} | ${'v'}
        ${'ｗ'} | ${'w'}
        ${'ｘ'} | ${'x'}
        ${'ｙ'} | ${'y'}
        ${'ｚ'} | ${'z'}
        ${'Ａ'} | ${'A'}
        ${'Ｂ'} | ${'B'}
        ${'Ｃ'} | ${'C'}
        ${'Ｄ'} | ${'D'}
        ${'Ｅ'} | ${'E'}
        ${'Ｆ'} | ${'F'}
        ${'Ｇ'} | ${'G'}
        ${'Ｈ'} | ${'H'}
        ${'Ｉ'} | ${'I'}
        ${'Ｊ'} | ${'J'}
        ${'Ｋ'} | ${'K'}
        ${'Ｌ'} | ${'L'}
        ${'Ｍ'} | ${'M'}
        ${'Ｎ'} | ${'N'}
        ${'Ｏ'} | ${'O'}
        ${'Ｐ'} | ${'P'}
        ${'Ｑ'} | ${'Q'}
        ${'Ｒ'} | ${'R'}
        ${'Ｓ'} | ${'S'}
        ${'Ｔ'} | ${'T'}
        ${'Ｕ'} | ${'U'}
        ${'Ｖ'} | ${'V'}
        ${'Ｗ'} | ${'W'}
        ${'Ｘ'} | ${'X'}
        ${'Ｙ'} | ${'Y'}
        ${'Ｚ'} | ${'Z'}
      `(
        'Full-Width [ $value ] to Half-Width [ $expected ]',
        ({ value, expected }) => {
          const { input } = setup({
            value: 'any',
            valueMode: 'HALF_WIDTH',
            maxLength: 1,
          });

          fireEvent.change(input, { target: { value } });

          expect(input).toHaveValue(expected);
        },
      );

      it.each`
        value
        ${'`'}
        ${'~'}
        ${'!'}
        ${'@'}
        ${'#'}
        ${'$'}
        ${'%'}
        ${'^'}
        ${'&'}
        ${'*'}
        ${'('}
        ${')'}
        ${'-'}
        ${'_'}
        ${'='}
        ${'+'}
        ${'['}
        ${'{'}
        ${']'}
        ${'}'}
        ${'\\'}
        ${'|'}
        ${';'}
        ${':'}
        ${"'"}
        ${'"'}
        ${','}
        ${'<'}
        ${'.'}
        ${'>'}
        ${'/'}
        ${'?'}
        ${' '}
        ${'1'}
        ${'2'}
        ${'3'}
        ${'4'}
        ${'5'}
        ${'6'}
        ${'7'}
        ${'8'}
        ${'9'}
        ${'0'}
        ${'a'}
        ${'b'}
        ${'c'}
        ${'d'}
        ${'e'}
        ${'f'}
        ${'g'}
        ${'h'}
        ${'i'}
        ${'j'}
        ${'k'}
        ${'l'}
        ${'m'}
        ${'n'}
        ${'o'}
        ${'p'}
        ${'q'}
        ${'r'}
        ${'s'}
        ${'t'}
        ${'u'}
        ${'v'}
        ${'w'}
        ${'x'}
        ${'y'}
        ${'z'}
        ${'A'}
        ${'B'}
        ${'C'}
        ${'D'}
        ${'E'}
        ${'F'}
        ${'G'}
        ${'H'}
        ${'I'}
        ${'J'}
        ${'K'}
        ${'L'}
        ${'M'}
        ${'N'}
        ${'O'}
        ${'P'}
        ${'Q'}
        ${'R'}
        ${'S'}
        ${'T'}
        ${'U'}
        ${'V'}
        ${'W'}
        ${'X'}
        ${'Y'}
        ${'Z'}
      `('Half-Width [ $value ] no change', ({ value }) => {
        const { input } = setup({
          value: 'any',
          valueMode: 'HALF_WIDTH',
          maxLength: 1,
        });

        fireEvent.change(input, { target: { value } });

        expect(input).toHaveValue(value);
      });

      // 変換できない文字すべて列挙するのは現実的ではないため、可能な範囲の文字を限定して検証
      it.each`
        value
        ${'か'}
        ${'き'}
        ${'く'}
        ${'け'}
        ${'こ'}
        ${'さ'}
        ${'し'}
        ${'す'}
        ${'せ'}
        ${'そ'}
        ${'た'}
        ${'ち'}
        ${'つ'}
        ${'て'}
        ${'と'}
        ${'な'}
        ${'に'}
        ${'ぬ'}
        ${'ね'}
        ${'の'}
        ${'は'}
        ${'ひ'}
        ${'ふ'}
        ${'へ'}
        ${'ほ'}
        ${'ま'}
        ${'み'}
        ${'む'}
        ${'め'}
        ${'も'}
        ${'や'}
        ${'ゆ'}
        ${'よ'}
        ${'ら'}
        ${'り'}
        ${'る'}
        ${'れ'}
        ${'ろ'}
        ${'わ'}
        ${'を'}
        ${'ん'}
        ${'ア'}
        ${'イ'}
        ${'ウ'}
        ${'エ'}
        ${'オ'}
        ${'ー'}
        ${'阿'}
        ${'≒'}
        ${'※'}
      `('Full-Width [ $value ] cannot change', ({ value }) => {
        const { input } = setup({
          value: 'any',
          valueMode: 'HALF_WIDTH',
          maxLength: 1,
        });

        fireEvent.change(input, { target: { value } });

        expect(input).toHaveValue('');
      });
    });
  });
});
