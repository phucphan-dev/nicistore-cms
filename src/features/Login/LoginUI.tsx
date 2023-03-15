/* eslint-disable @typescript-eslint/no-unused-vars */
import { LockOutlined, MailOutlined, QrcodeOutlined } from '@ant-design/icons';
import {
  Button, Checkbox, Select, Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  Controller, UseFormReturn,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import logoImg from 'common/assets/images/logo.svg';
import backgroundImg from 'common/assets/images/signin_bg.jpg';
import Form from 'common/components/Form';
import Icon from 'common/components/Icon';
import Image from 'common/components/Image';
import Input from 'common/components/Input';
import UnAuthLayout from 'common/components/UnAuthLayout';
import { getCurrentLanguage, i18ChangeLanguage } from 'i18n';

const { Option } = Select;

export type LoginFormTypes = {
  email: string;
  password: string;
  otpCode?: string;
  token?: string;
};
interface LoginProps {
  method: UseFormReturn<LoginFormTypes>;
  isLoading?: boolean;
  onSubmit: (data: LoginFormTypes) => void;
}

const LoginUI: React.FC<LoginProps> = ({
  method, isLoading, onSubmit
}) => {
  const { t } = useTranslation();
  const [valueLanguage, setValueLanguage] = useState(getCurrentLanguage());
  const [isTFA, setIsTFA] = useState(false);

  const changeLanguage = (value: string) => {
    setValueLanguage(value);
    i18ChangeLanguage(value);
  };

  useEffect(() => {
    if (!isTFA) {
      method.setValue('otpCode', undefined);
    }
  }, [isTFA, method]);

  return (
    <UnAuthLayout imgSrc={backgroundImg} className="login">
      <div className="p-login_context u-mt-26 u-mt-lg-0">
        <div className="p-login_form">
          <div className="p-login_logo">
            <Image
              src={logoImg}
              ratio="logo"
            />
          </div>
          <div className="p-login_heading u-mt-24 u-mt-lg-40 text_center">
            <Typography.Title level={2}>
              {t('login.title')}
            </Typography.Title>
          </div>
          <div
            className="p-login_form_wrap u-mt-26 u-mt-lg-40"
          />
          <Form
            method={method}
            submitForm={onSubmit}
          >
            <div className="p-login_form_input">
              <Controller
                name="email"
                control={method.control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    size="large"
                    bordered={false}
                    type="email"
                    name="email"
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                    placeholder={t('login.email')}
                    modifiers="bottomBorder"
                    prefix={<MailOutlined />}

                  />
                )}
              />
            </div>
            <div className="p-login_form_input u-mt-24">
              <Controller
                name="password"
                control={method.control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    type="password"
                    size="large"
                    autoComplete="off"
                    name="password"
                    bordered={false}
                    modifiers="bottomBorder"
                    placeholder={t('login.password')}
                    prefix={<LockOutlined />}
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </div>
            {/* <div className="u-mt-24">
              <div className="u-ml-12">
                <Checkbox
                  checked={isTFA}
                  onChange={(e) => setIsTFA(e.target.checked)}
                >
                  {t('totp.twoFactor')}
                </Checkbox>
              </div>
              {isTFA && (
                <div className="p-login_form_input u-mt-24">
                  <Controller
                    name="otpCode"
                    control={method.control}
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        type="text"
                        size="large"
                        name="otpCode"
                        bordered={false}
                        modifiers="bottomBorder"
                        prefix={<QrcodeOutlined />}
                        placeholder={`${t('system.input')} ${t('totp.inputOtp')}`}
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </div>
              )}
            </div> */}
            <div className="p-login_form_submit u-mt-20">
              <Button
                block
                type="primary"
                htmlType="submit"
                loading={isLoading}
              >
                {t('login.buttonTxt')}
              </Button>
            </div>

            {/* <div className="p-login_link u-mt-12">
              <Link href="/" title="Quên mật khẩu?">
                <Typography.Text>
                  Quên mật khẩu?
                </Typography.Text>
              </Link>
            </div> */}
          </Form>
        </div>
        <div className="p-login_language">
          <Select
            defaultValue="vi"
            className="sideBar_languagePulldown"
            placement="topLeft"
            value={valueLanguage}
            onChange={changeLanguage}
          >
            <Option value="vi">
              <div className="sideBar_languagePulldown_option">
                <span role="img" aria-label="vi">
                  <Icon iconName="vietnam" size="20" />
                </span>
                {t('system.languageVi')}
              </div>
            </Option>
            <Option value="en">
              <div className="sideBar_languagePulldown_option">
                <span role="img" aria-label="en">
                  <Icon iconName="english" size="20" />
                </span>
                {t('system.languageEn')}
              </div>
            </Option>
          </Select>
        </div>
      </div>
    </UnAuthLayout>
  );
};

export default LoginUI;
