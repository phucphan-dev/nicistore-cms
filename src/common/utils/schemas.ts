/* eslint-disable prefer-regex-literals */
import * as yup from 'yup';

// export const phoneRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Địa chỉ email không hợp lệ')
    .max(255, 'Nhập tối đa 255 ký tự')
    .required('Địa chỉ email là bắt buộc'),
  password: yup.string().required('Mật khẩu là bắt buộc'),
  otpCode: yup.string().matches(new RegExp('^[0-9]+$'), { message: 'OTP phải là số' }).length(6, 'OTP phải có 6 chữ số')
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Địa chỉ email không hợp lệ')
    .max(255, 'Nhập tối đa 255 ký tự')
    .required('Địa chỉ email là bắt buộc'),
});

export const detailPageSchema = yup.object().shape({
  title: yup.string().required('Trường này là bắt buộc'),
  slug: yup.string().required('Trường này là bắt buộc'),
  seoTitle: yup.string(),
});

export const menuGenerationForm = yup.object().shape({
  title: yup.number().required('Trường này là bắt buộc'),
  target: yup.number().required('Trường này là bắt buộc'),
});

export const menuGenerationForm2 = yup.object().shape({
  title: yup.string().required('Trường này là bắt buộc'),
  target: yup.number().required('Trường này là bắt buộc'),
});

export const detailPageHeaderSchema = yup.object().shape({
  sample: yup.string().required('Hãy chọn một mẫu'),
  parent: yup.number(),
  state: yup.number(),
  isHome: yup.boolean(),
});

const blockSectionObj = {
  name: yup.string(),
  description: yup.string(),
  content: yup.string(),
  ogImage: yup.object().nullable(),
  link: yup.string(),
  url: yup.string(),
  target: yup.object().nullable(),
};

const mediaSocialObj = {
  ogTitle: yup.string(),
  ogDescription: yup.string(),
  ogType: yup.number().required('Chọn 1 mạng xã hội'),
  ogImage: yup.object().nullable(),
};

export const seoSectionSchema = yup.object().shape({
  seoTitle: yup.string(),
  seoIntro: yup.string(),
  seoKeyword: yup.string(),
  metaViewPort: yup.string(),
  metaRobot: yup.string(),
  canonicalURL: yup.string(),
  structuredData: yup.string(),
  ogImage: yup.object().nullable(),
  mediaSocial: yup
    .array()
    .of(yup.object().shape(mediaSocialObj)),
});

export const openGraphSectionSchema = yup.object().shape({
  ogTitle: yup.string(),
  ogType: yup.string(),
  ogImage: yup.object().nullable(),
});

export const blockSectionSchema = yup.object().shape({
  sectionTitle: yup.string(),
  blockSection: yup
    .array()
    .of(yup.object().shape(blockSectionObj)),
});

export const commentSectionSchema = yup.object().shape({
  comment: yup.string(),
});

export const menuCreateSchema = yup.object().shape({
  title: yup.string().required('Điền tiêu đề menu'),
  code: yup.string().required('Điền mã code cho menu'),
});

export const templateEditSchema = yup.object().shape({
  title: yup.string().required('Điền tiêu đề trang mẫu'),
});

export const bannerCreateSchema = yup.object().shape({
  name: yup.string().required('Điền tên banner'),
  items: yup.array().of(
    yup.object().shape({
      type: yup.string(),
      data: yup.object().when(
        'type',
        {
          is: 'video',
          then: (schema) => schema.shape({
            videoType: yup.string().required('Vui lòng chọn loại'),
            videoUrl: yup.string().required('Thông tin bắt buộc'),
            videoThumbnail: yup.string().required('Thông tin bắt buộc')
          })
        }
      )
    })
  )
});

export const pageDetailMainData = yup.object().shape({
  title: yup.string().required('Điền tiêu đề trang'),
  slug: yup.string().required('Điền đường dẫn trang'),
});

