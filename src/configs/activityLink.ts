import { ROUTE_PATHS } from 'common/utils/constant';

export const activityTypeList = [
  'banner',
  'pageTemplate',
  'contact',
  'contactProblem',
  'cmsTranslation',
  'feTranslation',
  'redirect',
  'role',
  'user',
  'emailTemplate',
  'faqCategory',
  'faq',
  'media',
  'menu',
  'menuItem',
  'newsCategory',
  'news',
  'page',
  'configFooter',
  'configHeader',
  'configError400',
  'configError403',
  'configError404',
  'configError429',
  'configError500',
  'configGeneral',
  'configLocale',
  'configSeoGeneral',
] as const;

export type ActivityModelType = typeof activityTypeList[number];

export const handleActivityLink = (
  modelName?: ActivityModelType,
  modelId?: number,
  actionName?: string,
): {
  url: string;
  params?: any;
} => {
  if (!modelName) {
    return { url: '', };
  }
  switch (modelName) {
    case 'banner': {
      if (modelId && !actionName?.includes('Deleted')) {
        return {
          url: ROUTE_PATHS.BANNER_DETAIL,
          params: `id=${modelId}`,
        };
      }
      return { url: ROUTE_PATHS.BANNER_DETAIL };
    }
    case 'pageTemplate': {
      return { url: ROUTE_PATHS.PAGE_TEMPLATE_MANAGEMENT };
    }
    case 'cmsTranslation': {
      return { url: ROUTE_PATHS.CMS_TRANSLATION_MANAGEMENT };
    }
    case 'feTranslation': {
      return { url: ROUTE_PATHS.FE_TRANSLATION_MANAGEMENT };
    }
    case 'redirect': {
      return { url: ROUTE_PATHS.REDIRECT_MANAGEMENT };
    }
    case 'role': {
      if (modelId && !actionName?.includes('Deleted')) {
        return {
          url: ROUTE_PATHS.ROLES_DETAIL,
          params: `id=${modelId}`,
        };
      }
      return { url: ROUTE_PATHS.ROLES_MANAGEMENT };
    }
    case 'user': {
      if (modelId && !actionName?.includes('Deleted')) {
        return {
          url: ROUTE_PATHS.USERS_DETAIL,
          params: `id=${modelId}`,
        };
      }
      return { url: ROUTE_PATHS.USERS_MANAGEMENT };
    }
    case 'faqCategory': {
      if (modelId && !actionName?.includes('Deleted')) {
        return {
          url: ROUTE_PATHS.FAQ_CATEGORY_DETAIL,
          params: `id=${modelId}`,
        };
      }
      return { url: ROUTE_PATHS.FAQ_CATEGORY_MANAGEMENT };
    }
    case 'faq': {
      if (modelId && !actionName?.includes('Deleted')) {
        return {
          url: ROUTE_PATHS.FAQ_DETAIL,
          params: `id=${modelId}`,
        };
      }
      return { url: ROUTE_PATHS.FAQ_MANAGEMENT };
    }
    case 'media': {
      return { url: ROUTE_PATHS.FILE_MANAGEMENT };
    }
    case 'menu': {
      if (modelId && !actionName?.includes('Deleted')) {
        return {
          url: ROUTE_PATHS.MENU_DETAIL,
          params: `id=${modelId}`,
        };
      }
      return { url: ROUTE_PATHS.MENU_MANAGEMENT };
    }
    case 'menuItem': {
      return { url: ROUTE_PATHS.MENU_MANAGEMENT };
    }
    case 'newsCategory': {
      if (modelId && !actionName?.includes('Deleted')) {
        return {
          url: ROUTE_PATHS.NEWS_CATEGORY_DETAIL,
          params: `id=${modelId}`,
        };
      }
      return { url: ROUTE_PATHS.NEWS_CATEGORY_MANAGEMENT };
    }
    case 'news': {
      if (modelId && !actionName?.includes('Deleted')) {
        return {
          url: ROUTE_PATHS.NEWS_DETAIL,
          params: `id=${modelId}`,
        };
      }
      return { url: ROUTE_PATHS.NEWS_MANAGEMENT };
    }
    case 'page': {
      if (modelId && !actionName?.includes('Deleted')) {
        return {
          url: ROUTE_PATHS.PAGE_DETAIL,
          params: `id=${modelId}`,
        };
      }
      return { url: ROUTE_PATHS.PAGE_MANAGEMENT };
    }
    case 'configHeader':
    case 'configFooter': {
      return { url: ROUTE_PATHS.SYSTEM_CONFIG_MANAGEMENT };
    }
    case 'configError400':
    case 'configError403':
    case 'configError404':
    case 'configError429':
    case 'configError500': {
      return { url: ROUTE_PATHS.ERRORS_MANAGEMENT };
    }
    case 'configGeneral':
    case 'configLocale':
    case 'configSeoGeneral': {
      return { url: ROUTE_PATHS.SYSTEM_MANAGEMENT };
    }
    case 'contact': {
      return { url: ROUTE_PATHS.CONTACT_MANAGEMENT };
    }
    case 'contactProblem': {
      if (modelId && !actionName?.includes('Deleted')) {
        return {
          url: ROUTE_PATHS.CONTACT_PROBLEM_DETAIL,
          params: `id=${modelId}`,
        };
      }
      return { url: ROUTE_PATHS.CONTACT_PROBLEM_MANAGEMENT };
    }
    case 'emailTemplate': {
      if (modelId && !actionName?.includes('Deleted')) {
        return {
          url: ROUTE_PATHS.EMAIL_TEMPLATE_DETAIL,
          params: `id=${modelId}`,
        };
      }
      return { url: ROUTE_PATHS.EMAIL_TEMPLATE_MANAGEMENT };
    }
    default:
      return { url: '' };
  }
};
