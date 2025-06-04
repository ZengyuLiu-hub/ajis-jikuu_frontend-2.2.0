import React, { ReactNode, ChangeEvent, useRef } from 'react';
import styled from 'styled-components';

import { StyledButton } from './';

export const StyledUploadTextButton = styled(StyledButton)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0 0 22px;
  background: rgba(242, 242, 242, 1);
  border-color: rgba(153, 153, 153, 1);
  color: rgba(218, 165, 32, 1);
  min-width: 180px;
  min-height: 22px;
  height: 22px;
  font-size: 13px;
  font-weight: bold;

  span {
    color: rgba(218, 165, 32, 1);
    padding: 0 20px;
  }

  &:hover {
    background: rgba(255, 252, 246, 1);
    border-color: rgba(252, 226, 171, 1);
    color: rgba(255, 166, 0, 1);

    span {
      color: rgba(255, 166, 0, 1);
    }

    &::before {
      background-color: rgba(255, 166, 0, 1);
    }
  }

  &:focus {
    background: rgba(215, 240, 255, 1);
    border-color: rgba(153, 153, 153, 1);
    color: rgba(218, 165, 32, 1);

    span {
      color: rgba(218, 165, 32, 1);
    }

    &::before {
      background-color: rgba(218, 165, 32, 1);
    }
  }

  &[aria-disabled='true'],
  &:disabled {
    background: rgba(242, 242, 242, 1);
    color: rgba(218, 165, 32, 1);

    span {
      color: rgba(218, 165, 32, 1);
    }

    &::before {
      background-color: rgba(218, 165, 32, 1);
    }

    &:hover {
      background: rgba(242, 242, 242, 1);
      border-color: rgba(153, 153, 153, 1);
      color: rgba(218, 165, 32, 1);

      span {
        color: rgba(218, 165, 32, 1);
      }

      &::before {
        background-color: rgba(218, 165, 32, 1);
      }
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(218, 165, 32, 1);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 14px 14px;
    background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' style='width: 32px; height: 32px; opacity: 1;' xml:space='preserve'%3E%3Cstyle type='text/css'%3E.st0{fill:%23374149;}%3C/style%3E%3Cg%3E%3Cpath class='st0' d='M148.012,168.36h46.066c5.73,0,10.374,4.645,10.374,10.375v146.774c0,5.73,4.645,10.375,10.375,10.375h82.344c5.73,0,10.375-4.645,10.375-10.375V178.735c0-5.73,4.644-10.375,10.374-10.375h46.066c8.574,0,13.45-9.808,8.27-16.644		L264.27,9.172c-4.153-5.481-12.386-5.481-16.539,0L139.742,151.716C134.566,158.552,139.438,168.36,148.012,168.36z' style='fill: rgb(255, 255, 255);'%3E%3C/path%3E%3Cpolygon class='st0' points='444.774,318.911 444.774,439.716 67.222,439.716 67.222,318.911 0,318.911 0,506.938 512,506.938 512,318.911 ' style='fill: rgb(255, 255, 255);'%3E%3C/polygon%3E%3C/g%3E%3C/svg%3E");
    border-radius: 3px 0 0 3px;
    width: 22px;
  }
`;

const StyledInputFile = styled.input`
  display: none;
  margin: 0;
  width: 0;
  height: 0;
`;

interface Props {
  children?: ReactNode;
  disabled?: boolean;
  onFileSelection: (file: File) => void;
}

/**
 * アップロードテキストボタン
 *
 * @param props プロパティ
 */
export const UploadTextButton = (props: Props) => {
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

    onFileSelection(fileInput.current.files[0]);
    fileInput.current.value = '';
  };

  return (
    <>
      <StyledUploadTextButton
        children={props.children}
        onClick={() =>
          fileInput && fileInput.current && fileInput.current.click()
        }
        disabled={props.disabled}
      />
      <StyledInputFile
        ref={fileInput}
        type="file"
        onChange={changeSelectedFile}
      />
    </>
  );
};
