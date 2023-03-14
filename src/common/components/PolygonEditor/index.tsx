import React, {
  forwardRef,
  useCallback, useEffect, useImperativeHandle, useRef, useState
} from 'react';
import { useTranslation } from 'react-i18next';

import SelectFile from '../SelectFile';

import { getMousePos } from './functions';

const SELECT_FILL_COLOR = '#4ade8080';
const SELECT_STROKE_COLOR = '#4ade80';
const PRIMARY_FILL_COLOR = '#38bdf880';
const PRIMARY_STROKE_COLOR = '#38bdf8';
const SECONDARY_FILL_COLOR = '#FFA50080';
const SECONDARY_STROKE_COLOR = '#FFA500';

export type PointType = {
  x: number;
  y: number;
};

const drawPolygon = (
  ctx: CanvasRenderingContext2D,
  r: Array<PointType>,
  finished = true,
) => {
  const [head, ...tails] = r;

  ctx.beginPath();
  ctx.moveTo(head.x, head.y);

  for (const p of tails) {
    ctx.lineTo(p.x, p.y);
  }

  if (finished) ctx.closePath();

  ctx.fill();
  ctx.stroke();

  if (!finished) {
    ctx.beginPath();
    ctx.arc(head.x, head.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
};

export interface PolygonEditorRef {
  getRegions: () => Record<number, Array<PointType>>;
  getLatestId: () => number;

  handleClear: () => void;
  handleAddPoint: (point: PointType) => void;
  handleFinishRegion: () => void;
  handleDeleteRegion: (id: number) => void;
  handleSelectRegion: (id: number) => void;
  handleSubscribeFinishRegion: (cb: (id: number) => void) => void;
}

interface PolygonEditorProps {
}

const PolygonEditor = forwardRef<PolygonEditorRef, PolygonEditorProps>((_, ref) => {
  const { t } = useTranslation();
  /* Refs */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const finishCbSet = useRef<Set<(id: number) => void>>(new Set());

  /* States */
  const [regionId, setRegionId] = useState(0);
  const [backgroundImg, setBackgroundImg] = useState('');
  const [regions, setRegions] = useState<Record<number, Array<PointType>>>({});
  const [drawing, setDrawing] = useState<Array<PointType>>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | undefined>();

  const redraw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');

    if (canvasRef.current && ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      for (const [id, r] of Object.entries(regions)) {
        if (parseInt(id, 10) === selectedRegion) {
          ctx.fillStyle = SELECT_FILL_COLOR;
          ctx.strokeStyle = SELECT_STROKE_COLOR;
        } else {
          ctx.fillStyle = PRIMARY_FILL_COLOR;
          ctx.strokeStyle = PRIMARY_STROKE_COLOR;
        }

        drawPolygon(ctx, r);
      }

      if (drawing.length > 0) {
        ctx.fillStyle = SECONDARY_FILL_COLOR;
        ctx.strokeStyle = SECONDARY_STROKE_COLOR;

        drawPolygon(ctx, drawing, false);
      }
    }
  }, [drawing, regions, selectedRegion]);

  const addPoint = (point: PointType) => {
    setDrawing((prevDrawing) => ([...prevDrawing, { x: point.x, y: point.y }]));
  };

  const cancelRegion = useCallback(() => {
    if (drawing.length > 0) {
      setDrawing([]);
    }
  }, [drawing]);

  const finishRegion = (usingMouse = false) => {
    // HACK: last-click + 2
    if (drawing.length >= (3 + (usingMouse ? 2 : 0))) {
      const newDrawing = [...drawing];

      // HACK: last-click
      if (usingMouse) {
        newDrawing.pop();
        newDrawing.pop();
      }

      const nextRegionId = regionId + 1;
      setRegionId(nextRegionId);
      setRegions((prevRegions) => ({ ...prevRegions, [nextRegionId]: newDrawing }));
      setDrawing([]);

      setTimeout(() => Array.from(finishCbSet.current).forEach((cb) => cb(regionId)), 0);
    }
  };

  const deleteRegion = (id: number) => {
    const newRegions = { ...regions };
    delete newRegions[id];

    setRegions(newRegions);
  };

  const selectRegion = (id: number) => {
    setSelectedRegion(id);
  };

  const subscribeFinishRegion = (cb: (id: number) => void) => {
    finishCbSet.current.add(cb);

    // return unsubscribe function
    return () => finishCbSet.current.delete(cb);
  };

  const clear = useCallback(() => {
    setRegionId(0);
    setRegions({});
    setDrawing([]);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
  };

  const handleClick = (ev: React.MouseEvent<HTMLCanvasElement>) => {
    ev.preventDefault();

    if (canvasRef.current) {
      const { mouseX, mouseY } = getMousePos(canvasRef.current, ev);
      addPoint({ x: mouseX, y: mouseY });
    }
  };

  const handleRightClick = (ev: React.MouseEvent<HTMLCanvasElement>) => {
    ev.preventDefault();

    cancelRegion();
  };

  const handleDoubleClick = (ev: React.MouseEvent<HTMLCanvasElement>) => {
    ev.preventDefault();

    finishRegion(true);
  };

  //* Load background image
  useEffect(() => {
    if (backgroundImg) {
      const image = new Image(); // Using optional size for image
      image.onload = () => {
        // drawImageActualSize
        const ctx = canvasRef.current?.getContext('2d');
        if (canvasRef.current && ctx) {
          // Use the intrinsic size of image in CSS pixels for the canvas element
          canvasRef.current.width = image.naturalWidth;
          canvasRef.current.height = image.naturalHeight;
          clear();
        }
      }; // Draw when image has loaded

      // Load an image
      image.src = backgroundImg;
    }
  }, [backgroundImg, clear]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancelRegion();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [cancelRegion]);

  useEffect(() => { redraw(); }, [redraw]);

  /* Imperative Handler */
  useImperativeHandle(ref, () => ({
    getRegions: () => regions,
    getLatestId: () => regionId,

    handleClear: () => clear(),
    handleAddPoint: (point) => addPoint(point),
    handleFinishRegion: () => finishRegion(),
    handleDeleteRegion: (id) => deleteRegion(id),
    handleSelectRegion: (id) => selectRegion(id),
    handleSubscribeFinishRegion: (cb) => subscribeFinishRegion(cb),
  }));

  return (
    <div className="t-polygonEditor">
      <SelectFile
        value={backgroundImg}
        name="icon"
        handleSelect={(url) => setBackgroundImg(url)}
        handleDelete={() => setBackgroundImg('')}
        title={t('system.image')}
      />
      {backgroundImg && (
        <div className="t-polygonEditor_editor u-mt-16">
          <img id="background-img" src={backgroundImg} alt="background-img" />
          <canvas
            id="canvas"
            className="t-polygonEditor_canvas"
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            onContextMenu={handleRightClick}
            onDoubleClick={handleDoubleClick}
          />
        </div>
      )}
    </div>
  );
});

export default PolygonEditor;
