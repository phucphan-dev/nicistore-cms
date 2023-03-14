/* eslint-disable no-param-reassign */
import { CloseOutlined } from '@ant-design/icons';
import {
  Checkbox, Space, Typography,
} from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { Controller } from 'react-hook-form';

import {
  RolePermissionColumnForm,
  RolePermissionColumnType,
  RolePermissionProps,
  RolePermissionTableRow,
} from './types';

import { PermissionData } from 'common/services/roles/types';

export const tagRender = (props: CustomTagProps) => {
  const { label, closable, onClose } = props;
  return (
    <div className="ant-select-selection-item">
      <Space>
        <Checkbox
          checked
        />
        <Typography.Text>
          {label}
        </Typography.Text>
        {closable && (
          <div className="ant-select-selection-item-remove" onClick={onClose}>
            <CloseOutlined />
          </div>
        )}
      </Space>
    </div>
  );
};

export const getPermissionColumnObj = (action: keyof RolePermissionProps, title: string):
  RolePermissionColumnType => ({
    title,
    width: 150,
    align: 'center',
    dataIndex: action,
    key: action,
    render: (_name, _data) => {
      if (_data[action]) {
        return (
          <Controller
            name={`permissions[${_data.module}][${action}]`}
            defaultValue={false}
            render={({
              field: { value, onChange },
            }) => (
              <Checkbox
                checked={value}
                onChange={onChange}
                style={{
                  height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              />
            )}
          />
        );
      }
      return null;
    },
  });

function getValueWithType<T extends keyof RolePermissionTableRow>(
  data: RolePermissionTableRow,
  key: T,
) {
  return data[key];
}

export const convertPermissionData = (permissions: RolePermissionColumnForm) => {
  let array: string[] = [];
  Object.entries(permissions).forEach(([key, value]) => {
    Object.entries(value).forEach(([keyData, valueData]) => {
      if (keyData === 'others') {
        const othersArr = getValueWithType(value, keyData);
        array = [...array, ...(othersArr || [])];
      } else if (valueData) {
        array = [...array, `${key}.${keyData}`];
      }
    });
  });
  return array;
};

// @params:
// [
//   "page.index",
//   "page.store",
//   ...
// ]

// @return:
// [
//   {
//     module: string;
//     index?: boolean;
//     show?: boolean;
//     store?: boolean;
//     update?: boolean;
//     destroy?: boolean;
//     others?: string[];
//   },
//   ...
// ]

export const convertPermissionDataTable = (permissions: string[]) => {
  const permissionRender = permissions.reduce((prevObj: RolePermissionProps[], currVal) => {
    const propertyName = currVal.split('.')[0] as keyof RolePermissionTableRow;
    const action = currVal.split('.')[1];
    switch (action) {
      case 'index': {
        const objData = { module: propertyName, index: true };
        const notDuplicateFlag = prevObj.every((ele) => {
          if (ele.module === propertyName) {
            ele = Object.assign(ele, objData);
            return false;
          }
          return true;
        });
        if (notDuplicateFlag) {
          return [...prevObj, objData];
        }
        return prevObj;
      }
      case 'show': {
        const objData = { module: propertyName, show: true };
        const notDuplicateFlag = prevObj.every((ele) => {
          if (ele.module === propertyName) {
            ele = Object.assign(ele, objData);
            return false;
          }
          return true;
        });
        if (notDuplicateFlag) {
          return [...prevObj, objData];
        }
        return prevObj;
      }
      case 'store': {
        const objData = { module: propertyName, store: true };
        const notDuplicateFlag = prevObj.every((ele) => {
          if (ele.module === propertyName) {
            ele = Object.assign(ele, objData);
            return false;
          }
          return true;
        });
        if (notDuplicateFlag) {
          return [...prevObj, objData];
        }
        return prevObj;
      }
      case 'update': {
        const objData = { module: propertyName, update: true };
        const notDuplicateFlag = prevObj.every((ele) => {
          if (ele.module === propertyName) {
            ele = Object.assign(ele, objData);
            return false;
          }
          return true;
        });
        if (notDuplicateFlag) {
          return [...prevObj, objData];
        }
        return prevObj;
      }
      case 'destroy': {
        const objData = { module: propertyName, destroy: true };
        const notDuplicateFlag = prevObj.every((ele) => {
          if (ele.module === propertyName) {
            ele = Object.assign(ele, objData);
            return false;
          }
          return true;
        });
        if (notDuplicateFlag) {
          return [...prevObj, objData];
        }
        return prevObj;
      }
      default: {
        const objData = { module: propertyName, others: [currVal] };
        const notDuplicateFlag = prevObj.every((ele) => {
          if (ele.module === propertyName) {
            ele = Object.assign(ele, {
              ...ele,
              others: [...(ele.others || []), ...objData.others]
            });
            return false;
          }
          return true;
        });
        if (notDuplicateFlag) {
          return [...prevObj, objData];
        }
        return prevObj;
      }
    }
  }, []);
  return permissionRender;
};

// @params:
// {
//   "page": [
//     "page.index",
//     "page.store",
//     "page.show",
//     "page.update",
//     "page.destroy"
//   ],
//   ...
// }

// @return:
// [
//   {
//     module: string;
//     index?: boolean;
//     show?: boolean;
//     store?: boolean;
//     update?: boolean;
//     destroy?: boolean;
//     others?: string[];
//   },
//   ...
// ]

export const convertPermissionAllDataTable = (permissionData: PermissionData) => {
  const arrData: RolePermissionProps[] = [];
  Object.entries(permissionData).forEach(([key, value]) => {
    const permissions = value.map((ele) => ele.split('.')[1]);
    const permissionRender = permissions.reduce((prevObj: RolePermissionTableRow, currVal) => {
      switch (currVal) {
        case 'index':
          return {
            ...prevObj,
            index: true,
          };
        case 'show':
          return {
            ...prevObj,
            show: true,
          };
        case 'store':
          return {
            ...prevObj,
            store: true,
          };
        case 'update':
          return {
            ...prevObj,
            update: true,
          };
        case 'destroy':
          return {
            ...prevObj,
            destroy: true,
          };
        default:
          return {
            ...prevObj,
            others: [...(prevObj.others || []), `${key}.${currVal}`],
          };
      }
    }, {
      others: [],
    });
    arrData.push({
      module: key,
      ...permissionRender,
    });
  });
  return arrData.sort((a, b) => Object.keys(b).length - Object.keys(a).length);
};

// @params:
// [
//   "page.index",
//   "page.store",
//    ...
// ]

// @return:
// [
//   [x: string]: {
//     index?: boolean;
//     show?: boolean;
//     store?: boolean;
//     update?: boolean;
//     destroy?: boolean;
//     others?: string[];
//   },
//   ...
// ]

export const convertPermissionDataForm = (permissions: string[]) => {
  const permissionRender = permissions.reduce((prevObj: RolePermissionColumnForm, currVal) => {
    const propertyName = currVal.split('.')[0];
    const action = currVal.split('.')[1];
    switch (action) {
      case 'index': {
        return Object.assign(prevObj, {
          [propertyName]: { ...prevObj[propertyName], index: true }
        });
      }
      case 'show': {
        return Object.assign(prevObj, {
          [propertyName]: { ...prevObj[propertyName], show: true }
        });
      }
      case 'store': {
        return Object.assign(prevObj, {
          [propertyName]: { ...prevObj[propertyName], store: true }
        });
      }
      case 'update': {
        return Object.assign(prevObj, {
          [propertyName]: { ...prevObj[propertyName], update: true }
        });
      }
      case 'destroy': {
        return Object.assign(prevObj, {
          [propertyName]: { ...prevObj[propertyName], destroy: true }
        });
      }
      default:
        return Object.assign(prevObj, {
          [propertyName]: {
            ...prevObj[propertyName],
            others: [...(prevObj[propertyName]?.others || []), currVal],
          }
        });
    }
  }, {});
  return permissionRender;
};
