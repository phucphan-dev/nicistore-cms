import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Space,
  Typography,
  Card,
  Collapse,
  Divider,
  Button,
} from 'antd';
import React, { forwardRef, useImperativeHandle } from 'react';
import {
  useForm,
  FormProvider,
  useFieldArray,
} from 'react-hook-form';

import RepeaterSection from './RepeaterSection';

import { blockSectionSchema } from 'common/utils/schemas';

type BlockSectionData = {
  name: string;
  description: string;
  content: string;
  ogImage: string,
  link: string;
  url: string;
  target: OptionType;
};

export const defaultBlockSection = {
  name: '',
  description: '',
  content: '',
  ogImage: '',
  link: '',
  url: '',
  target: undefined,
};

export type BlockSectionTypes = {
  sectionTitle: string;
  blockSection: BlockSectionData[];
};

export interface BlockSectionActionRef {
  handleForm: () => BlockSectionTypes | undefined;
}

interface BlockSectionProps {
  linkTargetOptions: OptionType[];
}

const BlockSection = forwardRef<BlockSectionActionRef, BlockSectionProps>(({
  linkTargetOptions,
}, ref) => {
  const method = useForm<BlockSectionTypes>({
    resolver: yupResolver(blockSectionSchema),
    mode: 'onChange',
    defaultValues: {
      sectionTitle: '',
      blockSection: [{
        description: '',
        content: '',
        ogImage: '',
        link: '',
        url: '',
        target: undefined,
      }],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: method.control,
    name: 'blockSection',
  });

  useImperativeHandle(ref, () => ({
    handleForm: () => {
      if (method.formState.isValid) {
        return method.getValues();
      }
      method.trigger();
      return undefined;
    },
  }));
  return (
    <FormProvider<BlockSectionTypes> {...method}>
      <form noValidate>
        <div className="site-card-border-less-wrapper">
          <Card
            type="inner"
            title={(
              <Typography.Title
                level={5}
              >
                Blocks
              </Typography.Title>
            )}
          >
            <div className="p-editPageTemplate_block">
              {fields && fields.length > 0 && fields.map((field, index) => (
                <Collapse key={field.id} className="p-editPageTemplate_blockItem">
                  <Collapse.Panel
                    header={(
                      <div className="p-editPageTemplate_blockHeader">
                        <Typography.Title level={5} style={{ marginBottom: 0 }}>
                          Block Item
                        </Typography.Title>
                        {fields.length > 1 && (
                          <Button
                            type="text"
                            onClick={() => remove(index)}
                            icon={(<DeleteOutlined />)}
                          />
                        )}
                      </div>
                    )}
                    key={`${index + 1}`}
                  >
                    <RepeaterSection
                      // isHiddenRemoveBtn={fields.length <= 1}
                      linkTargetOptions={linkTargetOptions}
                      id={index}
                    />
                  </Collapse.Panel>
                </Collapse>
              ))}
            </div>
            <Divider />
            <Space
              direction="horizontal"
              size={12}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Button
                size="large"
                type="primary"
                icon={(<PlusOutlined />)}
                onClick={() => {
                  append(defaultBlockSection);
                }}
              >
                Thêm mới
              </Button>
            </Space>
            {/* </Space> */}
          </Card>
        </div>
      </form>
    </FormProvider>
  );
});

export default BlockSection;
