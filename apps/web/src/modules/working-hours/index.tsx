import { IconChevronLeft, IconInfoCircle } from '@tabler/icons-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTheme } from '@mui/material';

import {
  useGetDoctorSchedule,
  usePatchDoctorSchedule,
  usePostBulkCancel,
} from '@/api/doctors';
import { todayDoctorDayYmd } from '@/modules/doctor-day/utils/mapDashboard';
import { useAppRole } from '@/hooks/useAppRole';
import {
  WorkingHoursCalendar,
  type CalendarSelection,
} from '@/modules/working-hours/components/WorkingHoursCalendar';
import {
  WorkingHoursModals,
  type WorkingHoursModalKind,
} from '@/modules/working-hours/components/WorkingHoursModals';
import { ZoneAPanel } from '@/modules/working-hours/components/ZoneAPanel';
import { ZoneBPanel } from '@/modules/working-hours/components/ZoneBPanel';
import {
  BackLink,
  Content,
  HelpLink,
  HelpMascot,
  ImportantCopy,
  ImportantStrip,
  Mascot,
  MenuItem,
  MonthRow,
  MonthSelect,
  HintBanner,
  Page,
  PageIntro,
  PageSubtitle,
  PageTitle,
  TitleBlock,
  TitleRow,
  ZonesRow,
} from '@/modules/working-hours/styles';
import type { BulkCancelScope, ZoneBFormState } from '@/modules/working-hours/types';
import { formatDisplayDate } from '@/modules/working-hours/utils/calendarGrid';
import {
  buildMonthOptions,
  mapScheduleToWorkingHours,
  mapUiBulkScope,
  zoneBFormToPatch,
} from '@/modules/working-hours/utils/mapSchedule';
import { AppRole } from '@/types/role';
import { AppRoute } from '@/utils/routeUtils/routes';

const LIKA = '/brand/lika-poses/lika2.png';
const LIKA_HELP = '/brand/lika-poses/lika1.png';

