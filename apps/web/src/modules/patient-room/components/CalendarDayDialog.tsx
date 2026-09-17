import {
  Button,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { SheetDialog } from '@/components/Dialog/SheetDialog';
import { findMockDoctor } from '@/api/mocks/doctorsFixtures';
import {
  CalendarDayList,
  CalendarDayRow,
  CalendarDayRowMeta,
  CalendarDayRowTime,
  CalendarDaySectionTitle,
  CalendarGrid,
  CalendarHeader,
  CalendarMonth,
  CalendarShell,
  DayCell,
  DayModalActions,
  DayModalTitleRow,
  WeekdayCell,
} from '@/modules/patient-room/styles';
import type { CabinetAppointment } from '@/modules/patient-room/types';
import {
  appointmentDays,
  appointmentsOnDay,
} from '@/modules/patient-room/utils/appointmentsByDay';
import { formatTime } from '@/modules/patient-room/utils/formatCabinetDate';
import { AppRoute } from '@/utils/routeUtils/routes';

const WEEKDAYS_UK = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'нд'];
const WEEKDAYS_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

interface CalendarDayDialogProps {
  open: boolean;
  initialYmd: string | null;
  appointments: CabinetAppointment[];
  onClose: () => void;
  onOpenVisit: (visit: CabinetAppointment) => void;
}

export const CalendarDayDialog = ({
  open,
  initialYmd,
  appointments,
  onClose,
  onOpenVisit,
}: CalendarDayDialogProps) => {
  const { t, i18n } = useTranslation(['cabinet', 'search']);
  const navigate = useNavigate();
  const markedDays = useMemo(() => appointmentDays(appointments), [appointments]);

  const [selectedYmd, setSelectedYmd] = useState(initialYmd ?? '2026-08-27');
  const [monthOffset, setMonthOffset] = useState(0);

  useEffect(() => {
    if (open && initialYmd) {
      setSelectedYmd(initialYmd);
      setMonthOffset(0);
    }
  }, [initialYmd, open]);

  const viewDate = useMemo(() => {
    const base = new Date(`${selectedYmd}T12:00:00+03:00`);
    return new Date(base.getFullYear(), base.getMonth() + monthOffset, 1);
  }, [monthOffset, selectedYmd]);

  const monthLabel = new Intl.DateTimeFormat(i18n.language === 'uk' ? 'uk-UA' : 'en-GB', {
    month: 'long',
    year: 'numeric',
  }).format(viewDate);

  const calendarCells = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ day: number | null; ymd: string | null }> = [];

    for (let index = 0; index < startOffset; index += 1) {
      cells.push({ day: null, ymd: null });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const ymd = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({ day, ymd });
    }

    return cells;
  }, [viewDate]);

  const weekdays = i18n.language === 'uk' ? WEEKDAYS_UK : WEEKDAYS_EN;
  const dayVisits = useMemo(
    () => appointmentsOnDay(appointments, selectedYmd),
    [appointments, selectedYmd],
  );

  const dayHeading = new Intl.DateTimeFormat(i18n.language === 'uk' ? 'uk-UA' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${selectedYmd}T12:00:00+03:00`));

  return (
    <SheetDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <DialogTitle>
        <DayModalTitleRow>
          <div>
            <CalendarDaySectionTitle>{t('cabinet:dayModal.eyebrow')}</CalendarDaySectionTitle>
            <div>{t('cabinet:dayModal.title')}</div>
            <CalendarDayRowMeta>
              {t('cabinet:dayModal.visitCount', { count: dayVisits.length })}
            </CalendarDayRowMeta>
          </div>
          <IconButton aria-label={t('cabinet:dayModal.close')} onClick={onClose} size="small">
            <IconX size={20} />
          </IconButton>
        </DayModalTitleRow>
      </DialogTitle>
      <DialogContent>
        <CalendarShell>
          <CalendarHeader>
            <button
              type="button"
              aria-label={t('cabinet:dayModal.prevMonth')}
              onClick={() => {
                setMonthOffset((value) => value - 1);
              }}
            >
              <IconChevronLeft size={18} />
            </button>
            <CalendarMonth>{monthLabel}</CalendarMonth>
            <button
              type="button"
              aria-label={t('cabinet:dayModal.nextMonth')}
              onClick={() => {
                setMonthOffset((value) => value + 1);
              }}
            >
              <IconChevronRight size={18} />
            </button>
          </CalendarHeader>
          <CalendarGrid>
            {weekdays.map((label) => (
              <WeekdayCell key={label}>{label}</WeekdayCell>
            ))}
            {calendarCells.map((cell, index) => (
              <DayCell
                key={cell.ymd ?? `empty-${index}`}
                type="button"
                disabled={!cell.day}
                $muted={!cell.day}
                $today={cell.ymd === '2026-08-27'}
                $marked={cell.ymd ? markedDays.includes(cell.ymd) : false}
                $selected={cell.ymd === selectedYmd}
                onClick={() => {
                  if (cell.ymd) {
                    setSelectedYmd(cell.ymd);
                    setMonthOffset(0);
                  }
                }}
              >
                {cell.day ?? ''}
              </DayCell>
            ))}
          </CalendarGrid>
        </CalendarShell>

        <CalendarDaySectionTitle>{dayHeading}</CalendarDaySectionTitle>
        <CalendarDayRowMeta>
          {t('cabinet:dayModal.yourVisits', { count: dayVisits.length })}
        </CalendarDayRowMeta>

        <CalendarDayList>
          {dayVisits.length > 0 ? (
            dayVisits.map((visit) => {
              const doctor = findMockDoctor(visit.doctorId);
              const doctorName = doctor
                ? `${doctor.firstName} ${doctor.lastName}`
                : visit.doctorId;
              const specialty = doctor ? t(`search:specialties.${doctor.specialty}`) : '';

              return (
                <CalendarDayRow key={visit.id}>
                  <div>
                    <CalendarDayRowTime>
                      {formatTime(visit.startsAt, i18n.language)} · {visit.durationMinutes}{' '}
                      {t('cabinet:dayModal.minutesShort')}
                    </CalendarDayRowTime>
                    <strong>{doctorName}</strong>
                    <CalendarDayRowMeta>
                      {t(`cabinet:format.${visit.format}`)} · {specialty} ·{' '}
                      {t('cabinet:demoClinic')}
                    </CalendarDayRowMeta>
                  </div>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={() => {
                      onOpenVisit(visit);
                    }}
                  >
                    {t('cabinet:dayModal.details')}
                  </Button>
                </CalendarDayRow>
              );
            })
          ) : (
            <CalendarDayRowMeta>{t('cabinet:dayModal.noVisits')}</CalendarDayRowMeta>
          )}
        </CalendarDayList>
      </DialogContent>
      <DayModalActions>
        <CalendarDayRowMeta>{t('cabinet:dayModal.bookNew')}</CalendarDayRowMeta>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onClose();
            void navigate(AppRoute.HOME);
          }}
        >
          {t('cabinet:findDoctor')}
        </Button>
      </DayModalActions>
    </SheetDialog>
  );
};
