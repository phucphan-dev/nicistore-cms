// eslint-disable-next-line import/no-cycle
import axiosInstance from '../common/instance';
import { getRefreshToken } from '../common/storage';

import {
  ActiveTOtpParams,
  GenerateTOtpResponseTypes,
  LoginParamsTypes,
  LoginResponseTypes,
  UpdateProfileParams,
  UserInfoTypes,
  AvatarDataParams,
} from './types';

const loginService = async (params: LoginParamsTypes): Promise<LoginResponseTypes> => {
  const res = await axiosInstance.post('auth/login', params);
  return res.data.data;
};

export const refreshTokenService = async (): Promise<LoginResponseTypes> => {
  const res = await axiosInstance.post('auth/refresh-token', { refreshToken: getRefreshToken() });
  return res.data.data;
};

export const getProfileService = async (): Promise<UserInfoTypes> => {
  const res = await axiosInstance.get('auth/profile');
  return res.data.data;
};

export const updateProfileService = async (params: UpdateProfileParams): Promise<void> => {
  await axiosInstance.post('auth/profile', params);
};

export const generateTOtpService = async ():
  Promise<GenerateTOtpResponseTypes> => {
  const response = await axiosInstance.post('auth/generate-totp-secret');
  return response.data.data;
};

export const activeTOtpService = async (params: ActiveTOtpParams):
  Promise<void> => {
  await axiosInstance.post('auth/active-totp-secret', params);
};

export const inActiveTOtpService = async (params: ActiveTOtpParams): Promise<void> => {
  await axiosInstance.post('auth/inactive-totp-secret', params);
};

export const logoutService = async (): Promise<void> => {
  await axiosInstance.post('auth/logout');
};

export const updateUserAvatarService = async (
  params: AvatarDataParams,
): Promise<void> => {
  const formData = new FormData();
  formData.append('fileAvatar', params.fileAvatar);
  await axiosInstance.post('auth/update-avatars', formData);
};

export default loginService;
