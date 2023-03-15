/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup';
import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import LoginUI, { LoginFormTypes } from './LoginUI';
import { getProfileAction, setRoles } from './authenticateSlice';

import { useAppDispatch, useAppSelector } from 'app/store';
import { getAdvancedFilterAction } from 'app/systemSlice';
import loginService from 'common/services/authenticate';
import { setAccessToken, setRefreshToken } from 'common/services/common/storage';
import verifyToken from 'common/utils/jwtHelper';
import { loginSchema } from 'common/utils/schemas';

const Login: React.FC = () => {
  /* Hooks */
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const systemData = useAppSelector(
    (stateSystem) => stateSystem.system.initialData
  );
  const method = useForm<LoginFormTypes>({
    resolver: yupResolver(loginSchema),
  });

  /* State */
  const [loading, setLoading] = useState(false);
  const recaptchaToken = useRef<ReCAPTCHA>(null);

  /* Functions */
  const { mutateAsync } = useMutation(
    'loginAction',
    async (data: LoginFormTypes) => loginService({
      email: data.email,
      password: data.password,
      // ggRecaptchaToken: data.token || '',
      // otpCode: data.otpCode
    }),
    {
      onSuccess: async (data) => {
        // const payload = await verifyToken(data.accessToken, systemData?.passportPublicKey || '');
        // if (payload) {
        // dispatch(setRoles(payload.scopes as string[]));
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        await dispatch(getProfileAction()).unwrap()
          .then(() => navigate((state as { from?: string })?.from || '/')).catch(() => {
            message.error('Đã có lỗi xảy ra!');
          });
        // await dispatch(getAdvancedFilterAction()).unwrap();
        // }
        setLoading(false);
      },
      onError: (errors: ErrorResponse[]) => {
        if (errors.length) {
          const error = errors[0];
          switch (error.code) {
            case 'validate_001':
              method.setError('password', { message: t('login.incorrect') });
              break;
            case 'otpCodeIsRequired':
              method.setError('password', { message: t('login.otpCodeIsRequired') });
              break;
            case 'invalidOtpCode':
              method.setError('otpCode', { message: t('login.invalidOtpCode') });
              break;
            default:
              method.setError('password', { message: t('media.something_wrong') });
              break;
          }
        } else {
          method.setError('password', { message: t('media.something_wrong') });
        }
        setLoading(false);
      }
    }
  );

  const loginAsync = async (data: LoginFormTypes) => {
    setLoading(true);
    // recaptchaToken.current?.reset();
    // const token = await recaptchaToken.current?.executeAsync();

    // if (token) {
    await mutateAsync({ ...data });
    // }
  };

  /* Render */
  return (
    <>
      <LoginUI
        method={method}
        isLoading={loading}
        onSubmit={loginAsync}
      />
      {/* <ReCAPTCHA
        ref={recaptchaToken}
        size="invisible"
        theme="light"
        badge="bottomright"
        sitekey={systemData?.googleRecaptchaKey || ''}
      /> */}
    </>
  );
};

export default Login;
