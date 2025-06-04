import React, { useReducer, useRef } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';

export const StyledInputNumber = styled.input`
  border: 1px solid rgba(151, 151, 151, 1);
  background: rgba(245, 245, 245, 1);
  margin: 0;
  padding-left: 4px;
  min-width: 100px;
  min-height: 24px;
  font-size: 1rem;
  text-align: right;

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
StyledInputNumber.defaultProps = {
  type: 'text',
};

const initialComposition = {
  isComposing: false,
  composedValue: '',
  changedValue: '',
};

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 空値の場合の振る舞い(DEFAULT=標準の動作、NOTHING=何もしない) */
  nullBehavior?: 'DEFAULT' | 'NOTHING';
}

/**
 * 数値入力
 */
export const InputNumber = (props: Props) => {
  const {
    value: originalValue = '',
    nullBehavior = 'DEFAULT',
    ...otherProps
  } = props;

  const input = useRef<HTMLInputElement>(null);

  const [composition, compositionEvent] = useReducer(
    (prev: typeof initialComposition, next: any) => {
      return { ...prev, ...next };
    },
    initialComposition,
  );

  // データ修正
  const correctionData = (value: string, min: string, max: string) => {
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

  // 数値フォーマット
  const formatNumber = (value: string) =>
    !value
      ? '0'
      : value
          .replace(/[０-９]/g, (s) =>
            String.fromCharCode(s.charCodeAt(0) - 0xfee0),
          )
          .replace(/[‐－―ー−]/g, '-')
          .replace(/(^[0][-]|^[-][0])/g, '-')
          .replace(/[^\-0-9]/g, '')
          .replace(/(?!^-)[^0-9]/g, '')
          // 数値の場合は頭０を除去
          .replace(/[0-9]+/g, (s) => `${Number(s)}`);

  // 変更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!input || !input.current) {
      return;
    }

    // IME 入力中は、途中までの文字列で input を書き換えないように以降の処理しない
    if (composition.isComposing) {
      return;
    }
    // IME 入力確定したら、確定した時点の文字列で input を上書きするために変換
    if (composition.composedValue) {
      const changedValue = formatNumber(composition.composedValue);
      compositionEvent({ composedValue: '', changedValue });
      input.current.value = changedValue;
      return;
    }

    const { value } = e.target;

    if (value || nullBehavior === 'DEFAULT') {
      input.current.value = formatNumber(value);
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
    const { value } = input.current;

    // ステップ入力
    const step = props.step === undefined ? 1 : Number(props.step);

    // 上矢印キー
    if (key.toLowerCase() === 'arrowup') {
      const newValue = Number(value) + step;
      if (props.max === undefined || Number(props.max) >= newValue) {
        input.current.value = `${newValue}`;
      }
      return;
    }

    // 下矢印キー
    if (key.toLowerCase() === 'arrowdown') {
      const newValue = Number(value) - step;
      if (props.min === undefined || Number(props.min) <= newValue) {
        input.current.value = `${newValue}`;
      }
      return;
    }

    // 最大文字列長
    if (props.maxLength !== undefined && props.maxLength > -1) {
      const { value, selectionStart, selectionEnd } = input.current;
      const overwriteLength = (selectionEnd ?? 0) - (selectionStart ?? 0);

      if (value && value.length - overwriteLength >= props.maxLength) {
        e.preventDefault();
        return;
      }
    }
  };

  // フォーカスイン
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!input || !input.current) {
      return;
    }
    input.current.select();
  };

  // フォーカスアウト
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!input || !input.current) {
      return;
    }
    const { min, max } = input.current;

    let { value } = e.target;

    // IME 入力確定後に変更されたら、変更した時点の文字列で以降の処理を実行
    if (composition.changedValue) {
      value = composition.changedValue;
      compositionEvent({ changedValue: '' });
    }

    const formatNumberValue = () => {
      const formattedValue = formatNumber(value);
      return formattedValue === '-' ? '-1' : formattedValue;
    };

    let newValue = value;
    if (value || nullBehavior === 'DEFAULT') {
      newValue = correctionData(formatNumberValue(), min, max);

      input.current.value = newValue;
    }

    if (props.onBlur) {
      props.onBlur({ ...e, target: { ...input.current, value: newValue } });
    }
  };

  useEffect(() => {
    if (input.current) {
      input.current.value = originalValue.toString();
      compositionEvent(initialComposition);
    }
  }, [originalValue]);

  return (
    <StyledInputNumber
      {...otherProps}
      ref={input}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onCompositionStart={() =>
        compositionEvent({ isComposing: true, composedValue: '' })
      }
      onCompositionEnd={(e) =>
        compositionEvent({ isComposing: false, composedValue: e.data })
      }
    />
  );
};
