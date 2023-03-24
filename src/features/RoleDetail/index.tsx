import { SaveOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  message,
  Select,
  Space,
  Spin,
  Typography
} from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import React, {
  useEffect, useMemo, useRef,
} from 'react';
import {
  Controller, FormProvider, useForm,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  convertPermissionAllDataTable,
  convertPermissionData,
  convertPermissionDataForm,
  getPermissionColumnObj,
  tagRender,
} from './functions';
import { RoleDetailForm, RolePermissionProps } from './types';

import HeaderPage from 'common/components/HeaderPage';
import Input from 'common/components/Input';
import {
  createRoleService, getAllPermissionsService, getRoleService, updateRoleService
} from 'common/services/roles';
import { CreateRoleParams, UpdateRoleParams } from 'common/services/roles/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { roleFormSchema } from 'common/utils/schemas';

const RowCheckbox: React.FC<{
  name: string,
  // data: RolePermissionProps,
  // handleCheckRow: (item: RolePermissionProps) => void;
}> = ({ name }) => {
  /* Hook */
  const { t } = useTranslation();

  return (
    <Space align="center">
      {/* <Checkbox
      checked={false}
      onChange={() => {
          handleCheckRow(data);
        }}
    /> */}
      <Typography.Text>
        {t(`role.${name}`)}
      </Typography.Text>
    </Space>
  );
};

const RoleDetail: React.FC<ActiveRoles> = () => {
  /* Hook */
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idParam = useRef({
    id: Number(searchParams.get('id')),
    isValid: Number(searchParams.get('id') ?? -1) >= 0,
  });

  /* React-hook-form */
  const method = useForm<RoleDetailForm>({
    mode: 'onSubmit',
    resolver: yupResolver(roleFormSchema),
  });

  /* React-query */
  const {
    isLoading: permissionLoading,
    data: permissionData,
  } = useQuery(
    ['roleManagement-permissions'],
    () => getAllPermissionsService(),
    { keepPreviousData: true }
  );

  const {
    isFetching: detailLoading,
    data: detailData,
  } = useQuery(
    ['roleManagement-detail', idParam.current.id],
    () => getRoleService({ id: idParam.current.id }),
    { enabled: idParam.current.isValid }
  );

  const { mutate: createMutate, isLoading: createLoading } = useMutation(
    ['roleManagement-create'],
    async (params: CreateRoleParams) => createRoleService(params),
    {
      onSuccess: () => {
        message.success('Tạo thành công!');
        queryClient.invalidateQueries(['roleManagement-list']);
        method.reset();
        navigate(`${ROUTE_PATHS.ROLES_MANAGEMENT}`);
      },
      onError: () => {
        message.error('Đã có lỗi xảy ra! Vui lòng thử lại sau');
      }

    }
  );

  const { mutate: updateMutate, isLoading: updateLoading } = useMutation(
    ['roleManagement-update'],
    async (params: UpdateRoleParams) => updateRoleService(params),
    {
      onSuccess: () => {
        message.success('Cập nhật thành công!');
        queryClient.invalidateQueries(['roleManagement-list']);
        method.reset();
        navigate(`${ROUTE_PATHS.ROLES_MANAGEMENT}`);
      },
      onError: () => {
        message.error('Đã có lỗi xảy ra! Vui lòng thử lại sau');
      }

    }
  );

  /* Datas */
  const tableData: RolePermissionProps[] = useMemo(() => {
    if (permissionData) {
      return convertPermissionAllDataTable(permissionData);
    }
    return [];
  }, [permissionData]);

  /* Functions */
  // const handleCheckRow = useCallback((data: RolePermissionProps) => {
  //   const props = tableData.find((ele) => ele.module === data.module);
  //   const prevData = method.watch();
  //   if (props) {
  //     const { module, ...rest } = props;
  //     method.reset({
  //       ...prevData,
  //       permissions: Object.assign(prevData.permissions, { [module]: rest })
  //     });
  //   }
  // }, [tableData, method]);

  const handleSubmit = (data: RoleDetailForm) => {
    if (idParam.current.isValid) {
      updateMutate({
        id: idParam.current.id,
        display_name: data.displayName,
        permissions: convertPermissionData(data.permissions),
      });
    } else {
      createMutate({
        display_name: data.displayName,
        permissions: convertPermissionData(data.permissions),
      });
    }
  };

  /* Table */
  const columns: ColumnsType<RolePermissionProps> = useMemo(() => ([
    {
      title: () => null,
      dataIndex: 'module',
      key: 'module',
      width: 200,
      render: (_name) => (
        <RowCheckbox
          name={_name}
        // data={_data}
        // handleCheckRow={() => {
        //   handleCheckRow(_data);
        // }}
        />
      )
    },
    getPermissionColumnObj('index', t('role.index')),
    getPermissionColumnObj('store', t('role.store')),
    getPermissionColumnObj('update', t('role.update')),
    getPermissionColumnObj('destroy', t('role.destroy')),
    {
      title: t('role.others'),
      align: 'center',
      dataIndex: 'others',
      key: 'others',
      render: (_name, _data) => (!_data.others?.length ? null : (
        <Controller
          name={`permissions[${_data.module}][others]`}
          defaultValue={[]}
          render={({
            field: { value, onChange },
          }) => (
            <Select
              mode="multiple"
              size="middle"
              allowClear
              style={{ width: '100%' }}
              placeholder={t('system.pleaseSelect')}
              value={value}
              onChange={onChange}
              tagRender={tagRender}
            >
              {
                _data.others?.map((val, idx) => (
                  <Select.Option value={val} key={`${_name}-option-${idx.toString()}`}>
                    {t(`role.${val.split('.')?.[1] || ''}`)}
                  </Select.Option>
                ))
              }
            </Select>
          )}
        />
      )),
    },
  ]), [t]);

  /* Effects */
  useEffect(() => {
    if (idParam.current.isValid && detailData) {
      method.reset({
        displayName: detailData.role.displayName,
        permissions: convertPermissionDataForm(detailData.assignedPermissions),
      });
    }
  }, [detailData, method]);

  return (
    <>
      <HeaderPage
        fixed
        title={t('sidebar.rolesDetail')}
        rightHeader={(
          <Space>
            <Button
              type="primary"
              onClick={() => method.handleSubmit(handleSubmit)()}
            >
              <SaveOutlined />
              {' '}
              {t('system.save')}
            </Button>
          </Space>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <FormProvider<RoleDetailForm> {...method}>
          <form noValidate>
            <div className="p-roleDetail_input">
              <Typography.Text strong>
                {t('system.name')}
                {' '}
              </Typography.Text>
              <Controller
                name="displayName"
                defaultValue=""
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <Input
                    className="u-mt-8"
                    name="title"
                    value={value}
                    onChange={(e) => {
                      onChange(e);
                    }}
                    error={error?.message}
                    size="large"
                  />
                )}
              />
            </div>
            <Spin tip="Đang tải..." spinning={permissionLoading || createLoading || detailLoading || updateLoading}>
              <Table
                className="u-mt-24"
                columns={columns}
                dataSource={tableData}
                pagination={false}
                rowClassName="role-table-cell"
              />
            </Spin>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default RoleDetail;
