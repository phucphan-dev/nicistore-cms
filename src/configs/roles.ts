const roles = {
  /* BLOCK TEMPLATE */
  TEMPLATE_INDEX: 'pageTemplate.index',
  TEMPLATE_UPDATE: 'pageTemplate.update',
  /* PAGE */
  PAGE_INDEX: 'page.index',
  PAGE_STORE: 'page.store',
  PAGE_UPDATE: 'page.update',
  PAGE_DESTROY: 'page.destroy',
  PAGE_APPROVED: 'page.approved',

  PAGE_COMMENT_INDEX: 'pageComment.index',
  PAGE_COMMENT_STORE: 'pageComment.store',
  /* MEDIA */
  FOLDER_STORE: 'mediaFolder.store',
  FOLDER_UPDATE: 'mediaFolder.update',
  FOLDER_DESTROY: 'mediaFolder.destroy',
  FOLDER_VIEWALL: 'mediaFolder.allFolders',
  FOLDER_GETITEMS: 'mediaFolder.getItemsByFolder',

  FILE_UPDATE: 'mediaFile.update',
  FILE_DESTROY: 'mediaFile.destroy',
  FILE_UPLOAD: 'mediaFile.uploadFile',

  TRASH_INDEX: 'mediaTrash.index',
  TRASH_RESTORE: 'mediaTrash.restore',
  TRASH_FORCEDELETE: 'mediaTrash.forceDelete',
  TRASH_EMPTY: 'mediaTrash.empty',
  /* MENU */
  MENU_INDEX: 'menu.index',
  MENU_STORE: 'menu.store',
  MENU_DESTROY: 'menu.destroy',
  MENU_MANAGE: 'menu.manage',
  /* NEWS */
  NEWS_INDEX: 'news.index',
  NEWS_STORE: 'news.store',
  NEWS_UPDATE: 'news.update',
  NEWS_DESTROY: 'news.destroy',
  NEWS_APPROVED: 'news.approved',

  NEWS_COMMENT_INDEX: 'newsComment.index',
  NEWS_COMMENT_STORE: 'newsComment.store',
  /* NEWS CATEGORY */
  NEWS_CATE_INDEX: 'newsCategory.index',
  NEWS_CATE_STORE: 'newsCategory.store',
  NEWS_CATE_UPDATE: 'newsCategory.update',
  NEWS_CATE_DESTROY: 'newsCategory.destroy',
  NEWS_CATE_APPROVED: 'newsCategory.approved',

  NEWS_CATE_COMMENT_INDEX: 'newsCategoryComment.index',
  NEWS_CATE_COMMENT_STORE: 'newsCategoryComment.store',
  /* BANNER */
  BANNER_INDEX: 'banner.index',
  BANNER_STORE: 'banner.store',
  BANNER_UPDATE: 'banner.update',
  BANNER_DESTROY: 'banner.destroy',

  BANNER_COMMENT_INDEX: 'bannerComment.index',
  BANNER_COMMENT_STORE: 'bannerComment.store',
  /* SYSTEM */
  SYSTEM_INDEX: 'configGeneral.index',
  SYSTEM_STORE: 'configGeneral.store',
  SEO_GENERAL_INDEX: 'seoGeneral.index',
  SEO_GENERAL_STORE: 'seoGeneral.store',
  SYSTEM_LOCALE_INDEX: 'configLocale.index',
  SYSTEM_LOCALE_STORE: 'configLocale.store',
  /* HEADER */
  CONFIG_HEADER_INDEX: 'configHeader.index',
  CONFIG_HEADER_STORE: 'configHeader.store',
  /* FOOTER */
  CONFIG_FOOTER_INDEX: 'configFooter.index',
  CONFIG_FOOTER_STORE: 'configFooter.store',
  /* FE TRANSLATION  */
  FE_TRANSLATION_INDEX: 'feTranslation.index',
  FE_TRANSLATION_STORE: 'feTranslation.store',
  FE_TRANSLATION_UPDATE: 'feTranslation.update',
  FE_TRANSLATION_DESTROY: 'feTranslation.destroy',
  /* CMS TRANSLATION  */
  CMS_TRANSLATION_INDEX: 'cmsTranslation.index',
  CMS_TRANSLATION_STORE: 'cmsTranslation.store',
  CMS_TRANSLATION_UPDATE: 'cmsTranslation.update',
  CMS_TRANSLATION_DESTROY: 'cmsTranslation.destroy',
  /* REDIRECT */
  REDIRECT_INDEX: 'redirect.index',
  REDIRECT_STORE: 'redirect.store',
  REDIRECT_UPDATE: 'redirect.update',
  REDIRECT_DESTROY: 'redirect.destroy',
  REDIRECT_IMPORT: 'redirect.import',
  /* FAQ */
  FAQ_INDEX: 'faq.index',
  FAQ_STORE: 'faq.store',
  FAQ_UPDATE: 'faq.update',
  FAQ_DESTROY: 'faq.destroy',
  FAQ_APPROVED: 'faq.approved',

  FAQ_COMMENT_INDEX: 'faqComment.index',
  FAQ_COMMENT_STORE: 'faqComment.store',
  /* FAQ CATEGORY */
  FAQ_CATEGORY_INDEX: 'faqCategory.index',
  FAQ_CATEGORY_STORE: 'faqCategory.store',
  FAQ_CATEGORY_UPDATE: 'faqCategory.update',
  FAQ_CATEGORY_DESTROY: 'faqCategory.destroy',
  FAQ_CATEGORY_APPROVED: 'faqCategory.approved',

  FAQ_CATEGORY_COMMENT_INDEX: 'faqCategoryComment.index',
  FAQ_CATEGORY_COMMENT_STORE: 'faqCategoryComment.store',
  /* ERROR PAGES */
  ERROR_PAGE_400: 'configErrorsPage.error400',
  ERROR_PAGE_403: 'configErrorsPage.error403',
  ERROR_PAGE_404: 'configErrorsPage.error404',
  ERROR_PAGE_429: 'configErrorsPage.error429',
  ERROR_PAGE_500: 'configErrorsPage.error500',
  /* CONTACT */
  CONTACT_INDEX: 'contact.index',
  CONTACT_UPDATE: 'contact.update',
  CONTACT_DESTROY: 'contact.destroy',
  /* CONTACT PROBLEM */
  CONTACT_PROBLEM_INDEX: 'contactProblem.index',
  CONTACT_PROBLEM_STORE: 'contactProblem.store',
  CONTACT_PROBLEM_UPDATE: 'contactProblem.update',
  CONTACT_PROBLEM_DESTROY: 'contactProblem.destroy',
  CONTACT_PROBLEM_APPROVED: 'contactProblem.approved',

  CONTACT_PROBLEM_COMMENT_INDEX: 'contactProblemComment.index',
  CONTACT_PROBLEM_COMMENT_STORE: 'contactProblemComment.store',
  /* EMAIL TEMPLATE */
  EMAIL_TEMPLATE_INDEX: 'emailTemplate.index',
  EMAIL_TEMPLATE_UPDATE: 'emailTemplate.update',

  /* FORM */
  FORM_INDEX: 'formManagement.index',
  FORM_STORE: 'formManagement.store',
  FORM_UPDATE: 'formManagement.update',
  FORM_DESTROY: 'formManagement.destroy',

  /* ActivityLogs */
  ACTIVITYLOG_INDEX: 'activityLog.index',

  /* StaticBlocks */
  STATIC_BLOCK_INDEX: 'staticBlock.index',
  STATIC_BLOCK_STORE: 'staticBlock.store',
  STATIC_BLOCK_UPDATE: 'staticBlock.update',
  STATIC_BLOCK_DESTROY: 'staticBlock.destroy',
};

export default roles;

export const getPermission = (rolePermission: string[], key: string): boolean => {
  if (rolePermission.includes('*') || rolePermission.includes(key)) return true;
  return false;
};
