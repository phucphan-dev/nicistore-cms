import React, { useEffect, useRef, useState } from 'react';

import useClickOutside from 'common/hooks/useClickOutside';
import mapModifiers from 'common/utils/functions';

interface PulldownProps {
  placeholder?: string;
  value?: OptionType;
  options: OptionType[];
  error?: string;
  disabled?: boolean;
  variant?: 'normal';
  size?: 'md' | 'lg' | 'sm';
  handleSelect?: (option: OptionType) => void;
}

const Pulldown: React.FC<PulldownProps> = ({
  size = 'lg',
  placeholder,
  value,
  options,
  error,
  disabled,
  variant = 'normal',
  handleSelect,
}) => {
  const pulldownRef = useRef<HTMLDivElement>(null);
  const [optionData, setOptionData] = useState<OptionType[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggling = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  useClickOutside(pulldownRef, () => {
    if (isOpen) setIsOpen(false);
  });

  useEffect(() => {
    setOptionData(options);
  }, [options]);

  return (
    <div
      className={`${mapModifiers('m-pulldown', error && 'error', disabled && 'disabled', variant, size)}`}
      ref={pulldownRef}
    >
      <div className="m-pulldown_header" onClick={toggling}>
        <div
          className={`m-pulldown_header_content${value ? '' : ' m-pulldown_placeholder'
            }`}
        >
          <span>{value ? value.label : placeholder}</span>
        </div>
        <div className="m-pulldown_fn">
          <span className={isOpen ? 'm-pulldown_arrow opened' : 'm-pulldown_arrow'} />
        </div>
      </div>
      {isOpen && (
        <div className="m-pulldown_wrapper">
          <ul className="m-pulldown_list">
            {optionData.length ? (
              optionData.map((option, index) => (
                <li
                  key={`option-${index.toString()}`}
                  className={mapModifiers(
                    'm-pulldown_item',
                    value?.label === option.label && 'active',
                  )}
                  onClick={() => {
                    if (handleSelect) {
                      handleSelect(option);
                      setIsOpen(false);
                    }
                  }}
                >
                  <span>{option.label}</span>
                </li>
              ))
            ) : (
              <li className="m-pulldown_item none">No Option</li>
            )}
          </ul>
        </div>
      )}
      {error && <span className="m-pulldown_error">{error}</span>}
    </div>
  );
};

export default Pulldown;
