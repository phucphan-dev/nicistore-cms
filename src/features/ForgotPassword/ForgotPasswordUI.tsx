import { MailOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';

import logoImg from 'common/assets/images/logo.png';
import Form from 'common/components/Form';
import Image from 'common/components/Image';
import Input from 'common/components/Input';
import Link from 'common/components/Link';
import UnAuthLayout from 'common/components/UnAuthLayout';

export type ForgotPasswordFormTypes = {
  email: string;
};

interface ForgotPasswordProps {
  method: UseFormReturn<ForgotPasswordFormTypes>;
  href?: string;
  onSubmit: (data: ForgotPasswordFormTypes) => void;
}

const ForgotPasswordUI: React.FC<ForgotPasswordProps> = ({ method, href, onSubmit }) => (
  <UnAuthLayout className="p-forgotPassword">
    <div className="p-forgotPassword_context u-mt-26 u-mt-lg-0">
      <div className="p-forgotPassword_form">
        <div className="p-forgotPassword_logo">
          <Image
            src={logoImg}
            ratio="logo"
          />
        </div>
        <div className="p-forgotPassword_heading u-mt-24 u-mt-lg-40">
          <Typography.Title level={2}>
            YÊU CẦU ĐỔI MẬT KHẨU
          </Typography.Title>
          <div className="p-forgotPassword_desc u-mt-20">
            <Typography.Text>
              Vui lòng nhập email đã sử dụng đăng ký tài khoản để lấy lại mật khẩu
            </Typography.Text>
          </div>
        </div>
        <div
          className="p-forgotPassword_form_wrap u-mt-26 u-mt-lg-40"
        />
        <Form
          method={method}
          submitForm={onSubmit}
        >
          <div className="p-forgotPassword_form_input">
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
                  placeholder="Nhập email"
                  modifiers="bottomBorder"
                  prefix={<MailOutlined />}
                />
              )}
            />
          </div>
          <div className="p-forgotPassword_form_submit u-mt-20">
            <Button
              block
              type="primary"
              htmlType="submit"
            >
              GỬI YÊU CẦU
            </Button>
          </div>
          {
            href
            && (
              <div className="p-forgotPassword_link u-mt-12 ">
                Đã có tài khoản?
                {' '}
                <Link href={href} title="Quên mật khẩu?" customClassName="u-ml-4">
                  <Typography.Text>
                    Đăng nhập
                  </Typography.Text>
                </Link>
              </div>
            )
          }
        </Form>
      </div>
    </div>
  </UnAuthLayout>
);

export default ForgotPasswordUI;
