import { Card, Space, Typography } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, { forwardRef, useImperativeHandle } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export type CommentFormType = {
  comment: string;
};

export interface CommentSectionRef {
  handleCommentForm: () => CommentFormType;
  clearCommentForm: (fieldName?: keyof CommentFormType) => void;
}

export interface CommentSectionProps { }

const CommentForm = forwardRef<CommentSectionRef, CommentSectionProps>((_, ref) => {
  const { t } = useTranslation();

  const method = useForm<CommentFormType>({
    mode: 'onSubmit',
    defaultValues: {
      comment: '',
    }
  });

  /* Imperative Handler */
  useImperativeHandle(ref, () => ({
    handleCommentForm: () => method.getValues(),
    clearCommentForm: (fieldName?: keyof CommentFormType) => {
      if (fieldName) {
        method.resetField(fieldName);
      } else {
        method.reset();
      }
    }
  }));

  return (
    <FormProvider {...method}>
      <form noValidate>
        <Card>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <div className="seoSection_comment">
              <Typography.Text strong>
                {t('system.comments')}
              </Typography.Text>
              <Controller
                name="comment"
                render={({ field }) => (
                  <TextArea
                    {...field}
                    className="u-mt-8"
                    value={field.value}
                    onChange={field.onChange}
                    size="large"
                    rows={2}
                    style={{ minHeight: 50 }}
                  />
                )}
              />
            </div>
          </Space>
        </Card>
      </form>
    </FormProvider>
  );
});

export default CommentForm;
