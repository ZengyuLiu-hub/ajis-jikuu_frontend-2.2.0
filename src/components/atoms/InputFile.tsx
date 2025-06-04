import { ReactNode, ChangeEvent, useRef } from 'react';
import styled from 'styled-components';

import { Button } from './';

export const StyledInputFile = styled.input`
  display: none;
  margin: 0;
  width: 0;
  height: 0;
`;

interface Props {
  title?: string;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  onClick?(): void;
  onFileSelection(file: File): boolean;
}

/**
 * ファイル選択ボタン
 *
 * @param props プロパティ
 */
export const InputFile = (props: Props) => {
  const { onFileSelection } = props;

  // ファイル選択コンポーネント参照
  const fileInput = useRef<HTMLInputElement>(null);

  // 選択ファイル変更
  const changeSelectedFile = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (
      !fileInput.current ||
      !fileInput.current.files ||
      fileInput.current.files.length === 0
    ) {
      return;
    }

    onFileSelection(fileInput.current.files[0]);
    fileInput.current.value = '';
  };

  return (
    <>
      <Button
        title={props.title}
        className={props.className}
        children={props.children}
        onClick={() =>
          fileInput && fileInput.current && fileInput.current.click()
        }
        disabled={props.disabled}
      />
      <StyledInputFile
        ref={fileInput}
        type="file"
        onClick={props.onClick}
        onChange={changeSelectedFile}
      />
    </>
  );
};
