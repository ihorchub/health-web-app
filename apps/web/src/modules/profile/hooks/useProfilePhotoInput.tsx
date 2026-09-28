import { useRef, useState, type ChangeEvent, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { PhotoCropDialog } from '@/modules/profile/components/PhotoCropDialog';

const PHOTO_ACCEPT = 'image/jpeg,image/png,image/webp';
const PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const PHOTO_MAX_BYTES = 10 * 1024 * 1024;

/** Hidden file input + crop dialog + open() for SCR-07 camera button. */
export const useProfilePhotoInput = (
  onSelected: (file: File) => void | Promise<void>,
): { openPicker: () => void; fileInput: ReactElement; cropDialog: ReactElement } => {
  const { t } = useTranslation('profile');
  const inputRef = useRef<HTMLInputElement>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);

  const clearSource = () => {
    setSourceUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return null;
    });
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }
    if (!PHOTO_TYPES.has(file.type)) {
      toast.error(t('photoInvalidType'));
      return;
    }
    if (file.size > PHOTO_MAX_BYTES) {
      toast.error(t('photoTooLarge'));
      return;
    }
    setSourceUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }
      return URL.createObjectURL(file);
    });
  };

  const fileInput = (
    <input
      ref={inputRef}
      type="file"
      accept={PHOTO_ACCEPT}
      hidden
      onChange={onInputChange}
    />
  );

  const cropDialog = (
    <PhotoCropDialog
      open={Boolean(sourceUrl)}
      imageUrl={sourceUrl}
      onCancel={clearSource}
      onConfirm={async (file) => {
        try {
          await onSelected(file);
          clearSource();
        } catch {
          toast.error(t('photoFailed'));
        }
      }}
    />
  );

  return { openPicker, fileInput, cropDialog };
};
