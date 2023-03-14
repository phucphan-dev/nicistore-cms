import { Button } from 'antd';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';

import { downloadFile } from 'common/utils/functions';

const ImageResizer: React.FC = () => {
  const image = useRef<HTMLImageElement>(null);

  const [file, setFile] = useState<File>();
  const [imagePath, setImagePath] = useState('');

  const draw = useCallback((url: string, mineType: string) => {
    const imager = document.createElement('img');
    imager.src = url;
    const canvas = document.createElement('canvas');
    imager.onload = () => {
      const imgwidth = imager.width;
      const imgheight = imager.height;
      let ratio = Math.min(1200 / imgwidth, 700 / imgheight);
      if (ratio > 1) {
        ratio = 1;
      }

      const newWidth = imgwidth * ratio;
      const newHeight = imgheight * ratio;
      canvas.width = newWidth;
      canvas.height = newHeight;
      canvas.getContext('2d')?.drawImage(
        imager,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      canvas.toBlob(
        (b) => {
          if (b) {
            // eslint-disable-next-line no-console
            console.log(
              new File([b], file?.name || 'filename', { type: mineType }),
            );

            setImagePath(URL.createObjectURL(b));
          }
        },
        mineType,
        1,
      );
      // const resizedImageAsBase64 = canvas.toDataURL(mineType, 0.7);
      // setImagePath(resizedImageAsBase64);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (file) {
      draw(URL.createObjectURL(file), file.type);
    }
  }, [draw, file]);

  return (
    <>
      {imagePath && (
        <div>
          <img
            src={imagePath}
            ref={image}
            alt="tes"
            style={{ maxWidth: '100%' }}
          />
        </div>
      )}
      <div>
        <label htmlFor="file" className="file">
          <input
            type="file"
            id="file"
            onChange={(e) => e.currentTarget && e.currentTarget.files
              && setFile(e.currentTarget.files[0])}
          />
          <span className="file-custom" />
          <span className="file-name">{file?.name || 'Please choose file'}</span>
        </label>
      </div>
      <Button onClick={() => downloadFile(imagePath)}>Download</Button>
    </>
  );
};

export default ImageResizer;
