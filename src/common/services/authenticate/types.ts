export type LoginParamsTypes = {
  email: string;
  password: string;
  ggRecaptchaToken: string;
  otpCode?: string;
};

export type UserInfoTypes = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  hasTotp: boolean;
  avatar: string;
  bgAvatar: string;
};
export type LoginResponseTypes = {
  accessToken: string;
  refreshToken: string;
};

export type UpdateProfileParams = {
  password: string;
  name?: string;
  email?: string;
  newPassword?: string;
};

export type GenerateTOtpResponseTypes = {
  secret: string,
  link: string
};

export type ActiveTOtpParams = {
  currentPassword: string;
  otpCode: string;
};

export type AvatarDataParams = {
  fileAvatar: File,
};
