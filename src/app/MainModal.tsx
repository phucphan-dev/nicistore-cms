import React, { useEffect, useState } from 'react';

import ModalFinder from 'features/FilesManagement/ModalFinder';

const MainModal: React.FC = () => {
  const [ocFinder, setOcFinder] = useState(false);
  useEffect(() => {
    const processMessage = (message: MessageEvent<any>) => {
      if (message.data === 'show-ocfinder') {
        setOcFinder(true);
      }
      if (message.data === 'close-ocfinder') {
        setOcFinder(false);
      }
    };
    window.addEventListener('message', processMessage);

    return () => window.removeEventListener('message', processMessage);
  }, []);
  return (
    <ModalFinder
      isOpen={ocFinder}
      handleSelectFile={
        (data) => (window as any).chooseCallback(data.map((image) => image.path))
      }
      handleClose={() => setOcFinder(false)}
    />
  );
};

export default MainModal;
