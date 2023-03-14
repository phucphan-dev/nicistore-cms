import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';

import ForgotPasswordUI, { ForgotPasswordFormTypes } from './ForgotPasswordUI';

import { forgotPasswordSchema } from 'common/utils/schemas';

const ForgotPassword: React.FC = () => {
  const methodCP = useForm<ForgotPasswordFormTypes>({
    resolver: yupResolver(forgotPasswordSchema),
  });
  return (
    <ForgotPasswordUI
      href="/"
      method={methodCP}
      // eslint-disable-next-line no-console
      onSubmit={(data) => console.log(data)}
    />
  );
};

export default ForgotPassword;
