export const languageList = [
  {
    label: 'Tiếng Việt',
    value: 'vi',
  },
  {
    label: 'English',
    value: 'en',
  },
];

export const samplePage = [...Array(10)].map((_, idx) => ({
  label: `Trang mẫu ${idx + 1}`,
  value: `${idx + 1}`,
}));

export const statusDummy = [
  {
    label: 'Bản nháp',
    value: 1,
  },
  {
    label: 'Gửi duyệt',
    value: 7,
  },
  {
    label: 'Đã duyệt',
    value: 13,
  },
];

export const contactStatusDummy = [
  {
    label: 'Mới',
    value: 1,
  },
  {
    label: 'Chờ duyệt',
    value: 7,
  },
  {
    label: 'Đã duyệt',
    value: 13,
  },
];
