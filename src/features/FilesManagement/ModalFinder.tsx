import {
  Image, Modal, Tabs
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

import OCFinderContainer from './OCFinderContainer';

import { useAppSelector } from 'app/store';
import roles from 'configs/roles';

interface ModalFinderProps {
  selected?: string[];
  isOpen?: boolean;
  multiple?: boolean;
  handleSelectFile?: (data: SelectImageData[]) => void;
  handleClose?: () => void;
}

const ModalFinder: React.FC<ModalFinderProps> = (
  {
    selected, isOpen, multiple, handleSelectFile, handleClose
  }
) => {
  const { t } = useTranslation();
  const rolesUser = useAppSelector((state) => state.auth.roles);

  return (
    <Modal visible={isOpen} width="90vw" bodyStyle={{ height: '80vh', padding: '48px 24px 24px' }} footer={null} onCancel={handleClose}>
      <div className="modal-selectFile">
        {selected ? (
          <Tabs type="card">
            <Tabs.TabPane tab={t('media.choose_again')} key="browser">
              <OCFinderContainer
                handleSelectFile={handleSelectFile}
                multiple={multiple}
                isModal
                ocFinderRoles={{
                  createFolder: rolesUser.includes('*') || rolesUser.includes(roles.FOLDER_STORE),
                  updateFolder: rolesUser.includes('*') || rolesUser.includes(roles.FOLDER_UPDATE),
                  destroyFolder: rolesUser.includes('*') || rolesUser.includes(roles.FOLDER_DESTROY),
                  detailFolder: rolesUser.includes('*') || rolesUser.includes(roles.FOLDER_GETITEMS),
                  updateFile: rolesUser.includes('*') || rolesUser.includes(roles.FILE_UPDATE),
                  destroyFile: rolesUser.includes('*') || rolesUser.includes(roles.FILE_DESTROY),
                  uploadFile: rolesUser.includes('*') || rolesUser.includes(roles.FILE_UPLOAD),
                  accessTrash: rolesUser.includes('*') || rolesUser.includes(roles.TRASH_INDEX),
                  restoreTrash: rolesUser.includes('*') || rolesUser.includes(roles.TRASH_RESTORE),
                  forceDeleteTrash: rolesUser.includes('*') || rolesUser.includes(roles.TRASH_FORCEDELETE),
                  emptyTrash: rolesUser.includes('*') || rolesUser.includes(roles.TRASH_EMPTY),
                }}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={t('media.choosed')} key="selected" active>
              <div className="modal-selectFile_list">
                <Image.PreviewGroup>
                  {selected.map((image, idx) => (
                    <div className="modal-selectFile_selected" key={`modal-selectFile_selected${idx.toString()}`}>
                      <Image src={image} />
                    </div>
                  ))}
                </Image.PreviewGroup>
              </div>
            </Tabs.TabPane>
          </Tabs>
        )
          : (
            <OCFinderContainer
              handleSelectFile={handleSelectFile}
              multiple={multiple}
              isModal
              ocFinderRoles={{
                createFolder: rolesUser.includes('*') || rolesUser.includes(roles.FOLDER_STORE),
                updateFolder: rolesUser.includes('*') || rolesUser.includes(roles.FOLDER_UPDATE),
                destroyFolder: rolesUser.includes('*') || rolesUser.includes(roles.FOLDER_DESTROY),
                detailFolder: rolesUser.includes('*') || rolesUser.includes(roles.FOLDER_GETITEMS),
                updateFile: rolesUser.includes('*') || rolesUser.includes(roles.FILE_UPDATE),
                destroyFile: rolesUser.includes('*') || rolesUser.includes(roles.FILE_DESTROY),
                uploadFile: rolesUser.includes('*') || rolesUser.includes(roles.FILE_UPLOAD),
                accessTrash: rolesUser.includes('*') || rolesUser.includes(roles.TRASH_INDEX),
                restoreTrash: rolesUser.includes('*') || rolesUser.includes(roles.TRASH_RESTORE),
                forceDeleteTrash: rolesUser.includes('*') || rolesUser.includes(roles.TRASH_FORCEDELETE),
                emptyTrash: rolesUser.includes('*') || rolesUser.includes(roles.TRASH_EMPTY),
              }}
            />
          )}
      </div>
    </Modal>
  );
};

export default ModalFinder;
