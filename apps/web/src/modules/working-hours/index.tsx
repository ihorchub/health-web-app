import { IconChevronLeft, IconInfoCircle } from '@tabler/icons-react';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTheme } from '@mui/material';

import { useAppRole } from '@/hooks/useAppRole';
import {
  WorkingHoursCalendar,
  WORKING_HOURS_DEMO_TODAY,
  type CalendarSelection,
} from '@/modules/working-hours/components/WorkingHoursCalendar';
import {
  WorkingHoursModals,
  type WorkingHoursModalKind,
} from '@/modules/working-hours/components/WorkingHoursModals';
import { ZoneAPanel } from '@/modules/working-hours/components/ZoneAPanel';
import { ZoneBPanel } from '@/modules/working-hours/components/ZoneBPanel';
import { MOCK_WORKING_HOURS, SCHEDULE_MONTH_OPTIONS } from '@/modules/working-hours/fixtures';
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
import { AppRole } from '@/types/role';
import { AppRoute } from '@/utils/routeUtils/routes';

const LIKA = '/brand/lika-poses/lika2.png';
const LIKA_HELP = '/brand/lika-poses/lika1.png';

const shortDayMonth = (ymd: string, locale: string) =>
  new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(`${ymd}T12:00:00+03:00`));

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
): string => {
  const today = WORKING_HOURS_DEMO_TODAY;
  if (scope === 'custom' && selection.startYmd) {
    return formatRangeLabel(selection, locale);
  }
  if (scope === 'today' || scope === 'rest_of_day') {
    return formatDisplayDate(today, locale);
  }
  if (scope === 'rest_of_week') {
    return locale === 'uk' ? '27 сер – 30 сер 2026' : '27 Aug – 30 Aug 2026';
  }
  return locale === 'uk' ? '1–5 вересня 2026' : '1–5 Sep 2026';
};

export const WorkingHoursPage = () => {
  const { t, i18n } = useTranslation('workingHours');
  const navigate = useNavigate();
  const theme = useTheme();
  const { role } = useAppRole();
  const importantRef = useRef<HTMLDivElement | null>(null);

  const [anchorYm, setAnchorYm] = useState('2026-08');
  const [zoneB, setZoneB] = useState<ZoneBFormState>(MOCK_WORKING_HOURS.zoneB);
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

  const appointmentDays = useMemo(
    () => new Set(MOCK_WORKING_HOURS.appointmentDays),
    [],
  );

  const monthOptions = SCHEDULE_MONTH_OPTIONS.map((option) => ({
    value: option.value,
    label: i18n.language === 'uk' ? option.labelUk : option.labelEn,
  }));

  const zoneBStartLabel = formatDisplayDate(
    MOCK_WORKING_HOURS.zoneBStartYmd,
    i18n.language,
  );
  const zoneBShortLabel = shortDayMonth(MOCK_WORKING_HOURS.zoneBStartYmd, i18n.language);
  const todayShort = shortDayMonth(WORKING_HOURS_DEMO_TODAY, i18n.language);
  const bulkRangeLabel = bulkRangeForScope(bulkScope, i18n.language, selection);
  const vacationBRangeLabel =
    selection.startYmd && selection.startYmd >= MOCK_WORKING_HOURS.zoneBStartYmd
      ? formatRangeLabel(selection, i18n.language)
      : i18n.language === 'uk'
        ? '27 вер – 5 жов'
        : '27 Sep – 5 Oct';

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
      setZoneB((prev) => ({ ...prev, vacationDayOff: false }));
    }
  };

  const confirmModal = () => {
    if (modal === 'bulk') {
      toast.success(t('bulkDone'));
      setVacationEnabled(true);
      setEmptiedDays(
        i18n.language === 'uk' ? ['3 вер', '4 вер'] : ['3 Sep', '4 Sep'],
      );
    } else if (modal === 'saveB') {
      setIsSaving(true);
      window.setTimeout(() => {
        setIsSaving(false);
        toast.success(t('saved'));
      }, 900);
    } else if (modal === 'vacationA' || modal === 'vacationB') {
      toast.success(t('saved'));
    }
    setModal(null);
  };

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
          todayYmd={WORKING_HOURS_DEMO_TODAY}
          appointmentDays={appointmentDays}
          selection={selection}
          onDaySelect={handleDaySelect}
        />

        <ZonesRow>
          <ZoneAPanel
            params={MOCK_WORKING_HOURS.zoneA}
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
            isSaving={isSaving}
            onChange={(patch) => {
              setZoneB((prev) => ({ ...prev, ...patch }));
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
