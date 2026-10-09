import { useTranslation } from 'react-i18next';

import { PastPageButton, PastPagination } from '@/modules/patient-room/styles';

interface PastVisitsPaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

export const PastVisitsPagination = ({
  page,
  pageCount,
  onChange,
}: PastVisitsPaginationProps) => {
  const { t } = useTranslation('cabinet');

  if (pageCount <= 1) {
    return null;
  }

  return (
    <PastPagination aria-label={t('past.paginationLabel')}>
      {Array.from({ length: pageCount }, (_, index) => {
        const pageNumber = index + 1;
        return (
          <PastPageButton
            key={pageNumber}
            type="button"
            $active={pageNumber === page}
            aria-current={pageNumber === page ? 'page' : undefined}
            aria-label={t('past.page', { page: pageNumber })}
            onClick={() => {
              onChange(pageNumber);
            }}
          >
            {pageNumber}
          </PastPageButton>
        );
      })}
    </PastPagination>
  );
};
