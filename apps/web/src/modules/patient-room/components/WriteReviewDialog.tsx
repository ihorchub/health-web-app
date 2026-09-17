import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  styled,
} from '@mui/material';
import { IconStarFilled } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SheetDialog } from '@/components/Dialog/SheetDialog';

const ReviewDialogContent = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  paddingTop: theme.spacing(1),
}));

const StarsRow = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0.5),
}));

const StarButton = styled('button')<{ $active: boolean }>(({ theme, $active }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  backgroundColor: $active ? theme.palette.action.selected : 'transparent',
  color: theme.palette.primary.main,
}));

interface WriteReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, text: string) => void;
}

export const WriteReviewDialog = ({ open, onClose, onSubmit }: WriteReviewDialogProps) => {
  const { t } = useTranslation('cabinet');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  const handleClose = () => {
    setRating(5);
    setText('');
    onClose();
  };

  return (
    <SheetDialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('reviewModal.title')}</DialogTitle>
      <ReviewDialogContent>
        <span>{t('reviewModal.rating')}</span>
        <StarsRow>
          {Array.from({ length: 5 }).map((_, index) => {
            const value = index + 1;
            return (
              <StarButton
                key={value}
                type="button"
                $active={value <= rating}
                aria-label={`${value}`}
                onClick={() => {
                  setRating(value);
                }}
              >
                <IconStarFilled size={22} opacity={value <= rating ? 1 : 0.25} />
              </StarButton>
            );
          })}
        </StarsRow>
        <TextField
          label={t('reviewModal.textLabel')}
          placeholder={t('reviewModal.textPlaceholder')}
          multiline
          minRows={3}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
          }}
        />
      </ReviewDialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('reviewModal.cancel')}</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onSubmit(rating, text);
            handleClose();
          }}
        >
          {t('reviewModal.submit')}
        </Button>
      </DialogActions>
    </SheetDialog>
  );
};