export const redirectFormSchema = yup.object().shape({
  from: yup.string().required('Thông tin bắt buộc'),
  to: yup.string().required('Thông tin bắt buộc'),
});

export const roleFormSchema = yup.object().shape({
  displayName: yup
    .string()
    .required('Thông tin bắt buộc'),
});

export const userFormSchema = yup.object().shape({
  name: yup.string().required('Thông tin bắt buộc'),
  email: yup
    .string()
    .email('Địa chỉ email không hợp lệ')
    .max(255, 'Nhập tối đa 255 ký tự')
    .required('Địa chỉ email là bắt buộc'),
  password: yup.string().notRequired().test('password', 'Mật khẩu ít nhất 6 kí tự', (value) => {
    if (value) {
      const schema = yup.string().min(6);
      return schema.isValidSync(value);
    }
    return true;
  }),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
  roles: yup.array().min(1, 'Chọn ít nhất 1 quyền')
});

export const updateNewsByIdSchema = yup.object().shape({
  displayOrder: yup.number().required('Nhập thứ tự hiển thị'),
  title: yup.string().required('Nhập tiêu đề'),
  slug: yup.string().required('Nhập đường dẫn'),
  description: yup.string().required('Nhập mô tả'),
  content: yup.string().required('Nhập nội dung'),
  thumbnail: yup.string().required('Cập nhật hình ảnh'),
});

export const updateNewsCategoriesByIdSchema = yup.object().shape({
  displayOrder: yup.number().required('Nhập thứ tự hiển thị'),
  name: yup.string().required('Nhập tiêu đề'),
  slug: yup.string().required('Nhập đường dẫn'),
  description: yup.string().required('Nhập mô tả'),
});

export const updateCategoryFaqByIdSchema = yup.object().shape({
  displayOrder: yup.number().required('Nhập thứ tự hiển thị'),
  name: yup.string().required('Nhập tiêu đề'),
  slug: yup.string().required('Nhập đường dẫn'),
  description: yup.string().required('Nhập mô tả'),
});

export const updateFaqByIdSchema = yup.object().shape({
  answer: yup.string().required('Nhập câu hỏi'),
  question: yup.string().required('Nhập câu trả lời'),
  faqCategoryId: yup.array().required('Chọn danh mục'),
});

export const updateContactProblemSchema = yup.object().shape({
  name: yup.string().required('Nhập tên'),
});

export const updateProfileSchema = yup.object().shape({
  name: yup.string().required('Trường này là bắt buộc'),
  email: yup.string()
    .email('Địa chỉ email không hợp lệ')
    .max(255, 'Nhập tối đa 255 ký tự')
    .required('Trường này là bắt buộc'),
  password: yup.string().required('Trường này là bắt buộc'),
});

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required('Trường này là bắt buộc'),
  newPassword: yup.string().min(6).required('Trường này là bắt buộc').notOneOf([yup.ref('oldPassword')], 'Mật khẩu mới không được trùng mật khẩu cũ')
    .min(6, 'Mật khẩu phải ít nhất 6 kí tự'),
  newPasswordConfirm: yup.string().required('Trường này là bắt buộc').oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp'),
});

export const updateEmailTemplateSchema = yup.object().shape({
  name: yup.string().required('Nhập tên'),
  subject: yup.string().required('Nhập tiêu đề'),
  content: yup.string().required('Nhập nội dung'),
});

export const activeTOtpSecretSchema = yup.object().shape({
  currentPassword: yup.string().required('Trường này là bắt buộc'),
  otpCode: yup.string().matches(new RegExp('^[0-9]+$'), { message: 'OTP phải là số' }).length(6, 'OTP phải có 6 chữ số').required('Trường này là bắt buộc')
});

export const requiredPasswordSchema = yup.object().shape({
  currentPassword: yup.string().required('Trường này là bắt buộc'),
});

export const staticBlocksMainData = yup.object().shape({
  name: yup.string().required('Trường này là bắt buộc'),
  templateCode: yup.string().required('Trường này là bắt buộc'),
});