const shortDayMonth = (ymd: string, locale: string) =>
  new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${ymd}T12:00:00+03:00`));

const addDaysYmd = (ymd: string, days: number) => {
  const date = new Date(`${ymd}T12:00:00+03:00`);
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const endOfWeekYmd = (ymd: string) => {
  const date = new Date(`${ymd}T12:00:00+03:00`);
  const day = date.getDay();
  const daysUntilSunday = day === 0 ? 0 : 7 - day;
  return addDaysYmd(ymd, daysUntilSunday);
};

const formatRangeLabel = (selection: CalendarSelection, locale: string) => {
  const { startYmd, endYmd } = selection;
  if (!startYmd) {
    return '';
  }
  if (!endYmd || endYmd === startYmd) {
    return formatDisplayDate(startYmd, locale);
  }
  const from = startYmd < endYmd ? startYmd : endYmd;
  const to = startYmd < endYmd ? endYmd : startYmd;
  return `${formatDisplayDate(from, locale)} – ${formatDisplayDate(to, locale)}`;
};

const bulkRangeForScope = (
  scope: BulkCancelScope,
  locale: string,
  selection: CalendarSelection,
  todayYmd: string,
): string => {
  if (scope === 'custom' && selection.startYmd) {
    return formatRangeLabel(selection, locale);
  }
  if (scope === 'today' || scope === 'rest_of_day') {
    return formatDisplayDate(todayYmd, locale);
  }
  if (scope === 'rest_of_week') {
    return `${formatDisplayDate(todayYmd, locale)} – ${formatDisplayDate(endOfWeekYmd(todayYmd), locale)}`;
  }
  return formatRangeLabel(selection, locale) || formatDisplayDate(todayYmd, locale);
};

export const WorkingHoursPage = () => {
  const { t, i18n } = useTranslation('workingHours');
  const navigate = useNavigate();
  const theme = useTheme();
  const { role } = useAppRole();
  const importantRef = useRef<HTMLDivElement | null>(null);

  const scheduleQuery = useGetDoctorSchedule({ enabled: role === AppRole.DOCTOR });
  const patchScheduleMutation = usePatchDoctorSchedule();
  const bulkCancelMutation = usePostBulkCancel();

  const settings = useMemo(
    () => (scheduleQuery.data ? mapScheduleToWorkingHours(scheduleQuery.data) : null),
    [scheduleQuery.data],
  );

  const todayYmd = todayDoctorDayYmd();
  const [anchorYm, setAnchorYm] = useState<string | null>(null);
  const [zoneB, setZoneB] = useState<ZoneBFormState | null>(null);
  const [bulkScope, setBulkScope] = useState<BulkCancelScope>('today');
  const [cancelReason, setCancelReason] = useState('');
  const [modal, setModal] = useState<WorkingHoursModalKind>(null);
  const [vacationEnabled, setVacationEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [emptiedDays, setEmptiedDays] = useState<string[]>([]);
  const [selection, setSelection] = useState<CalendarSelection>({
    startYmd: null,
    endYmd: null,
  });

  useEffect(() => {
    if (!settings) {
      return;
    }
    setZoneB(settings.zoneB);
    setAnchorYm((current) => current ?? settings.zoneAStartYmd.slice(0, 7));
  }, [settings]);

  const monthOptions = useMemo(() => {
    if (!scheduleQuery.data) {
      return [];
    }
    return buildMonthOptions(scheduleQuery.data.zoneAStart, scheduleQuery.data.zoneBEnd).map(
      (option) => ({
        value: option.value,
        label: i18n.language === 'uk' ? option.labelUk : option.labelEn,
      }),
    );
  }, [scheduleQuery.data, i18n.language]);

  const appointmentDays = useMemo(
    () => new Set(settings?.appointmentDays ?? []),
    [settings],
  );

  if (role !== AppRole.DOCTOR) {
    return (
      <Page>
        <Content>
          <PageTitle>{t('title')}</PageTitle>
          <PageSubtitle>{t('subtitle')}</PageSubtitle>
        </Content>
      </Page>
    );
  }

  if (!settings || !zoneB || !anchorYm || !scheduleQuery.data) {
    return null;
  }

  const zoneBStartLabel = formatDisplayDate(settings.zoneBStartYmd, i18n.language);
  const zoneBShortLabel = shortDayMonth(settings.zoneBStartYmd, i18n.language);
  const todayShort = shortDayMonth(todayYmd, i18n.language);
  const bulkRangeLabel = bulkRangeForScope(bulkScope, i18n.language, selection, todayYmd);
  const vacationBRangeLabel =
    selection.startYmd && selection.startYmd >= settings.zoneBStartYmd
      ? formatRangeLabel(selection, i18n.language)
      : `${shortDayMonth(settings.zoneBStartYmd, i18n.language)} – ${shortDayMonth(scheduleQuery.data.zoneBEnd, i18n.language)}`;

  const handleDaySelect = (ymd: string, zone: 'a' | 'b') => {
    if (zone === 'a') {
      setBulkScope('custom');
    }

    setSelection((prev) => {
      if (!prev.startYmd || (prev.startYmd && prev.endYmd)) {
        return { startYmd: ymd, endYmd: null };
      }
      if (ymd === prev.startYmd) {
        return { startYmd: ymd, endYmd: ymd };
      }
      return { startYmd: prev.startYmd, endYmd: ymd };
    });
  };

  const closeModal = () => {
    setModal(null);
    if (modal === 'vacationB') {
      setZoneB((prev) => (prev ? { ...prev, vacationDayOff: false } : prev));
    }
  };

  const confirmModal = () => {
    if (modal === 'bulk') {
      const from =
        bulkScope === 'custom'
          ? selection.startYmd && selection.endYmd
            ? selection.startYmd < selection.endYmd
              ? selection.startYmd
              : selection.endYmd
            : selection.startYmd ?? todayYmd
          : undefined;
      const to =
        bulkScope === 'custom'
          ? selection.startYmd && selection.endYmd
            ? selection.startYmd < selection.endYmd
              ? selection.endYmd
              : selection.startYmd
            : selection.startYmd ?? todayYmd
          : undefined;

      bulkCancelMutation.mutate(
        {
          scope: mapUiBulkScope(bulkScope),
          ...(from ? { from } : {}),
          ...(to ? { to } : {}),
          confirm: true,
        },
        {
          onSuccess: () => {
            toast.success(t('bulkDone'));
            setVacationEnabled(true);
            if (from && to) {
              setEmptiedDays(
                [from, to].map((ymd) => shortDayMonth(ymd, i18n.language)),
              );
            } else {
              setEmptiedDays([shortDayMonth(todayYmd, i18n.language)]);
            }
          },
        },
      );
    } else if (modal === 'saveB') {
      setIsSaving(true);
      patchScheduleMutation.mutate(zoneBFormToPatch(zoneB, scheduleQuery.data), {
        onSuccess: () => {
          setIsSaving(false);
          toast.success(t('saved'));
        },
        onError: () => {
          setIsSaving(false);
        },
      });
    } else if (modal === 'vacationA' || modal === 'vacationB') {
      toast.success(t('saved'));
    }
    setModal(null);
  };

  return (
    <Page>
      <Content>
        <PageIntro>
          <BackLink
            type="button"
            onClick={() => {
              void navigate(AppRoute.DOCTOR_DAY);
            }}
          >
            <IconChevronLeft size={16} />
            {t('backToDay')}
          </BackLink>

          <TitleRow>
            <TitleBlock>
              <PageTitle>{t('title')}</PageTitle>
              <PageSubtitle>{t('subtitle')}</PageSubtitle>
            </TitleBlock>
            <HelpLink
              type="button"
              onClick={() => {
                importantRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <HelpMascot src={LIKA_HELP} alt="" />
              <IconInfoCircle size={16} />
              {t('howItWorks')}
            </HelpLink>
          </TitleRow>

          <MonthRow>
            <MonthSelect
              select
              size="small"
              label={t('monthLabel')}
              value={anchorYm}
              onChange={(event) => {
                setAnchorYm(event.target.value);
              }}
            >
              {monthOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </MonthSelect>
            <HintBanner>
              <IconInfoCircle
                size={18}
                color={theme.palette.mode === 'light' ? '#4A3836' : '#C9A39E'}
              />
              <span>{t('monthHint')}</span>
            </HintBanner>
          </MonthRow>
        </PageIntro>

        <WorkingHoursCalendar
          anchorYm={anchorYm}
          todayYmd={todayYmd}
          zoneAStartYmd={settings.zoneAStartYmd}
          zoneAEndYmd={settings.zoneAEndYmd}
          zoneBStartYmd={settings.zoneBStartYmd}
          appointmentDays={appointmentDays}
          selection={selection}
          onDaySelect={handleDaySelect}
        />

        <ZonesRow>
          <ZoneAPanel
            params={settings.zoneA}
            todayShort={todayShort}
            bulkScope={bulkScope}
            onBulkScopeChange={setBulkScope}
            cancelReason={cancelReason}
            onCancelReasonChange={setCancelReason}
            vacationEnabled={vacationEnabled}
            onBulkClick={() => {
              setModal('bulk');
            }}
            onVacationClick={() => {
              setModal('vacationA');
            }}
          />
          <ZoneBPanel
            form={zoneB}
            locale={i18n.language}
            zoneBStartYmd={settings.zoneBStartYmd}
            isSaving={isSaving}
            onChange={(patch) => {
              setZoneB((prev) => (prev ? { ...prev, ...patch } : prev));
            }}
            onSaveClick={() => {
              setModal('saveB');
            }}
            onVacationToggleOn={() => {
              setModal('vacationB');
            }}
          />
        </ZonesRow>

        <ImportantStrip ref={importantRef}>
          <Mascot src={LIKA} alt="" />
          <ImportantCopy>
            <strong>{t('important.title')}</strong>
            <ul>
              <li>{t('important.b1')}</li>
              <li>{t('important.b2')}</li>
              <li>{t('important.b3')}</li>
            </ul>
          </ImportantCopy>
        </ImportantStrip>
      </Content>

      <WorkingHoursModals
        kind={modal}
        zoneBStartLabel={zoneBStartLabel}
        zoneBShortLabel={zoneBShortLabel}
        bulkRangeLabel={bulkRangeLabel}
        bulkCount={bulkScope === 'custom' ? 12 : bulkScope === 'rest_of_week' ? 8 : 3}
        emptiedDays={emptiedDays}
        vacationBRangeLabel={vacationBRangeLabel}
        zoneBForm={zoneB}
        formatLabel={t(`format.${zoneB.format}`)}
        onClose={closeModal}
        onConfirm={confirmModal}
      />
    </Page>
  );
};
