import {
  InputHTMLAttributes,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

export const StyledInputText = styled.input`
  border: 1px solid rgba(151, 151, 151, 1);
  background: rgba(245, 245, 245, 1);
  margin: 0;
  padding: 1px 4px;
  min-width: 100px;
  min-height: 24px;
  font-size: 1rem;

  &::placeholder {
    font-style: italic;
  }

  &:hover {
    border-color: rgba(2, 154, 209, 1);
  }

  &:focus {
    outline-color: rgba(2, 154, 209, 1);
  }

  &[aria-disabled='true'],
  &:disabled {
    opacity: 0.5;

    &:hover {
      cursor: not-allowed;
    }
  }
`;
StyledInputText.defaultProps = {
  type: 'text',
};

const initialComposition = {
  isComposing: false,
  composedValue: '',
  changedValue: '',
};

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  valueMode?:
    | 'HALF_WIDTH_ALPHABET'
    | 'HALF_WIDTH_NUMBER'
    | 'HALF_WIDTH_ALPHABET_AND_NUMBER'
    | 'HALF_WIDTH';
}

/**
 * テキスト入力.
 *
 * @param props プロパティ
 */
export const InputText = (props: Props) => {
  const { value: originalValue = '', valueMode, ...otherDomProps } = props;

  const input = useRef<HTMLInputElement>(null);

  const [composition, compositionEvent] = useReducer(
    (prev: typeof initialComposition, next: any) => {
      return { ...prev, ...next };
    },
    initialComposition
  );

  const [shiftKey, setShiftKey] = useState(false);

  const correctionValue = (value: string, min: string, max: string) => {
    if (!value) {
      if (min !== undefined) {
        return min;
      }
      return value;
    }

    const intValue = Number(value);

    if (min && intValue < Number(min)) {
      return min;
    }
    if (max && intValue > Number(max)) {
      return max;
    }
    return value;
  };

  const isVowelToHalfAlphabet = (value: string, shift: boolean) => {
    if (value === 'あ') {
      return shift ? 'A' : 'a';
    }
    if (value === 'い') {
      return shift ? 'I' : 'i';
    }
    if (value === 'う') {
      return shift ? 'U' : 'u';
    }
    if (value === 'え') {
      return shift ? 'E' : 'e';
    }
    if (value === 'お') {
      return shift ? 'O' : 'o';
    }
    return value;
  };

  const toHalfWideAlphabet = (value: string) => {
    return value
      .replace(/[あ-お]/g, (s) => isVowelToHalfAlphabet(s, shiftKey))
      .replace(/[ａ-ｚＡ-Ｚ]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 0xfee0)
      )
      .replace(/[^a-zA-Z]/g, '');
  };

  const toHalfWideNumber = (value: string) => {
    return value
      .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
      .replace(/[^0-9]/g, '');
  };

  const toHalfWideAlphabetAndNumber = (value: string) => {
    return value
      .replace(/[あ-お]/g, (s) => isVowelToHalfAlphabet(s, shiftKey))
      .replace(/[０-９ａ-ｚＡ-Ｚ]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 0xfee0)
      )
      .replace(/[^0-9a-zA-Z]/g, '');
  };

  const toHalfWidth = (value: string) => {
    return (
      value
        .replace(/[あ-お]/g, (s) => isVowelToHalfAlphabet(s, shiftKey))
        .replace(/[！-～]/g, (s) =>
          String.fromCharCode(s.charCodeAt(0) - 0xfee0),
        )
        // 文字コードのシフトに対応していない文字を個別に変換
        .replace(/”/g, '"')
        .replace(/’/g, "'")
        .replace(/‘/g, '`')
        .replace(/￥/g, '\\')
        .replace(/　/g, ' ')
        .replace(/〜/g, '~')
        // 変換できない文字をクリア
        .replace(/[^!-~"'`\\ ]/g, '')
    );
  };

  const correctionMaxLength = (value: string, max: number) => {
    if (value && value.length > max) {
      return value.replace(/[^ -~｡-ﾟ]+$/g, '');
    }
    return value;
  };

  const toHalfCorrectionValue = (value: string, maxLength: number) => {
    if (valueMode === 'HALF_WIDTH_ALPHABET') {
      return toHalfWideAlphabet(correctionMaxLength(value, maxLength));
    } else if (valueMode === 'HALF_WIDTH_NUMBER') {
      return toHalfWideNumber(correctionMaxLength(value, maxLength));
    } else if (valueMode === 'HALF_WIDTH_ALPHABET_AND_NUMBER') {
      return toHalfWideAlphabetAndNumber(correctionMaxLength(value, maxLength));
    } else if (valueMode === 'HALF_WIDTH') {
      return toHalfWidth(correctionMaxLength(value, maxLength));
    }
    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!input || !input.current) {
      return;
    }

    if (valueMode) {
      const { value, maxLength } = input.current;

      // IME 入力中は、途中までの文字列で input を書き換えないように以降の処理しない
      if (composition.isComposing) {
        return;
      }
      // IME 入力確定したら、確定した時点の文字列で input を上書きするために変換
      if (composition.composedValue) {
        const changedValue = toHalfCorrectionValue(
          composition.composedValue,
          maxLength
        );
        compositionEvent({ composedValue: '', changedValue });
        input.current.value = changedValue;
      } else {
        input.current.value = toHalfCorrectionValue(value, maxLength);
      }
    }

    if (props.onChange) {
      props.onChange({
        ...e,
        target: input.current,
      });
    }
  };

  // キー入力
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (!input || !input.current) {
      return;
    }
    const { key } = e;

    // 左右カーソル移動、削除、バックスペース
    if (
      key.toLowerCase() === 'arrowleft' ||
      key.toLowerCase() === 'arrowright' ||
      key.toLowerCase() === 'tab' ||
      key.toLowerCase() === 'delete' ||
      key.toLowerCase() === 'backspace'
    ) {
      return;
    }
    setShiftKey(e.shiftKey);

    // 最大文字列長
    if (props.maxLength !== undefined && props.maxLength > -1) {
      const { value, selectionStart, selectionEnd } = input.current;
      const overwriteLength = (selectionEnd ?? 0) - (selectionStart ?? 0);

      if (value && value.length - overwriteLength >= props.maxLength) {
        e.preventDefault();
        return false;
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!input || !input.current) {
      return;
    }

    const { min, max, maxLength } = input.current;
    let { value } = e.target;

    if (valueMode) {
      // IME 入力確定後に変更されたら、変更した時点の文字列で以降の処理を実行
      if (composition.changedValue) {
        value = composition.changedValue;
        compositionEvent({ changedValue: '' });
      }

      value = toHalfCorrectionValue(value, maxLength);
    }

    const newValue = correctionValue(value, min, max);

    input.current.value = newValue;

    if (props.onBlur) {
      props.onBlur({
        ...e,
        target: input.current,
      });
    }
  };

  const handleCompositionStart = () => {
    if (valueMode) {
      compositionEvent({ isComposing: true, composedValue: '' });
    }
  };

  const handleCompositionEnd = (
    e: React.CompositionEvent<HTMLInputElement>
  ) => {
    if (valueMode) {
      compositionEvent({ isComposing: false, composedValue: e.data });
    }
  };

  useEffect(() => {
    if (input.current) {
      input.current.value = originalValue.toString();
      compositionEvent(initialComposition);
    }
  }, [originalValue]);

  return (
    <StyledInputText
      ref={input}
      {...otherDomProps}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
    />
  );
};
