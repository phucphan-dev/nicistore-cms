import { PlusOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button, message, Modal, notification, Typography
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from 'react-query';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import Input from 'common/components/Input';
import PageTable from 'common/components/PageTable';
import useNavigateParams from 'common/hooks/useNavigateParams';
import { deleteMenuService, getMenusService, postMenusService } from 'common/services/menus';
import { MenuItemTypes } from 'common/services/menus/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { menuCreateSchema } from 'common/utils/schemas';

type MenusForm = {
  title: string;
  code: string;
};

type MenusItem = {
  id: number;
  title: string;
  code: string;
  locale: {
    [language: string]: {
      id: number;
      title: string;
    }
  }
};

const MenuManagement: React.FC<ActiveRoles> = ({ roleDelete, roleCreate, roleUpdate }) => {
  /* Hooks */
  const { t } = useTranslation();
  const navigateParams = useNavigateParams();
  const queryClient = useQueryClient();

  /* Selectors */
  const { defaultPageSize, defaultWebsiteLanguage } = useAppSelector((state) => state.system);

  /* States */
  const [menusData, setMenuData] = useState<MenusItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentView, setCurrentView] = useState(defaultPageSize);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [keyword, setKeyword] = useState('');

  /* Variables */
  const method = useForm<MenusForm>({
    resolver: yupResolver(menuCreateSchema),
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      code: '',
    },
  });
  const columns: ColumnsType<MenusItem> = [
    {
      title: 'ID',
      key: 'id',
      width: 55,
      align: 'center',
      fixed: 'left',
      sorter: {
        compare: (a: MenusItem, b: MenusItem) => a.id - b.id,
      },
      sortDirections: ['descend', 'ascend'],
      render: (_name: string, data: MenusItem) => (
        <Typography.Text>
          {data.id}
        </Typography.Text>
      ),
    },
    // --- Tiêu đề
    {
      title: t('system.title'),
      dataIndex: 'title',
      key: 'title',
      sorter: {
        compare: (a: MenusItem, b: MenusItem) => a.title.localeCompare(b.title),
      },
      sortDirections: ['descend', 'ascend'],
      render: (name: string, data: MenusItem) => (
        <Typography.Text
          onClick={() => navigateParams(`${ROUTE_PATHS.MENU_DETAIL}`, `code=${data.code}&locale=${defaultWebsiteLanguage}`)}
          style={{ color: '#4a4a4a', cursor: 'pointer' }}
        >
          {defaultWebsiteLanguage && data.locale[defaultWebsiteLanguage]
            ? data.locale[defaultWebsiteLanguage].title
            : data.locale[Object.keys(data.locale)[0]].title}
        </Typography.Text>
      ),
    },
    // --- Mẫu
    {
      title: t('system.code'),
      dataIndex: 'code',
      key: 'code',
    },
  ];

  /* Queries */
  const { data: menuDataRes, isLoading } = useQuery(
    ['getMenuList', keyword, currentPage, currentView],
    () => getMenusService({ keyword, page: currentPage, limit: currentView }),
  );

  /* Functions */
  const convertMenuData = (data: MenuItemTypes[]) => {
    if (data.length > 0) {
      const tempArr: MenusItem[] = data.map((item) => ({
        id: item.id,
        title: item.title,
        code: item.code,
        locale: {
          [item.locale]: {
            id: item.id,
            title: item.title
          }
        },
      }));
      const sumWithInitial = tempArr.reduce(
        (
          unique: MenusItem[],
          current: MenusItem,
        ) => {
          const temp = unique.slice();
          const idx = temp.findIndex((menu) => menu.code === current.code);
          if (idx < 0) {
            return [...temp, current];
          }
          temp[idx].locale = { ...temp[idx].locale, ...current.locale };
          return temp;
        },
        []
      );
      return sumWithInitial;
    }
    return [];
  };

  const onDelete = async (data: MenusItem[], lang?: string) => {
    setLoading(true);

    const params = { ids: [0] };
    if (lang === 'all' || lang === 'allRow') {
      params.ids = data.reduce((
        previous,
        current
      ) => [...previous, ...Object.values(current.locale).map((item) => item.id)], [] as number[]);
    } else {
      params.ids = [data[0].locale[lang as string].id];
    }
    try {
      await deleteMenuService(params);
      queryClient.invalidateQueries(['getMenuList']);
      message.success(t('message.deleteSuccess'));
    } catch (error) {
      message.error(t('message.deleteError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSetCurrentPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleSetCurrentView = (view: number) => {
    setCurrentView(view);
  };

  const handleCreateMenus = async (data: MenusForm) => {
    try {
      setLoading(true);
      await postMenusService({
        ...data,
        locale: 'vi', // apply later
      });
      notification.success({
        message: t('message.createMenuSuccess'),
      });
      queryClient.invalidateQueries(['getMenuList']);
      setIsOpen(false);
      method.reset();
    } catch (error) {
      notification.error({
        message: t('message.createMenuError'),
      });
    } finally {
      setLoading(false);
    }
  };

  /* Effects */
  useEffect(() => {
    if (menuDataRes) {
      setMenuData(convertMenuData(menuDataRes.data));
    }
  }, [menuDataRes]);

  /* Render */
  return (
    <>
      <HeaderPage
        fixed
        title={t('sidebar.menu')}
        rightHeader={(
          <Button type="primary" disabled={!roleCreate} onClick={() => setIsOpen(true)}>
            <PlusOutlined />
            {t('system.create')}
          </Button>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <PageTable
          handleDelete={(data, lang) => {
            onDelete(data, lang);
          }}
          isLoading={loading || isLoading}
          handleEditPage={(_, code, locale) => {
            navigateParams(`${ROUTE_PATHS.MENU_DETAIL}`, `code=${code}&locale=${locale}`);
          }}
          handleCreatePage={(_, code, locale) => {
            navigateParams(`${ROUTE_PATHS.MENU_DETAIL}`, `code=${code}&locale=${locale}`);
          }}
          handleSearch={setKeyword}
          tableProps={{
            initShowColumns: ['id', 'title', 'code'],
            columns,
            pageData: menusData,
            currentPage,
            pageSize: currentView,
            handleSetCurrentPage,
            handleSetCurrentView,
            isHidePagination: true,
          }}
          roles={{
            roleCreate, roleDelete, roleUpdate
          }}
        />
      </div>
      <Modal
        title={<Typography.Title level={3}>{t('menu.create')}</Typography.Title>}
        visible={isOpen}
        centered
        onCancel={() => {
          setIsOpen(false);
          method.reset();
        }}
        onOk={() => method.handleSubmit(handleCreateMenus)()}
        confirmLoading={loading}
      >
        <FormProvider<MenusForm> {...method}>
          <form noValidate>
            <div className="t-menuManagement_input">
              <Controller
                name="title"
                render={({
                  field: { onChange, value, ref },
                  fieldState: { error },
                }) => (
                  <>
                    <Typography.Text strong>
                      {t('system.title')}
                      {' '}
                    </Typography.Text>
                    <Typography.Text strong type="danger">
                      *
                    </Typography.Text>
                    <Input
                      ref={ref}
                      onChange={onChange}
                      value={value}
                      placeholder={t('system.title')}
                      error={error?.message}
                    />
                  </>
                )}
              />
            </div>
            <div className="t-menuManagement_input">
              <Controller
                name="code"
                render={({
                  field: { onChange, value, ref },
                  fieldState: { error },
                }) => (
                  <>
                    <Typography.Text strong>
                      {t('system.code')}
                      {' '}
                    </Typography.Text>
                    <Typography.Text strong type="danger">
                      *
                    </Typography.Text>
                    <Input
                      ref={ref}
                      onChange={onChange}
                      value={value}
                      placeholder={t('system.code')}
                      error={error?.message}
                      handleSubmit={method.handleSubmit(handleCreateMenus)}
                    />
                  </>
                )}
              />
            </div>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};

export default MenuManagement;
