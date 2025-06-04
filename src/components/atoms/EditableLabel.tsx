import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

export const StyledEditableLabel = styled.span`
  display: flex;
  align-self: center;
  padding: 0 10px;
  color: rgba(102, 102, 102, 1);
`;

export const StyledInputText = styled.input`
  border: none;
  margin: 0;
  padding: 1px 4px;
  min-width: 20px;
  max-width: 100%;
  min-height: 20px;
  font-size: 1rem;

  &:focus {
    outline: none;
  }
`;
StyledInputText.defaultProps = {
  type: 'text',
};

interface Props {
  className?: string;
  value: string;
  onChange(newValue: string): void;
}

export const EditableLabel = (props: Props) => {
  const inputTextRef = useRef<HTMLInputElement>(null);

  const [isEditing, setEditing] = useState(false);
  const [composition, setComposition] = useState(false);

  const handleDoubleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();

    setEditing(true);
  };

  const handleKeyDownInputText = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (e.key === 'Enter' && !composition) {
      setEditing(false);
      props.onChange(
        !!e.currentTarget.value ? e.currentTarget.value : props.value
      );
    } else if (e.key === 'Escape') {
      setEditing(false);
      props.onChange(props.value);
    }
  };

  const handleBlurInputText = (e: React.FocusEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setEditing(false);
    props.onChange(props.value);
  };

  useEffect(() => {
    if (isEditing) {
      inputTextRef.current?.focus();
    }
  }, [isEditing]);

  return isEditing ? (
    <StyledInputText
      ref={inputTextRef}
      onKeyDown={handleKeyDownInputText}
      onBlur={handleBlurInputText}
      onCompositionStart={() => setComposition(true)}
      onCompositionEnd={() => setComposition(false)}
      defaultValue={props.value}
    />
  ) : (
    <StyledEditableLabel
      title={props.value}
      className={props.className}
      onDoubleClick={handleDoubleClick}
    >
      {props.value}
    </StyledEditableLabel>
  );
};
