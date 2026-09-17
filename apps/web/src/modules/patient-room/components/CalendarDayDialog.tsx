import { IconChevronLeft, IconChevronRight, IconX } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { findMockDoctor } from '@/api/mocks/doctorsFixtures';
import {
  CalendarDayList,
  CalendarDayRow,
  CalendarDayRowDetails,
  CalendarDayRowDoctor,
  CalendarDayRowDuration,
  CalendarDayRowFormat,
  CalendarDayRowMain,
  CalendarDayRowMeta,
  CalendarDayRowNameLine,
  CalendarDayRowTime,
  CalendarDayRowTimeCol,
  CalendarGrid,
  CalendarHeader,
  CalendarMonth,
  DayCell,
  DayModalActions,
  DayModalBody,
  DayModalBookHint,
  DayModalCount,
  DayModalDayHeading,
  DayModalDayMeta,
  DayModalDialogRoot,
  DayModalHeader,
  DayModalLegend,
  DayModalLegendDot,
  DayModalLegendItem,
  DayModalMonthCard,
  DayModalMonthsRow,
  DayModalOverline,
  DayModalSlotChip,
  DayModalSlotChips,
  DayModalSlotsBlock,
  DayModalTitle,
  OutlineButton,
  VisitDetailClose,
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

const buildMonthCells = (viewDate: Date) => {
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

  while (cells.length % 7 !== 0) {
    cells.push({ day: null, ymd: null });
  }

  return cells;
};

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
  const weekdays = i18n.language === 'uk' ? WEEKDAYS_UK : WEEKDAYS_EN;

  const [selectedYmd, setSelectedYmd] = useState(initialYmd ?? '2026-08-27');
  const [anchorMonth, setAnchorMonth] = useState(() => {
    const base = new Date(`${initialYmd ?? '2026-08-27'}T12:00:00+03:00`);
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [activeVisitId, setActiveVisitId] = useState<string | null>(null);

  useEffect(() => {
    if (open && initialYmd) {
      setSelectedYmd(initialYmd);
      const base = new Date(`${initialYmd}T12:00:00+03:00`);
      setAnchorMonth(new Date(base.getFullYear(), base.getMonth(), 1));
    }
  }, [initialYmd, open]);

  const secondMonth = useMemo(
    () => new Date(anchorMonth.getFullYear(), anchorMonth.getMonth() + 1, 1),
    [anchorMonth],
  );

  const months = useMemo(
    () => [
      { date: anchorMonth, cells: buildMonthCells(anchorMonth) },
      { date: secondMonth, cells: buildMonthCells(secondMonth) },
    ],
    [anchorMonth, secondMonth],
  );

  const dayVisits = useMemo(
    () => appointmentsOnDay(appointments, selectedYmd),
    [appointments, selectedYmd],
  );

  useEffect(() => {
    setActiveVisitId(dayVisits[0]?.id ?? null);
  }, [dayVisits]);

  const dayHeading = new Intl.DateTimeFormat(i18n.language === 'uk' ? 'uk-UA' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
  }).format(new Date(`${selectedYmd}T12:00:00+03:00`));

  const formatMonthLabel = (date: Date) =>
    new Intl.DateTimeFormat(i18n.language === 'uk' ? 'uk-UA' : 'en-GB', {
      month: 'long',
      year: 'numeric',
    }).format(date);

  const shiftMonths = (delta: number) => {
    setAnchorMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  return (
    <DayModalDialogRoot open={open} onClose={onClose} fullWidth scroll="paper">
      <DayModalHeader>
        <div>
          <DayModalOverline>{t('cabinet:dayModal.eyebrow')}</DayModalOverline>
          <DayModalTitle>{t('cabinet:dayModal.title')}</DayModalTitle>
          <DayModalCount>
            {t('cabinet:dayModal.visitCount', { count: dayVisits.length })}
          </DayModalCount>
        </div>
        <VisitDetailClose
          type="button"
          aria-label={t('cabinet:dayModal.close')}
          onClick={onClose}
        >
          <IconX size={18} stroke={1.8} />
        </VisitDetailClose>
      </DayModalHeader>

      <DayModalBody>
        <DayModalMonthsRow>
          {months.map((month, monthIndex) => (
            <DayModalMonthCard key={month.date.toISOString()}>
              <CalendarHeader>
                <button
                  type="button"
                  aria-label={t('cabinet:dayModal.prevMonth')}
                  onClick={() => {
                    shiftMonths(-1);
                  }}
                >
                  <IconChevronLeft size={18} />
                </button>
                <CalendarMonth>{formatMonthLabel(month.date)}</CalendarMonth>
                <button
                  type="button"
                  aria-label={t('cabinet:dayModal.nextMonth')}
                  onClick={() => {
                    shiftMonths(1);
                  }}
                >
                  <IconChevronRight size={18} />
                </button>
              </CalendarHeader>
              <CalendarGrid>
                {weekdays.map((label) => (
                  <WeekdayCell key={`${month.date.toISOString()}-${label}`}>{label}</WeekdayCell>
                ))}
                {month.cells.map((cell, index) => (
                  <DayCell
                    key={cell.ymd ?? `empty-${monthIndex}-${index}`}
                    type="button"
                    disabled={!cell.day}
                    $muted={!cell.day}
                    $today={cell.ymd === '2026-08-27'}
                    $marked={cell.ymd ? markedDays.includes(cell.ymd) : false}
                    $selected={cell.ymd === selectedYmd}
                    onClick={() => {
                      if (cell.ymd) {
                        setSelectedYmd(cell.ymd);
                      }
                    }}
                  >
                    {cell.day ?? ''}
                  </DayCell>
                ))}
              </CalendarGrid>
            </DayModalMonthCard>
          ))}
        </DayModalMonthsRow>

        <DayModalLegend>
          <DayModalLegendItem>
            <DayModalLegendDot $tone="selected" />
            {t('cabinet:dayModal.legendSelected')}
          </DayModalLegendItem>
          <DayModalLegendItem>
            <DayModalLegendDot $tone="visit" />
            {t('cabinet:dayModal.legendVisit')}
          </DayModalLegendItem>
        </DayModalLegend>

        <DayModalSlotsBlock>
          <div>
            <DayModalDayHeading>{dayHeading}</DayModalDayHeading>
            <DayModalDayMeta>
              {t('cabinet:dayModal.yourVisits', { count: dayVisits.length })}
            </DayModalDayMeta>
          </div>

          {dayVisits.length > 0 ? (
            <DayModalSlotChips>
              {dayVisits.map((visit) => (
                <DayModalSlotChip
                  key={`chip-${visit.id}`}
                  type="button"
                  $active={visit.id === activeVisitId}
                  onClick={() => {
                    setActiveVisitId(visit.id);
                  }}
                >
                  {formatTime(visit.startsAt, i18n.language)}
                </DayModalSlotChip>
              ))}
            </DayModalSlotChips>
          ) : null}
        </DayModalSlotsBlock>

        <CalendarDayList>
          {dayVisits.length > 0 ? (
            dayVisits.map((visit) => {
              const doctor = findMockDoctor(visit.doctorId);
              const doctorName = doctor
                ? t('cabinet:visitModal.doctorName', {
                    name: `${doctor.firstName} ${doctor.lastName}`,
                  })
                : visit.doctorId;
              const specialty = doctor ? t(`search:specialties.${doctor.specialty}`) : '';

              return (
                <CalendarDayRow key={visit.id} $active={visit.id === activeVisitId}>
                  <CalendarDayRowTimeCol>
                    <CalendarDayRowTime>
                      {formatTime(visit.startsAt, i18n.language)}
                    </CalendarDayRowTime>
                    <CalendarDayRowDuration>
                      {visit.durationMinutes} {t('cabinet:dayModal.minutesShort')}
                    </CalendarDayRowDuration>
                  </CalendarDayRowTimeCol>
                  <CalendarDayRowMain>
                    <CalendarDayRowNameLine>
                      <CalendarDayRowDoctor>{doctorName}</CalendarDayRowDoctor>
                      <CalendarDayRowFormat>
                        {t(`cabinet:format.${visit.format}`)}
                      </CalendarDayRowFormat>
                    </CalendarDayRowNameLine>
                    <CalendarDayRowMeta>
                      {specialty} · {t('cabinet:demoClinic')}
                    </CalendarDayRowMeta>
                  </CalendarDayRowMain>
                  <CalendarDayRowDetails
                    type="button"
                    onClick={() => {
                      onOpenVisit(visit);
                    }}
                  >
                    {t('cabinet:dayModal.details')}
                  </CalendarDayRowDetails>
                </CalendarDayRow>
              );
            })
          ) : (
            <CalendarDayRowMeta>{t('cabinet:dayModal.noVisits')}</CalendarDayRowMeta>
          )}
        </CalendarDayList>
      </DayModalBody>

      <DayModalActions>
        <DayModalBookHint>{t('cabinet:dayModal.bookNew')}</DayModalBookHint>
        <OutlineButton
          variant="outlined"
          color="primary"
          onClick={() => {
            onClose();
            void navigate(AppRoute.HOME);
          }}
        >
          {t('cabinet:findDoctor')}
        </OutlineButton>
      </DayModalActions>
    </DayModalDialogRoot>
  );
};
