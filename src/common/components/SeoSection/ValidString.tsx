import React from 'react';

import mapModifiers from 'common/utils/functions';

interface ValidStringProps {
  isValid?: boolean;
  validText?: string;
}

const ValidString: React.FC<ValidStringProps> = ({
  isValid,
  validText,
}) => (
  <div className={mapModifiers('o-validString', isValid && 'isValid')}>
    <div className="o-validString_icon" />
    <span className="o-validString_text">{validText}</span>
  </div>
);

ValidString.defaultProps = {
  isValid: false,
  validText: '',
};

export default ValidString;
