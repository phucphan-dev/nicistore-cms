import React from 'react';
import { useTranslation } from 'react-i18next';

import OCFinderContainer from './OCFinderContainer';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import roles from 'configs/roles';

const FilesManagement: React.FC<ActiveRoles> = ({ roleOther }) => {
  const rolesUser = useAppSelector((state) => state.auth.roles);
  const { t } = useTranslation();
  return (
    <>
      <HeaderPage
        fixed
        title={t('media.title')}
      />
      <div className="t-mainlayout_wrapper">
        <OCFinderContainer ocFinderRoles={{
          createFolder: rolesUser.includes('*') || roleOther.includes(roles.FOLDER_STORE),
          updateFolder: rolesUser.includes('*') || roleOther.includes(roles.FOLDER_UPDATE),
          destroyFolder: rolesUser.includes('*') || roleOther.includes(roles.FOLDER_DESTROY),
          detailFolder: rolesUser.includes('*') || roleOther.includes(roles.FOLDER_GETITEMS),
          updateFile: rolesUser.includes('*') || roleOther.includes(roles.FILE_UPDATE),
          destroyFile: rolesUser.includes('*') || roleOther.includes(roles.FILE_DESTROY),
          uploadFile: rolesUser.includes('*') || roleOther.includes(roles.FILE_UPLOAD),
          accessTrash: rolesUser.includes('*') || roleOther.includes(roles.TRASH_INDEX),
          restoreTrash: rolesUser.includes('*') || roleOther.includes(roles.TRASH_RESTORE),
          forceDeleteTrash: rolesUser.includes('*') || roleOther.includes(roles.TRASH_FORCEDELETE),
          emptyTrash: rolesUser.includes('*') || roleOther.includes(roles.TRASH_EMPTY),
        }}
        />
      </div>
    </>
  );
};

export default FilesManagement;
