import React, { ReactNode, ChangeEvent, useRef } from 'react';
import styled from 'styled-components';

import { StyledButton } from './';

export const StyledLoadFileTextButton = styled(StyledButton)`
  span {
    color: rgba(102, 102, 102, 1);
  }
`;

const StyledInputFile = styled.input`
  display: none;
  margin: 0;
  width: 0;
  height: 0;
`;

interface Props {
  accept?: string;
  children?: ReactNode;
  disabled?: boolean;
  onFileSelection: (file: File, filePath: string) => void;
}

/**
 * ファイル読み込み.
 */
export const LoadFileTextButton = (props: Props) => {
  const { onFileSelection } = props;

  // ファイル選択コンポーネント参照
  const fileInput = useRef<HTMLInputElement>(null);

  // 選択ファイル変更
  const changeSelectedFile = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (
      !fileInput ||
      !fileInput.current ||
      !fileInput.current.files ||
      fileInput.current.files.length === 0
    ) {
      return;
    }

    onFileSelection(fileInput.current.files[0], e.target.value);
    fileInput.current.value = '';
  };

  return (
    <>
      <StyledLoadFileTextButton
        children={props.children}
        onClick={() =>
          fileInput && fileInput.current && fileInput.current.click()
        }
        disabled={props.disabled}
      />
      <StyledInputFile
        ref={fileInput}
        type="file"
        name="files[]"
        accept={props.accept}
        onChange={changeSelectedFile}
      />
    </>
  );
};
