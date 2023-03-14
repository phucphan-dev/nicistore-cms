import { SaveOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button, Card, Col, message, Row, Typography
} from 'antd';
import React, { useEffect } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { DropdownElement } from 'common/components/DropdownType';
import HeaderPage from 'common/components/HeaderPage';
import Input from 'common/components/Input';
import ManagementInfo from 'common/components/ManagementInfo';
import { createUserService, getUserService, updateUserService } from 'common/services/users';
import { CreateUserParams, UpdateUserParams } from 'common/services/users/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { userFormSchema } from 'common/utils/schemas';

type UserFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  roles: number[];
};

const UserDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idParams = Number(searchParams.get('id'));
  const method = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      roles: []
    },
    resolver: yupResolver(userFormSchema),
  });
  const { data: userData, isLoading: userDataLoading } = useQuery(
    ['getUserDataId', { idParams }],
    () => {
      if (idParams) {
        return getUserService(idParams);
      }
      return undefined;
    },
  );
  const { mutate: createMutate, isLoading: createLoading } = useMutation(
    ['user-create'],
    async (params: CreateUserParams) => createUserService(params),
    {
      onSuccess: () => {
        navigate(`${ROUTE_PATHS.USERS_MANAGEMENT}`);
      },
      onError: () => {
        message.error('Đã có lỗi xảy ra! Vui lòng thử lại sau');
      }
    }
  );

  const { mutate: updateMutate, isLoading: updateLoading } = useMutation(
    ['user-update'],
    async (params: UpdateUserParams) => updateUserService(params),
    {
      onSuccess: () => {
        navigate(`${ROUTE_PATHS.USERS_MANAGEMENT}`);
      },
      onError: () => {
        message.error('Đã có lỗi xảy ra! Vui lòng thử lại sau');
      }

    }
  );
  const onSubmit = async () => {
    const formData = method.getValues();
    if (idParams) {
      updateMutate({
        id: idParams,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roles: formData.roles,
      });
    } else {
      createMutate({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        roles: formData.roles,
      });
    }
  };
  useEffect(() => {
    if (userData) {
      method.reset({
        name: userData.user.name,
        email: userData.user.email,
        password: '',
        confirmPassword: '',
        roles: userData.assignedRoles
      });
    }
  }, [method, userData]);
  return (
    <FormProvider<UserFormData> {...method}>
      <HeaderPage
        fixed
        title={idParams ? 'Chỉnh sửa thành viên' : 'Tạo thành viên'}
        rightHeader={(
          <Button
            type="primary"
            loading={userDataLoading || createLoading || updateLoading}
            onClick={method.handleSubmit(onSubmit)}
          >
            <SaveOutlined />
            {t('system.save')}
          </Button>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <Row gutter={16}>
          <Col xxl={18} xl={16} lg={16}>
            <Card>
              <div>
                <Typography.Text strong>
                  Vai trò
                </Typography.Text>
                <Controller
                  name="roles"
                  control={method.control}
                  render={({ field }) => (
                    <DropdownElement
                      type="role"
                      placeholder="Chọn vai trò"
                      locale="vi"
                      value={field.value}
                      onChange={field.onChange}
                      multiple={{}}
                    />
                  )}
                />
              </div>
              <div className="u-mt-16">
                <Row gutter={16}>
                  <Col span={12}>
                    <Typography.Text strong>
                      Họ và tên
                      {' '}
                    </Typography.Text>
                    <Typography.Text strong type="danger">
                      *
                    </Typography.Text>
                    <Controller
                      name="name"
                      defaultValue=""
                      render={({
                        field: { value, onChange },
                        fieldState: { error },
                      }) => (
                        <Input
                          className="u-mt-8"
                          name="name"
                          placeholder="Nhập họ và tên"
                          value={value}
                          onChange={onChange}
                          error={error?.message}
                          size="large"
                        />
                      )}
                    />
                  </Col>
                  <Col span={12}>
                    <Typography.Text strong>
                      Email
                      {' '}
                    </Typography.Text>
                    <Typography.Text strong type="danger">
                      *
                    </Typography.Text>
                    <Controller
                      name="email"
                      defaultValue=""
                      render={({
                        field: { value, onChange },
                        fieldState: { error },
                      }) => (
                        <Input
                          className="u-mt-8"
                          name="email"
                          placeholder="Nhập email"
                          value={value}
                          onChange={onChange}
                          error={error?.message}
                          size="large"
                        />
                      )}
                    />
                  </Col>
                </Row>
              </div>
              <div className="u-mt-16">
                <Row gutter={16}>
                  <Col span={12}>
                    <Typography.Text strong>
                      Mật khẩu
                      {' '}
                    </Typography.Text>
                    <Controller
                      name="password"
                      defaultValue=""
                      render={({
                        field: { value, onChange },
                        fieldState: { error },
                      }) => (
                        <Input
                          className="u-mt-8"
                          name="password"
                          type="password"
                          placeholder="Nhập mật khẩu"
                          value={value}
                          onChange={onChange}
                          error={error?.message}
                          autoComplete="off"
                          size="large"
                        />
                      )}
                    />
                  </Col>
                  <Col span={12}>
                    <Typography.Text strong>
                      Xác nhận mật khẩu
                      {' '}
                    </Typography.Text>
                    <Controller
                      name="confirmPassword"
                      defaultValue=""
                      render={({
                        field: { value, onChange },
                        fieldState: { error },
                      }) => (
                        <Input
                          className="u-mt-8"
                          name="confirmPassword"
                          placeholder="Xác nhận mật khẩu"
                          type="password"
                          value={value}
                          onChange={onChange}
                          error={error?.message}
                          autoComplete="off"
                          size="large"
                        />
                      )}
                    />
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
          <Col xxl={6} xl={8} lg={8}>
            <ManagementInfo
              createdDate="7 tháng trước"
              createdBy="Admin"
              lastUpdated="4 tháng trước"
              lastUpdatedBy="Admin"
            />
          </Col>
        </Row>
      </div>
    </FormProvider>
  );
};

export default UserDetail;
