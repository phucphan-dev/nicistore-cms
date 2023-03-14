import {
  Collapse,
  Row,
  Typography,
} from 'antd';
import React, {
  forwardRef, useEffect, useImperativeHandle, useMemo, useRef
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import RenderElement from './RenderElement';

import mapModifiers from 'common/utils/functions';

type RenderBlockProps = {
  label?: string;
  section: ElementBlockType;
  defaultValues?: any;
};

type RenderBlockRef = {
  handleForm: () => { [x: string]: any; } | undefined;
  isFormDirty: () => boolean;
};

export const RenderBlock = forwardRef<
  RenderBlockRef, RenderBlockProps
>(({ defaultValues, section }, ref) => {
  const method = useForm();
  const { isDirty } = method.formState;

  const elements = useRef(Object.entries(section));

  useImperativeHandle(ref, () => ({
    handleForm: () => ({ elements: method.getValues() }),
    isFormDirty: () => isDirty,
  }));

  useEffect(() => {
    method.reset(defaultValues);
  }, [defaultValues, method]);

  return (
    <FormProvider {...method}>
      <form>
        <Row gutter={16}>
          {elements.current.map((ele) => (
            <RenderElement
              key={`render-element-${ele[0]}`}
              control={method.control}
              elementName={ele[0]}
              type={ele[1].type}
              label={ele[1].label}
              element={ele[1].elements}
              handleChangeTitleAlt={(title, alt) => {
                method.setValue(`${ele[0]}[data][title]`, title);
                method.setValue(`${ele[0]}[data][alt]`, alt);
              }}
            />
          ))}
        </Row>
      </form>
    </FormProvider>
  );
});

export type RenderBlockRefs = {
  sectionName: string;
  ref: RenderBlockRef | null;
};

type RenderTemplateProps = {
  defaultValues?: any;
  data?: BlocksType;
  loading?: boolean;
  noLabel?: boolean;
  extraCollapseHeader?: React.ReactNode;
};

export type RenderTemplateRef = {
  handleSubmit: () => any | undefined;
  isFormDirty: () => boolean;
};

const RenderTemplate = forwardRef<
  RenderTemplateRef, RenderTemplateProps
>(({
  defaultValues, data, loading, extraCollapseHeader, noLabel
}, ref) => {
  const { t } = useTranslation();
  const itemsRef = useRef<Array<RenderBlockRefs>>(
    data ? Object.keys(data).map((item) => ({ sectionName: item, ref: null })) : []
  );

  const sections = useMemo(() => {
    if (data) {
      return Object.entries(data);
    }
    return [];
  }, [data]);

  const handleFormSubmit = () => {
    let obj = {};
    itemsRef.current.forEach((ele) => {
      obj = { ...obj, [ele.sectionName]: ele.ref?.handleForm() };
    });
    return obj;
  };

  const checkIsDirty = () => {
    const filter = itemsRef.current.filter((item) => item.ref?.isFormDirty());
    return filter.length > 0;
  };

  useImperativeHandle(ref, () => ({
    handleSubmit: () => handleFormSubmit(),
    isFormDirty: () => checkIsDirty(),
  }));

  return (
    <div className={mapModifiers('t-repeatersection', loading && 'loading')} id="render-template">
      {sections.length > 0 && !noLabel && (
        <div className="t-repeatersection_label">
          Blocks (
          {sections.length}
          )
        </div>
      )}
      {loading
        ? null
        : data && (
          <Collapse className="u-mt-32 u-mb-24 t-repeatersection_collapse" defaultActiveKey={[0]}>
            {sections.map((ele, i) => (
              <Collapse.Panel
                // eslint-disable-next-line react/no-array-index-key
                key={i.toString()}
                forceRender
                header={(
                  <Typography.Title
                    level={5}
                  >
                    {t(ele[1].label)}
                  </Typography.Title>
                )}
                extra={extraCollapseHeader}
              >
                <RenderBlock
                  key={`render-block-${ele[0]}`}
                  ref={(el) => {
                    if (el) {
                      itemsRef.current[i] = {
                        sectionName: ele[0],
                        ref: el
                      };
                    }
                  }}
                  label={t(ele[1].label)}
                  section={ele[1].elements}
                  defaultValues={defaultValues ? defaultValues[`${ele[0]}`] : undefined}
                />
              </Collapse.Panel>
            ))}
          </Collapse>
        )}
    </div>
  );
});

export default RenderTemplate;
