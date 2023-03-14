import { Modal } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'app/store';
import { hideModalError } from 'app/systemSlice';

const useGlobalError = (active: boolean): void => {
  const navigator = useNavigate();
  const dispatch = useAppDispatch();

  const {
    statusError, showModalError
  } = useAppSelector(
    (stateSystem) => stateSystem.system
  );

  const errorData = (code?: number) => {
    switch (code) {
      case 503:
        return {
          title: 'Server',
          content: 'Service Unavailable',
        };
      case 403:
        return {
          title: 'Forbidden',
          content: 'Access Denied',
        };
      case 500:
        return {
          title: 'Server',
          content: 'Internal Server Error',
        };
      case 400:
        return {
          title: 'Expired',
          content: 'Login session expired!',
        };
      default:
        return null;
    }
  };

  useEffect(() => {
    if (active && showModalError) {
      const error = errorData(statusError);
      if (error) {
        Modal.error({
          ...errorData(statusError),
          onOk: () => {
            dispatch(hideModalError());
            if (statusError === 400) {
              navigator('/login');
            }
          }
        });
      }
    }
  }, [statusError, showModalError, active, dispatch, navigator]);
};

export default useGlobalError;
