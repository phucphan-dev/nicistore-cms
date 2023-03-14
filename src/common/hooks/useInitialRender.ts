import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useDidMount from './useDidMount';

import { useAppDispatch } from 'app/store';
import { getAdvancedFilterAction, getSystemInitialAction } from 'app/systemSlice';
import {
  getAccessToken, removeAccessToken, removeRefreshAccessToken
} from 'common/services/common/storage';
import verifyToken from 'common/utils/jwtHelper';
import { getProfileAction, setRoles } from 'features/Login/authenticateSlice';

const useInitialRender = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
  const [isDone, setIsDone] = useState(false);

  const expiredAction = () => {
    navigator('/login');
    setIsDone(true);
  };

  useDidMount(async () => {
    try {
      const token = getAccessToken();
      await dispatch(getSystemInitialAction()).unwrap().then(async (data) => {
        if (token) {
          await dispatch(getProfileAction()).unwrap().then(async () => {
            const payload = await verifyToken(token, data.passportPublicKey || '');
            if (payload) {
              dispatch(setRoles(payload.scopes as string[]));
              dispatch(getAdvancedFilterAction());
              if (location.pathname === '/login') {
                navigator('/');
              }
            } else {
              removeAccessToken();
              removeRefreshAccessToken();
              navigator('/login');
            }
            setIsDone(true);
          }).catch(() => {
            expiredAction();
          });
        } else {
          expiredAction();
        }
      });
    } catch {
      expiredAction();
    }
  });
  return isDone;
};

export default useInitialRender;
