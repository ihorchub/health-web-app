import { Button } from '@mui/material';
import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { useTranslation } from 'react-i18next';

import {
  CropActions,
  CropDialog,
  CropHint,
  CropImage,
  CropShell,
  CropStage,
  CropTitle,
  CropZoomLabel,
  CropZoomRow,
  CropZoomSlider,
} from '@/modules/profile/styles';
import {
  clampOffsets,
  coverScale,
  cropImageToFile,
  PHOTO_CROP_VIEW,
} from '@/modules/profile/utils/cropImage';

interface PhotoCropDialogProps {
  open: boolean;
  imageUrl: string | null;
  onCancel: () => void;
  onConfirm: (file: File) => void | Promise<void>;
}

export const PhotoCropDialog = ({
  open,
  imageUrl,
  onCancel,
  onConfirm,
}: PhotoCropDialogProps) => {
  const { t } = useTranslation('profile');
  const imageRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageLoad = () => {
    const image = imageRef.current;
    if (!image?.naturalWidth) {
      return;
    }
    setNaturalSize({ width: image.naturalWidth, height: image.naturalHeight });
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  const applyOffsets = (nextZoom: number, nextX: number, nextY: number) => {
    if (!naturalSize.width || !naturalSize.height) {
      setOffsetX(nextX);
      setOffsetY(nextY);
      return;
    }
    const clamped = clampOffsets(
      naturalSize.width,
      naturalSize.height,
      nextZoom,
      nextX,
      nextY,
    );
    setOffsetX(clamped.offsetX);
    setOffsetY(clamped.offsetY);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offsetX,
      originY: offsetY,
    };
    setDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }
    applyOffsets(
      zoom,
      drag.originX + (event.clientX - drag.startX),
      drag.originY + (event.clientY - drag.startY),
    );
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      setDragging(false);
    }
  };

  const handleZoom = (_event: Event, value: number | number[]) => {
    const nextZoom = Array.isArray(value) ? value[0]! : value;
    setZoom(nextZoom);
    applyOffsets(nextZoom, offsetX, offsetY);
  };

  const handleConfirm = async () => {
    const image = imageRef.current;
    if (!image || !naturalSize.width) {
      return;
    }
    setSaving(true);
    try {
      const file = await cropImageToFile(image, { zoom, offsetX, offsetY });
      await onConfirm(file);
    } finally {
      setSaving(false);
    }
  };

  const scale =
    naturalSize.width > 0
      ? coverScale(naturalSize.width, naturalSize.height, PHOTO_CROP_VIEW) * zoom
      : 1;
  const displayW = naturalSize.width * scale;
  const displayH = naturalSize.height * scale;

  return (
    <CropDialog open={open} onClose={onCancel} fullWidth>
      <CropShell>
        <div>
          <CropTitle>{t('photoCrop.title')}</CropTitle>
          <CropHint>{t('photoCrop.hint')}</CropHint>
        </div>

        <CropStage
          data-dragging={dragging ? 'true' : 'false'}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {imageUrl ? (
            <CropImage
              ref={imageRef}
              src={imageUrl}
              alt=""
              draggable={false}
              onLoad={handleImageLoad}
              $width={displayW}
              $height={displayH}
              $offsetX={offsetX}
              $offsetY={offsetY}
            />
          ) : null}
        </CropStage>

        <CropZoomRow>
          <CropZoomLabel>{t('photoCrop.zoom')}</CropZoomLabel>
          <CropZoomSlider
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={handleZoom}
            aria-label={t('photoCrop.zoom')}
            disabled={!naturalSize.width}
          />
        </CropZoomRow>

        <CropActions>
          <Button variant="outlined" color="inherit" onClick={onCancel} disabled={saving}>
            {t('cancel')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              void handleConfirm();
            }}
            disabled={saving || !naturalSize.width}
          >
            {saving ? t('saving') : t('photoCrop.apply')}
          </Button>
        </CropActions>
      </CropShell>
    </CropDialog>
  );
};
