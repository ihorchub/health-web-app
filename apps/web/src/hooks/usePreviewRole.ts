import { useContext } from 'react';

import { PreviewRoleContext } from '@/context/previewRoleContextInstance';

export const usePreviewRole = () => {
  const context = useContext(PreviewRoleContext);

  if (!context) {
    throw new Error('usePreviewRole must be used within PreviewRoleProvider');
  }

  return context;
};
