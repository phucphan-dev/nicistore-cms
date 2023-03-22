import React from 'react';
import {
  FieldValues,
  FormProvider, SubmitHandler, useForm, UseFormReturn,
} from 'react-hook-form';

interface FormInterface<T extends FieldValues> {
  method: UseFormReturn<T>;
  submitForm: SubmitHandler<T>;
  children?: React.ReactNode;
}
export type UseFormProps = ReturnType<typeof useForm>;

// eslint-disable-next-line react/prefer-stateless-function
class Form<T extends FieldValues> extends React.Component<FormInterface<T>> {
  render() {
    const {
      method, submitForm, children,
    } = this.props;

    return (
      <div className="o-form">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <FormProvider {...method}>
          <form
            onSubmit={method.handleSubmit(submitForm)}
            noValidate
          >
            {children}
          </form>
        </FormProvider>
      </div>
    );
  }
}

export default Form;
