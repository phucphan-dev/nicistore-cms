import { EditOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Card,
  List,
  message,
  Modal,
  Spin,
  Typography,
  Image
} from 'antd';
import React, { useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient, useInfiniteQuery, useMutation } from 'react-query';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import Input from 'common/components/Input';
import SelectFile from 'common/components/SelectFile';
import useScrollInfinite from 'common/hooks/useScrollInfinite';
import { getAllTemplateManageService, updateTemplateManageService } from 'common/services/pages';
import { UpdateTemplateManageType } from 'common/services/pages/types';
import { templateEditSchema } from 'common/utils/schemas';

type TemplateFormData = {
  id: number;
  title: string;
  image?: string;
};

type TemplatesRenderDataType = {
  id: number;
  code: string;
  name: string;
  image: string;
};

const PageTemplate: React.FC<ActiveRoles> = ({ roleUpdate }) => {
  /* Hooks */
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  /* React-hook-form */
  const method = useForm<TemplateFormData>({
    resolver: yupResolver(templateEditSchema),
    mode: 'onSubmit',
    defaultValues: {
      id: 0,
      title: '',
      image: '',
    },
  });

  const searchMethod = useForm<{ search: string }>({
    mode: 'onSubmit',
    defaultValues: {
      search: '',
    },
  });

  /* Selectors */
  const { defaultPageSize } = useAppSelector((state) => state.system);

  /* States */
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');

  /* React-query */
  const {
    data: pageDataRes,
    isFetching: pageDataLoading,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery(
    ['pageTemplates', keyword, defaultPageSize],
    ({ pageParam = 1 }) => getAllTemplateManageService({
      keyword,
      page: pageParam,
      limit: defaultPageSize,
    }),
    {
      getNextPageParam: (lastPage) => (
        lastPage.meta.page < lastPage.meta.totalPages
          ? lastPage.meta.page + 1 : undefined),
    },
  );

  const { mutate: updateProfileMutate, isLoading: updateProfileLoading } = useMutation(
    ['pageTemplates-update'],
    async (params: UpdateTemplateManageType) => updateTemplateManageService(params),
    {
      onSuccess: () => {
        setIsOpen(false);
        message.success(t('message.updateSuccess'));
        queryClient.invalidateQueries(['pageTemplates', keyword, defaultPageSize]);
      },
      onError: () => {
        message.error(t('message.updateError'));
      },
    }
  );

  /* Datas */
  const dataList = useMemo(() => {
    if (pageDataRes) {
      let list: TemplatesRenderDataType[] = [];
      pageDataRes.pages.forEach((ele) => {
        const templateDataList = ele.data?.map((item) => ({
          id: item.id,
          code: item.code,
          name: item.name,
          image: item.image,
        })) || [];
        list = [...list, ...templateDataList];
      });
      return list;
    }
    return [];
  }, [pageDataRes]);

  /* Functions */
  const handleSearch = async (data: { search: string }) => {
    setKeyword(data.search);
  };

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const updateTemplatePageAction = async (data: TemplateFormData) => {
    updateProfileMutate({ id: data.id, name: data.title, image: data.image });
  };

  /* Components */
  const { setNode } = useScrollInfinite(handleLoadMore);

  /* Render */
  return (
    <>
      <HeaderPage
        fixed
        title={t('sidebar.pageTemplate')}
      />
      <div className="t-mainlayout_wrapper">
        <div className="p-pageTemplates_search">
          <FormProvider
            {...searchMethod}
          >
            <Controller
              name="search"
              render={({
                field: { onChange, value, ref },
              }) => (
                <Input
                  ref={ref}
                  onChange={onChange}
                  value={value}
                  placeholder={t('system.search')}
                  handleClear={() => {
                    onChange('');
                  }}
                  handleSubmit={searchMethod.handleSubmit(handleSearch)}
                />
              )}
            />
          </FormProvider>
        </div>
        <div className="p-pageTemplates_list u-mt-16">
          <List
            grid={{
              gutter: 16,
              xs: 2,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 4,
              xxl: 6,
            }}
            dataSource={dataList}
            renderItem={(ele) => (
              <List.Item>
                <Card
                  bordered={false}
                  className="p-pageTemplates_card"
                  cover={(
                    <Image.PreviewGroup>
                      <div className="p-pageTemplates_card_img">
                        <Image alt={ele.code} src={ele.image} />
                      </div>
                    </Image.PreviewGroup>
                  )}
                >
                  <Card.Meta
                    className="p-pageTemplates_card_meta"
                    title={ele.name}
                    description={ele.code}
                    avatar={(
                      <Button
                        type="default"
                        shape="default"
                        disabled={!roleUpdate}
                        icon={<EditOutlined />}
                        onClick={() => {
                          method.reset({
                            id: ele.id,
                            title: ele.name,
                            image: ele.image || '',
                          });
                          setIsOpen(true);
                        }}
                      />
                    )}
                  />
                </Card>
              </List.Item>
            )}
          />
        </div>
        <div ref={(suggest) => setNode(suggest)} />
        {(pageDataLoading) && <Spin className="center-absolute" size="large" spinning />}
      </div>
      <Modal
        title={<Typography.Title level={3}>{t('pageTemplate.edit')}</Typography.Title>}
        visible={isOpen}
        centered
        onCancel={() => {
          setIsOpen(false);
          method.reset();
        }}
        onOk={method.handleSubmit(updateTemplatePageAction)}
        confirmLoading={updateProfileLoading}
      >
        <FormProvider<TemplateFormData> {...method}>
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
                      {t('system.name')}
                      {' '}
                    </Typography.Text>
                    <Typography.Text strong type="danger">
                      *
                    </Typography.Text>
                    <Input
                      ref={ref}
                      onChange={onChange}
                      value={value}
                      placeholder={t('system.name')}
                      error={error?.message}
                    />
                  </>
                )}
              />
            </div>
            <div className="t-menuManagement_input">
              <Controller
                name="image"
                render={({
                  field: { value, onChange },
                }) => (
                  <SelectFile
                    title={t('system.image')}
                    value={value}
                    name="image"
                    handleSelect={(url) => onChange(url)}
                    handleDelete={() => onChange('')}
                  />
                )}
              />
            </div>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};

export default PageTemplate;
