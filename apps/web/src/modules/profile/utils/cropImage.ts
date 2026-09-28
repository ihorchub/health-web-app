/** Crop a square region from an image given viewport pan/zoom state. */

export const PHOTO_CROP_VIEW = 280;
export const PHOTO_CROP_OUTPUT = 512;

export type PhotoCropTransform = {
  /** Multiplier on top of cover-scale (1 = just covers the circle). */
  zoom: number;
  offsetX: number;
  offsetY: number;
};

export const coverScale = (
  naturalWidth: number,
  naturalHeight: number,
  view = PHOTO_CROP_VIEW,
) => Math.max(view / naturalWidth, view / naturalHeight);

export const clampOffsets = (
  naturalWidth: number,
  naturalHeight: number,
  zoom: number,
  offsetX: number,
  offsetY: number,
  view = PHOTO_CROP_VIEW,
): { offsetX: number; offsetY: number } => {
  const scale = coverScale(naturalWidth, naturalHeight, view) * zoom;
  const displayW = naturalWidth * scale;
  const displayH = naturalHeight * scale;
  const maxX = Math.max(0, (displayW - view) / 2);
  const maxY = Math.max(0, (displayH - view) / 2);
  return {
    offsetX: Math.min(maxX, Math.max(-maxX, offsetX)),
    offsetY: Math.min(maxY, Math.max(-maxY, offsetY)),
  };
};

export const cropImageToFile = async (
  image: HTMLImageElement,
  transform: PhotoCropTransform,
  fileName = 'photo.jpg',
): Promise<File> => {
  const view = PHOTO_CROP_VIEW;
  const output = PHOTO_CROP_OUTPUT;
  const scale =
    coverScale(image.naturalWidth, image.naturalHeight, view) * transform.zoom;
  const { offsetX, offsetY } = clampOffsets(
    image.naturalWidth,
    image.naturalHeight,
    transform.zoom,
    transform.offsetX,
    transform.offsetY,
    view,
  );

  const displayW = image.naturalWidth * scale;
  const displayH = image.naturalHeight * scale;
  const imageLeft = (view - displayW) / 2 + offsetX;
  const imageTop = (view - displayH) / 2 + offsetY;

  const sx = (0 - imageLeft) / scale;
  const sy = (0 - imageTop) / scale;
  const sSize = view / scale;

  const canvas = document.createElement('canvas');
  canvas.width = output;
  canvas.height = output;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('CANVAS_UNAVAILABLE');
  }

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, output, output);
  ctx.drawImage(image, sx, sy, sSize, sSize, 0, 0, output, output);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) {
          resolve(result);
          return;
        }
        reject(new Error('BLOB_FAILED'));
      },
      'image/jpeg',
      0.92,
    );
  });

  return new File([blob], fileName.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' });
};
