import { yupResolver } from '@hookform/resolvers/yup';
import React, { useRef, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import Input from 'common/components/Input';
import useClickOutside from 'common/hooks/useClickOutside';

interface SearchForm {
  search: string;
}

interface SearchInputProps {
  handleSearch?: (key: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ handleSearch }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const refOption = useRef<HTMLDivElement>(null);

  const validationSchema = yup.object({
    search: yup.string().required(),
  });

  const method = useForm<SearchForm>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
    defaultValues: {
      search: '',
    },
  });

  useClickOutside(refOption, () => {
    if (!method.getValues('search')) {
      setOpen(false);
      if (handleSearch) {
        handleSearch('');
      }
    }
  });

  const handleKeyUpSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && handleSearch) {
      handleSearch(method.getValues('search'));
      if (!method.getValues('search')) {
        setOpen(false);
      }
    }
  };

  return (
    <div ref={refOption} className="t-pageTable_filterTableColumn">
      <FormProvider {...method}>
        <Controller
          name="search"
          render={({
            field: { onChange, value, ref },
          }) => (
            <Input
              ref={ref}
              onChange={onChange}
              value={value}
              onKeyDown={handleKeyUpSearch}
              isSearch
              placeholder={t('system.search')}
              show={open}
              handleOpen={() => setOpen(true)}
              handleClear={() => {
                onChange('');
                setOpen(false);
                if (handleSearch) {
                  handleSearch('');
                }
              }}
              onMouseEnter={() => !open && setOpen(true)}
            />
          )}
        />
      </FormProvider>
    </div>
  );
};

export default SearchInput;
