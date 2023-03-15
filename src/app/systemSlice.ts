/* eslint-disable import/no-cycle */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getAdvancedFilterService } from 'common/services/noPermission';
import { AdvancedFilterTypes } from 'common/services/noPermission/types';
import { getSystemInitialService } from 'common/services/systems';
import { InitialSystemData } from 'common/services/systems/types';

interface SystemState {
  statusError?: ErrorStatusCode;
  showModalError: boolean;
  defaultWebsiteLanguage?: string;
  defaultPageSize?: number;
  initialData?: InitialSystemData;
  languageOptions: OptionType[];
  advancedFilter?: AdvancedFilterTypes;
}

const initialState: SystemState = {
  showModalError: false,
  defaultWebsiteLanguage: 'vi',
  languageOptions: [],
  initialData: {
    websiteLocales: {
      vi: {
        isDefault: true,
        active: true,
        text: 'Vietnamese'
      }
    },
    media: {},
    paginationOptions: {
      numbersOfRows: [{
        numbers: 10,
        isDefault: true
      }]
    },
    importTemplates: {
      redirect: ''
    }
  }
};

export const getSystemInitialAction = createAsyncThunk<
  InitialSystemData,
  void,
  { rejectValue: any }
>('systemReducer/getSystemInitialAction', async (_, { rejectWithValue }) => {
  try {
    const res = await getSystemInitialService();
    return res;
  } catch (error) {
    return rejectWithValue(error as any);
  }
});

export const getAdvancedFilterAction = createAsyncThunk<
  AdvancedFilterTypes,
  void,
  { rejectValue: any }
>('systemReducer/getAdvancedFilterAction', async (_, { rejectWithValue }) => {
  try {
    const res = await getAdvancedFilterService();
    return res;
  } catch (error) {
    return rejectWithValue(error as any);
  }
});

export const systemSlice = createSlice({
  name: 'systemReducer',
  initialState,
  reducers: {
    setGlobalError($state, action: PayloadAction<ErrorStatusCode>) {
      if (!$state.showModalError) {
        $state.statusError = action.payload;
        $state.showModalError = true;
      }
    },
    hideModalError($state) {
      $state.showModalError = false;
    },
  },
  extraReducers(builder) {
    builder.addCase(getSystemInitialAction.fulfilled, ($state, action) => {
      $state.initialData = action.payload;
      $state.defaultPageSize = action.payload.paginationOptions.numbersOfRows.find(
        (item) => item.isDefault
      )?.numbers;
      $state.defaultWebsiteLanguage = Object.keys(
        action.payload.websiteLocales
      ).find((value) => action.payload.websiteLocales[value].isDefault);
      $state.languageOptions = Object.keys(action.payload.websiteLocales).map((value) => ({
        value,
        label: action.payload.websiteLocales[value].text
      }));
    });
    builder.addCase(getAdvancedFilterAction.fulfilled, ($state, action) => {
      $state.advancedFilter = action.payload;
    });
  }
});

export const {
  setGlobalError, hideModalError,
} = systemSlice.actions;

export default systemSlice.reducer;
