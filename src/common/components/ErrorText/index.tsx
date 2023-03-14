import React from 'react';

interface ErrorTextProps {
  children?: React.ReactNode;
}

const ErrorText: React.FC<ErrorTextProps> = ({ children }) => (
  <div className="a-errortext ant-form-item-explain ant-form-item-explain-error">
    <div role="alert">
      {children}
    </div>
  </div>
);

export default ErrorText;
