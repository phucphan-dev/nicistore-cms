/* eslint-disable no-param-reassign */
import { DataNode } from 'antd/lib/tree';

import {
  MainMenuDataType, MenuGenerationItem, MenuGenerationList, MenuItemEditFormTypes
} from './types';

import { MenuByCodeItemTypes, UpdateMenuItemParamsTypes } from 'common/services/menus/types';
import { convertTargetToNumber, convertTargetToString } from 'common/utils/functions';

export const recursiveGTreeData = (menus: MenuByCodeItemTypes[]) => {
  const recursiveMenus = (
    menuList: MenuByCodeItemTypes[],
    parentId: number,
  ): MainMenuDataType[] => {
    const menusGrouped: MainMenuDataType[] = [];
    menuList.forEach((menu) => {
      if (menu.parentId === parentId) {
        const subMenus = recursiveMenus(menuList, menu.id);
        const params = {
          ...menu,
          key: `menu-${menu.id}`,
          dynamicId: menu.id,
          target: convertTargetToNumber(menu.target),
          iconFile: menu.icon,
          rawTitle: menu.title,
        };
        menusGrouped.push(
          subMenus && subMenus.length > 0
            ? {
              ...params,
              children: recursiveMenus(menuList, menu.id)
            }
            : {
              ...params,
            }
        );
      }
    });
    return menusGrouped;
  };
  if (menus.length > 0) {
    const firstLevelParentId = menus.find((menu) => menu.depth === 1)!.parentId;
    return recursiveMenus(menus, firstLevelParentId);
  }
  return [];
};

export const getTitleById = (menuGenerateList: MenuGenerationList[], item: MenuGenerationItem) => {
  let res = '';
  const option = menuGenerateList
    .find((f) => f.id === item.id)?.optionList;
  if (option) res = option.find((f) => f.value === Number(item.data.title))?.label || '';
  else res = String(item.data.title);
  return res;
};

export const onDrop = (info: any, gData: DataNode[]) => {
  const dropKey = info.node.key;
  const dragKey = info.dragNode.key;
  const dropPos = info.node.pos.split('-');
  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

  // eslint-disable-next-line consistent-return
  const loop = (data: any, key: string, callback: any) => {
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].key === key) {
        return callback(data[i], i, data);
      }
      if (data[i].children) {
        loop(data[i].children, key, callback);
      }
    }
  };

  const data = [...gData];

  let dragObj: any;
  loop(data, dragKey, (item: any, index: number, arr: any[]) => {
    arr.splice(index, 1);
    dragObj = item;
    item.rawTitle = dragObj.title.props?.children?.[0]?.props?.children || '';
    if (!info.dropToGap) {
      dragObj.parentId = info.node.dynamicId;
    } else {
      delete dragObj.parentId;
    }
  });

  if (!info.dropToGap) {
    // Drop on the content
    loop(data, dropKey, (item: any) => {
      item.children = item.children || [];
      item.children?.unshift(dragObj);
    });
  } else if (
    (info.node.props.children || []).length > 0 // Has children
    && info.node.props.expanded // Is expanded
    && dropPosition === 1 // On the bottom gap
  ) {
    loop(data, dropKey, (item: any) => {
      item.children = item.children || [];

      item.children.unshift(dragObj);
    });
  } else {
    let ar: any[] = [];
    let i;
    loop(data, dropKey, (_item: any, index: number, arr: any[]) => {
      ar = arr;
      i = index;
    });

    if (dropPosition === -1) {
      ar.splice(Number(i), 0, dragObj);
    } else {
      ar.splice(Number(i) + 1, 0, dragObj);
    }
  }
  return ({ data, dragObj });
};

export const convertUpdateMenuParams = (
  menus?: MainMenuDataType[],
) => {
  if (!menus) return undefined;

  const genArr = (menuItem: MainMenuDataType[]) => {
    const menusGrouped: UpdateMenuItemParamsTypes[] = [];

    menuItem.forEach((item) => {
      const { children, ...data } = item;
      const params: UpdateMenuItemParamsTypes = {
        referenceId: data.referenceId,
        cssClass: data.cssClass,
        link: data.link,
        type: data.type,
        rel: data.rel,
        download: data.download,
        id: item.id,
        title: (item.title as string) || item.rawTitle || '',
        target: String(convertTargetToString(item.target || 0)),
        icon: item.iconFile,
      };

      if (item.children && item.children.length > 0) {
        const subMenus = genArr(item.children);

        menusGrouped.push(
          subMenus.length > 0 ? {
            ...params,
            children: genArr(item.children)
          } as UpdateMenuItemParamsTypes : {
            ...params,
          }
        );
      } else {
        menusGrouped.push(params);
      }
    });
    return menusGrouped;
  };
  return genArr(menus);
};

export const deleteMenuItem = (menu: MainMenuDataType[], idDelete?: number):
  MainMenuDataType[] => {
  if (!idDelete) return menu;
  return menu.reduce((prev: MainMenuDataType[], cur) => {
    if (cur.dynamicId === idDelete) {
      return prev;
    }
    if (cur.children) {
      return [...prev, { ...cur, children: deleteMenuItem(cur.children, idDelete) }];
    }
    return [...prev, cur];
  }, []);
};

export const handleUpdateMenuTreeData = (
  dynamicId: number,
  menu: MainMenuDataType[],
  data: MenuItemEditFormTypes
): MainMenuDataType[] => menu.map((x) => {
  if (x.dynamicId === dynamicId) {
    return ({
      ...x,
      cssClass: data.cssClass || '',
      link: data.link || '',
      title: data.title || '',
      rawTitle: data.title || '',
      rel: data.rel || '',
      iconFile: data.icon || '',
      target: data.target,
      download: data.download,
    });
  }
  return {
    ...x,
    children: x.children && x.children.length > 0
      ? handleUpdateMenuTreeData(dynamicId, x.children, data)
      : undefined
  };
});
