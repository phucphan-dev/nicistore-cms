/* eslint-disable react/no-danger */
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { InputProps, Input as AntdInput, InputRef as AntdInputRef } from 'antd';
import React, {
  forwardRef, Ref, useRef
} from 'react';

import mapModifiers from 'common/utils/functions';

type Modifier = 'secondary' | 'bottomBorder';

interface InputEleProps extends InputProps {
  modifiers?: Modifier | Modifier[];
  error?: string;
  isSearch?: boolean;
  show?: boolean;
  handleClear?: () => void;
  handleOpen?: () => void;
  handleSubmit?: () => void;
}

const InputRef: React.ForwardRefRenderFunction<HTMLInputElement, InputEleProps> = ({
  modifiers,
  error,
  bordered,
  isSearch,
  value,
  show,
  handleClear,
  handleOpen,
  handleSubmit,
  ...rest
}, ref) => {
  const inputRef = useRef(null);

  return (
    <div
      className={mapModifiers('a-input', modifiers, bordered && 'bordered', isSearch && 'search', show && 'show')}
      ref={inputRef}
      onMouseEnter={rest.onMouseEnter}
    >
      <div className="a-input_container">
        {isSearch && (
          <SearchOutlined
            onClick={handleOpen}
            style={{ fontSize: 14 }}
          />
        )}
        <AntdInput
          className={mapModifiers('a-input_input', show && 'show')}
          type="text"
          size="large"
          value={value}
          ref={ref as Ref<AntdInputRef>}
          bordered={bordered}
          onPressEnter={handleSubmit}
          {...rest}
        />
        {isSearch && value && (
          <CloseOutlined
            onClick={handleClear}
            style={{ fontSize: 14 }}
          />
        )}
      </div>
      {error && (
        <span
          className="a-input_errorMessage"
        >
          {error}
        </span>
      )}
    </div>
  );
};

const Input = forwardRef(InputRef);

export default Input;
