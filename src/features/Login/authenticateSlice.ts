import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getProfileService } from 'common/services/authenticate';
import { UserInfoTypes } from 'common/services/authenticate/types';

interface AuthState {
  profileData?: UserInfoTypes;
  roles: string[];
}

const initialState: AuthState = {
  profileData: undefined,
  roles: [],
};

export const getProfileAction = createAsyncThunk<
  UserInfoTypes,
  void,
  { rejectValue: any }
>('profileReducer/getProfileAction', async (_, { rejectWithValue }) => {
  try {
    const res = await getProfileService();
    return res;
  } catch (error) {
    return rejectWithValue(error as any);
  }
});

export const authSlice = createSlice({
  name: 'authReducer',
  initialState,
  reducers: {
    setRoles($state, action: PayloadAction<string[]>) {
      $state.roles = action.payload;
    },
    logout($state) {
      $state.profileData = undefined;
      $state.roles = [];
    },
    updateHasTotp($state, action: PayloadAction<boolean>) {
      if ($state.profileData) {
        $state.profileData = { ...$state.profileData, hasTotp: action.payload };
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(getProfileAction.fulfilled, ($state, action) => {
      $state.profileData = action.payload;
    });
  }
});

export const { setRoles, logout, updateHasTotp } = authSlice.actions;

export default authSlice.reducer;
