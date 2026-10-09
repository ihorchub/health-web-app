import { IconChevronLeft, IconInfoCircle } from '@tabler/icons-react';
import { CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useGetDoctorSchedule,
  usePatchDoctorSchedule,
  usePostBulkCancel,
  type DoctorScheduleResponse,
} from '@/api/doctors';
import {
  postBulkCancel,
  type BulkCancelBody,
} from '@/api/doctors/schedule';
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
import {
  ZoneAPanel,
  type ZoneAVacationMode,
} from '@/modules/working-hours/components/ZoneAPanel';
import { PlannedSchedulesSection } from '@/modules/working-hours/components/PlannedSchedulesSection';
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
  ScheduleLoading,
  TitleBlock,
  TitleRow,
  ZonesRow,
} from '@/modules/working-hours/styles';
import type {
  BulkCancelScope,
  ZoneAParams,
  ZoneBFormState,
} from '@/modules/working-hours/types';
import {
  DEFAULT_WORKING_DAYS,
  WEEKDAY_KEYS,
  formatDisplayDate,
  jsDayToWeekdayKey,
  weekdayOfYmd,
  type WorkingDaysSelection,
} from '@/modules/working-hours/utils/calendarGrid';
import {
  buildMonthOptions,
  buildPlannedOverrideDays,
  findOverrideForSelection,
  listYmdsInInclusiveRange,
  mapScheduleToWorkingHours,
  overrideToFormPatch,
  overrideToSavedInfo,
  workingDaysFromTemplate,
  zoneBFormToRangePatch,
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

const listYmdsInRange = (startYmd: string, endYmd: string) => {
  const from = startYmd <= endYmd ? startYmd : endYmd;
  const to = startYmd <= endYmd ? endYmd : startYmd;
  const days: string[] = [];
  let cursor = from;
  while (cursor <= to) {
    days.push(cursor);
    cursor = addDaysYmd(cursor, 1);
  }
  return days;
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

/** Build bulk-cancel request fields from the Zone A radios + calendar selection. */
const resolveBulkCancelBody = (
  bulkScope: BulkCancelScope,
  selection: CalendarSelection,
  todayYmd: string,
  confirm: boolean,
): BulkCancelBody => {
  if (bulkScope === 'today') {
    return { scope: 'whole_day', from: todayYmd, confirm };
  }
  if (bulkScope === 'rest_of_day') {
    return { scope: 'rest_of_day', confirm };
  }
  if (bulkScope === 'rest_of_week') {
    return { scope: 'rest_of_week', confirm };
  }
  const start = selection.startYmd ?? todayYmd;
  const end = selection.endYmd ?? selection.startYmd ?? todayYmd;
  const from = start <= end ? start : end;
  const to = start <= end ? end : start;
  return { scope: 'custom_range', from, to, confirm };
};

export const WorkingHoursPage = () => {
  const { t, i18n } = useTranslation('workingHours');
  const navigate = useNavigate();
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
  /** Frozen Zone A display — never tied to live Zone B form edits or Zone B saves. */
  const [zoneAFrozen, setZoneAFrozen] = useState<ZoneAParams | null>(null);
  const [bulkScope, setBulkScope] = useState<BulkCancelScope>('today');
  const [cancelReason, setCancelReason] = useState('');
  const [modal, setModal] = useState<WorkingHoursModalKind>(null);
  const [vacationUnlockedAfterCancel, setVacationUnlockedAfterCancel] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  /** YYYY-MM-DD days ready for Zone A vacation mark (after cancel or empty calendar pick). */
  const [emptiedDayYmds, setEmptiedDayYmds] = useState<string[]>([]);
  const [selection, setSelection] = useState<CalendarSelection>({
    startYmd: null,
    endYmd: null,
  });
  const [workingDays, setWorkingDays] = useState<WorkingDaysSelection>(DEFAULT_WORKING_DAYS);
  const [workingDaysHydrated, setWorkingDaysHydrated] = useState(false);
  const [exceptionPickMode, setExceptionPickMode] = useState(false);

  // Adjust state during render when schedule first loads (React-recommended; eslint forbids setState-in-effect).
  if (settings) {
    if (zoneAFrozen === null) {
      setZoneAFrozen(settings.zoneA);
    }
    if (zoneB === null) {
      setZoneB(settings.zoneB);
    }
    if (anchorYm === null) {
      setAnchorYm(settings.zoneAStartYmd.slice(0, 7));
    }
  }

  if (scheduleQuery.data && !workingDaysHydrated) {
    setWorkingDays(workingDaysFromTemplate(scheduleQuery.data.weeklyTemplate));
    setWorkingDaysHydrated(true);
  }

  const bulkPreviewBody = useMemo(
    () => resolveBulkCancelBody(bulkScope, selection, todayYmd, false),
    [bulkScope, selection.startYmd, selection.endYmd, todayYmd],
  );

  const bulkPreviewQuery = useQuery({
    queryKey: ['doctorSchedule', 'bulkCancelPreview', bulkPreviewBody],
    queryFn: () => postBulkCancel(bulkPreviewBody),
    enabled: modal === 'bulk',
  });
  const bulkCount = bulkPreviewQuery.data?.matchedCount ?? 0;

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
  const vacationDays = useMemo(
    () => new Set(settings?.vacationDates ?? []),
    [settings],
  );
  const zoneBOverrides = scheduleQuery.data?.zoneBOverrides;
  const plannedDays = useMemo(
    () => buildPlannedOverrideDays(zoneBOverrides ?? []),
    [zoneBOverrides],
  );
  const selectedZoneBDays = useMemo(() => {
    if (!selection.startYmd || !settings) {
      return [] as string[];
    }
    const end = selection.endYmd ?? selection.startYmd;
    return listYmdsInRange(selection.startYmd, end).filter(
      (ymd) => ymd >= settings.zoneBStartYmd,
    );
  }, [selection, settings]);
  const selectedOverride = useMemo(
    () => findOverrideForSelection(zoneBOverrides ?? [], selectedZoneBDays),
    [zoneBOverrides, selectedZoneBDays],
  );
  const loadedOverrideKeyRef = useRef('');

  useEffect(() => {
    if (!selectedOverride || selectedZoneBDays.length === 0) {
      loadedOverrideKeyRef.current = '';
      return;
    }
    const key = `${selectedOverride.from}|${selectedOverride.to}|${selection.startYmd}|${selection.endYmd}`;
    if (loadedOverrideKeyRef.current === key) {
      return;
    }
    loadedOverrideKeyRef.current = key;
    setZoneB((prev) =>
      prev ? { ...prev, ...overrideToFormPatch(selectedOverride, prev) } : prev,
    );
  }, [selectedOverride, selectedZoneBDays.length, selection.startYmd, selection.endYmd]);

  const zoneBEndYmd = scheduleQuery.data?.zoneBEnd ?? '';
  const zoneBStartYmd = settings?.zoneBStartYmd ?? '';
  const regularOffDays = useMemo(() => {
    const set = new Set<string>();
    if (!zoneBStartYmd || !zoneBEndYmd) {
      return set;
    }
    for (const ymd of listYmdsInInclusiveRange(zoneBStartYmd, zoneBEndYmd)) {
      const key = jsDayToWeekdayKey(weekdayOfYmd(ymd));
      if (!workingDays[key]) {
        set.add(ymd);
      }
    }
    return set;
  }, [zoneBStartYmd, zoneBEndYmd, workingDays]);
  const zoneBExceptions = useMemo(() => {
    if (!zoneBStartYmd || !zoneBEndYmd || !scheduleQuery.data) {
      return [] as Array<{ ymd: string; label: string }>;
    }
    return (scheduleQuery.data.vacationDates ?? [])
      .filter((ymd) => ymd >= zoneBStartYmd && ymd <= zoneBEndYmd)
      .filter((ymd) => workingDays[jsDayToWeekdayKey(weekdayOfYmd(ymd))])
      .map((ymd) => ({
        ymd,
        label: formatDisplayDate(ymd, i18n.language),
      }));
  }, [scheduleQuery.data, zoneBStartYmd, zoneBEndYmd, workingDays, i18n.language]);

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
    return (
      <Page>
        <Content>
          <ScheduleLoading aria-live="polite">
            <CircularProgress size={32} />
            {t('loading')}
          </ScheduleLoading>
        </Content>
      </Page>
    );
  }

  const zoneBShortLabel = shortDayMonth(settings.zoneBStartYmd, i18n.language);
  const todayShort = shortDayMonth(todayYmd, i18n.language);
  const bulkRangeLabel = bulkRangeForScope(bulkScope, i18n.language, selection, todayYmd);
  const vacationBRangeLabel =
    selection.startYmd && selection.startYmd >= settings.zoneBStartYmd
      ? formatRangeLabel(selection, i18n.language)
      : `${shortDayMonth(settings.zoneBStartYmd, i18n.language)} – ${shortDayMonth(scheduleQuery.data.zoneBEnd, i18n.language)}`;

  const selectedRangeDays = (() => {
    if (!selection.startYmd) {
      return [] as string[];
    }
    const end = selection.endYmd ?? selection.startYmd;
    return listYmdsInRange(selection.startYmd, end);
  })();
  const selectedZoneADays = selectedRangeDays.filter(
    (ymd) => ymd >= settings.zoneAStartYmd && ymd <= settings.zoneAEndYmd,
  );
  const zoneAFieldStart =
    selectedZoneADays.length > 0 ? selectedZoneADays[0]! : settings.zoneAStartYmd;
  const zoneAFieldEnd =
    selectedZoneADays.length > 0
      ? selectedZoneADays[selectedZoneADays.length - 1]!
      : settings.zoneAEndYmd;
  const zoneBFieldStart =
    selectedZoneBDays.length > 0 ? selectedZoneBDays[0]! : settings.zoneBStartYmd;
  const zoneBFieldEnd =
    selectedZoneBDays.length > 0
      ? selectedZoneBDays[selectedZoneBDays.length - 1]!
      : zoneBEndYmd;
  const plannedRanges = (zoneBOverrides ?? []).map((override) => ({
    from: override.from,
    to: override.to,
    label: formatRangeLabel(
      { startYmd: override.from, endYmd: override.to },
      i18n.language,
    ),
    plan: overrideToSavedInfo(override, settings.zoneB),
    dayOff: override.dayOff === true,
  }));
  const workingDaysSummary = WEEKDAY_KEYS.filter((key) => workingDays[key])
    .map((key) => t(`zoneB.weekday.${key}`))
    .join(', ');
  const selectionAllEmpty =
    selectedZoneADays.length > 0 &&
    selectedZoneADays.every((ymd) => !appointmentDays.has(ymd) && !vacationDays.has(ymd));
  const zoneAVacationRemove =
    selectedZoneADays.length > 0 &&
    selectedZoneADays.every((ymd) => vacationDays.has(ymd));
  const vacationMode: ZoneAVacationMode = zoneAVacationRemove
    ? 'remove'
    : vacationUnlockedAfterCancel || selectionAllEmpty
      ? 'add'
      : 'locked';

  const handleDaySelect = (ymd: string, zone: 'a' | 'b') => {
    if (exceptionPickMode && zone === 'b') {
      const key = jsDayToWeekdayKey(weekdayOfYmd(ymd));
      if (!workingDays[key]) {
        toast.error(t('zoneB.exceptionsAlreadyRegularOff'));
        return;
      }
      if (vacationDays.has(ymd)) {
        toast.error(t('zoneB.exceptionsAlreadyAdded'));
        return;
      }
      const nextVacationDates = [...new Set([...scheduleQuery.data!.vacationDates, ymd])].sort();
      patchScheduleMutation.mutate(
        { vacationDates: nextVacationDates },
        {
          onSuccess: () => {
            toast.success(t('zoneB.exceptionsAdded'));
            setExceptionPickMode(false);
          },
          onError: () => {
            toast.error(t('vacationError'));
          },
        },
      );
      return;
    }

    if (zone === 'a') {
      setBulkScope('custom');
    }

    setSelection((prev) => {
      const { startYmd, endYmd } = prev;

      // Complete range: click any day inside it → clear selection
      if (startYmd && endYmd) {
        const from = startYmd < endYmd ? startYmd : endYmd;
        const to = startYmd < endYmd ? endYmd : startYmd;
        if (ymd >= from && ymd <= to) {
          return { startYmd: null, endYmd: null };
        }
        return { startYmd: ymd, endYmd: null };
      }

      // Only start picked: same day again → clear; other day → set end
      if (startYmd) {
        if (ymd === startYmd) {
          return { startYmd: null, endYmd: null };
        }
        return { startYmd, endYmd: ymd };
      }

      return { startYmd: ymd, endYmd: null };
    });
  };

  const closeModal = () => {
    setModal(null);
  };

  const confirmModal = () => {
    if (modal === 'bulk') {
      const body = resolveBulkCancelBody(bulkScope, selection, todayYmd, true);
      bulkCancelMutation.mutate(body, {
        onSuccess: () => {
          toast.success(t('bulkDone'));
          setVacationUnlockedAfterCancel(true);
          if (body.scope === 'custom_range' && body.from && body.to) {
            setEmptiedDayYmds(listYmdsInRange(body.from, body.to));
          } else if (bulkScope === 'rest_of_week') {
            setEmptiedDayYmds(listYmdsInRange(todayYmd, endOfWeekYmd(todayYmd)));
          } else {
            setEmptiedDayYmds([todayYmd]);
          }
        },
      });
    } else if (modal === 'saveB') {
      setIsSaving(true);
      const finishSave = {
        onSuccess: (data: DoctorScheduleResponse) => {
          const next = mapScheduleToWorkingHours(data);
          // Keep Zone A frozen snapshot — Zone B saves must not rewrite Zone A params.
          setZoneAFrozen((current) => current ?? next.zoneA);
          setZoneB({
            ...next.zoneB,
            vacationDayOff: false,
            customDuration: undefined,
            promoPriceUah: data.promoPriceUah,
            promoValidUntil: data.promoValidUntil,
          });
          setWorkingDays(workingDaysFromTemplate(data.weeklyTemplate));
          setSelection({ startYmd: null, endYmd: null });
          setEmptiedDayYmds([]);
          setIsSaving(false);
          toast.success(t('saved'));
        },
        onError: () => {
          setIsSaving(false);
          toast.error(t('saveError'));
        },
      };

      // Always save as a Zone B range override for the period shown in the form.
      // Never patch shared weeklyTemplate / duration / format / price — those feed Zone A.
      const from = zoneBFieldStart;
      const to = zoneBFieldEnd;
      if (!from || !to) {
        setIsSaving(false);
        toast.error(t('saveErrorNoPeriod'));
        setModal(null);
        return;
      }
      if (from < settings.zoneBStartYmd || to > zoneBEndYmd) {
        setIsSaving(false);
        toast.error(
          t('saveErrorOutsideZoneB', {
            end: formatDisplayDate(zoneBEndYmd, i18n.language),
          }),
        );
        setModal(null);
        return;
      }
      const rangeDays = listYmdsInInclusiveRange(from, to);
      const vacationSet = new Set(scheduleQuery.data.vacationDates);
      for (const ymd of rangeDays) {
        const works = workingDays[jsDayToWeekdayKey(weekdayOfYmd(ymd))];
        if (!works) {
          vacationSet.add(ymd);
        }
      }
      const promoPriceUah =
        zoneB.promoPriceUah != null && zoneB.promoPriceUah > 0
          ? zoneB.promoPriceUah
          : null;
      const promoValidUntil =
        promoPriceUah != null ? (zoneB.promoValidUntil ?? zoneBEndYmd) : null;
      patchScheduleMutation.mutate(
        {
          ...zoneBFormToRangePatch(zoneB, { from, to }),
          vacationDates: [...vacationSet].sort(),
          promoPriceUah,
          promoValidUntil,
        },
        finishSave,
      );
    } else if (modal === 'vacationA') {
      if (emptiedDayYmds.length === 0) {
        toast.error(t('vacationError'));
        setModal(null);
        return;
      }
      const nextVacationDates = [
        ...new Set([...scheduleQuery.data.vacationDates, ...emptiedDayYmds]),
      ];
      patchScheduleMutation.mutate(
        { vacationDates: nextVacationDates },
        {
          onSuccess: () => {
            toast.success(t('vacationSaved'));
            setVacationUnlockedAfterCancel(false);
            setEmptiedDayYmds([]);
            setSelection({ startYmd: null, endYmd: null });
          },
          onError: () => {
            toast.error(t('vacationError'));
          },
        },
      );
    } else if (modal === 'vacationRemove') {
      const removeSet = new Set(emptiedDayYmds);
      if (removeSet.size === 0) {
        toast.error(t('vacationError'));
        setModal(null);
        return;
      }
      const nextVacationDates = scheduleQuery.data.vacationDates.filter(
        (ymd) => !removeSet.has(ymd),
      );
      patchScheduleMutation.mutate(
        { vacationDates: nextVacationDates },
        {
          onSuccess: () => {
            toast.success(t('vacationRemoved'));
            setEmptiedDayYmds([]);
            setSelection({ startYmd: null, endYmd: null });
            setZoneB((prev) => (prev ? { ...prev, vacationDayOff: false } : prev));
          },
          onError: () => {
            toast.error(t('vacationError'));
          },
        },
      );
    } else if (modal === 'vacationB') {
      const zoneBDays =
        selection.startYmd && selection.startYmd >= settings.zoneBStartYmd
          ? listYmdsInRange(
              selection.startYmd,
              selection.endYmd ?? selection.startYmd,
            ).filter((ymd) => ymd >= settings.zoneBStartYmd)
          : [];
      if (zoneBDays.length === 0) {
        toast.error(t('vacationError'));
        setZoneB((prev) => (prev ? { ...prev, vacationDayOff: false } : prev));
        setModal(null);
        return;
      }
      const nextVacationDates = [
        ...new Set([...scheduleQuery.data.vacationDates, ...zoneBDays]),
      ];
      patchScheduleMutation.mutate(
        { vacationDates: nextVacationDates },
        {
          onSuccess: () => {
            toast.success(t('vacationSaved'));
            setZoneB((prev) => (prev ? { ...prev, vacationDayOff: true } : prev));
            setSelection({ startYmd: null, endYmd: null });
          },
          onError: () => {
            toast.error(t('vacationError'));
            setZoneB((prev) => (prev ? { ...prev, vacationDayOff: false } : prev));
          },
        },
      );
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
            <HintBanner>{t('monthHint')}</HintBanner>
          </MonthRow>
        </PageIntro>

        <WorkingHoursCalendar
          anchorYm={anchorYm}
          todayYmd={todayYmd}
          zoneAStartYmd={settings.zoneAStartYmd}
          zoneAEndYmd={settings.zoneAEndYmd}
          zoneBStartYmd={settings.zoneBStartYmd}
          zoneBEndYmd={zoneBEndYmd}
          appointmentDays={appointmentDays}
          vacationDays={vacationDays}
          regularOffDays={regularOffDays}
          plannedDays={plannedDays}
          selection={selection}
          exceptionPickMode={exceptionPickMode}
          onDaySelect={handleDaySelect}
        />

        <ZonesRow>
          <ZoneAPanel
            params={zoneAFrozen ?? settings.zoneA}
            locale={i18n.language}
            rangeStartYmd={zoneAFieldStart}
            rangeEndYmd={zoneAFieldEnd}
            minYmd={settings.zoneAStartYmd}
            maxYmd={settings.zoneAEndYmd}
            todayShort={todayShort}
            promoPriceUah={zoneB.promoPriceUah}
            promoValidUntil={zoneB.promoValidUntil}
            bulkScope={bulkScope}
            onBulkScopeChange={setBulkScope}
            onRangeChange={(startYmd, endYmd) => {
              setBulkScope('custom');
              setSelection({ startYmd, endYmd });
            }}
            cancelReason={cancelReason}
            onCancelReasonChange={setCancelReason}
            vacationMode={vacationMode}
            onBulkClick={() => {
              setModal('bulk');
            }}
            onVacationClick={() => {
              if (vacationMode === 'remove') {
                setEmptiedDayYmds(selectedZoneADays);
                setModal('vacationRemove');
                return;
              }
              if (selectionAllEmpty) {
                setEmptiedDayYmds(selectedZoneADays);
              }
              setModal('vacationA');
            }}
          />
          <ZoneBPanel
            form={zoneB}
            locale={i18n.language}
            periodStartYmd={zoneBFieldStart}
            periodEndYmd={zoneBFieldEnd}
            minYmd={settings.zoneBStartYmd}
            maxYmd={zoneBEndYmd}
            isSaving={isSaving}
            workingDays={workingDays}
            exceptions={zoneBExceptions}
            exceptionPickMode={exceptionPickMode}
            onChange={(patch) => {
              setZoneB((prev) => (prev ? { ...prev, ...patch } : prev));
            }}
            onPeriodStartPick={(ymd) => {
              if (selectedZoneBDays.length > 0) {
                const end = zoneBFieldEnd >= ymd ? zoneBFieldEnd : ymd;
                setSelection({ startYmd: ymd, endYmd: end });
                return;
              }
              setSelection({ startYmd: ymd, endYmd: ymd });
            }}
            onPeriodEndPick={(ymd) => {
              if (selectedZoneBDays.length > 0) {
                const start = zoneBFieldStart <= ymd ? zoneBFieldStart : ymd;
                setSelection({ startYmd: start, endYmd: ymd });
                return;
              }
              setSelection({ startYmd: ymd, endYmd: ymd });
            }}
            onWorkingDayToggle={(key) => {
              setWorkingDays((prev) => ({ ...prev, [key]: !prev[key] }));
            }}
            onStartExceptionPick={() => {
              setExceptionPickMode(true);
              setSelection({ startYmd: null, endYmd: null });
            }}
            onCancelExceptionPick={() => {
              setExceptionPickMode(false);
            }}
            onChangeExceptionDate={(fromYmd, toYmd) => {
              if (fromYmd === toYmd) {
                return;
              }
              const key = jsDayToWeekdayKey(weekdayOfYmd(toYmd));
              if (!workingDays[key]) {
                toast.error(t('zoneB.exceptionsAlreadyRegularOff'));
                return;
              }
              if (
                toYmd !== fromYmd &&
                (scheduleQuery.data.vacationDates ?? []).includes(toYmd)
              ) {
                toast.error(t('zoneB.exceptionsAlreadyAdded'));
                return;
              }
              const nextVacationDates = [
                ...new Set(
                  (scheduleQuery.data.vacationDates ?? [])
                    .filter((date) => date !== fromYmd)
                    .concat(toYmd),
                ),
              ].sort();
              patchScheduleMutation.mutate(
                { vacationDates: nextVacationDates },
                {
                  onSuccess: () => {
                    toast.success(t('zoneB.exceptionsAdded'));
                  },
                  onError: () => {
                    toast.error(t('vacationError'));
                  },
                },
              );
            }}
            onRemoveException={(ymd) => {
              const nextVacationDates = scheduleQuery.data.vacationDates
                .filter((date) => date !== ymd)
                .sort();
              patchScheduleMutation.mutate(
                { vacationDates: nextVacationDates },
                {
                  onSuccess: () => {
                    toast.success(t('zoneB.weekendsCleared'));
                  },
                  onError: () => {
                    toast.error(t('vacationError'));
                  },
                },
              );
            }}
            onSaveClick={() => {
              setModal('saveB');
            }}
          />
        </ZonesRow>

        <PlannedSchedulesSection
          ranges={plannedRanges}
          workingDaysLabel={workingDaysSummary || '—'}
          onRangeClick={(from, to) => {
            setSelection({ startYmd: from, endYmd: to });
          }}
        />

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
        zoneBShortLabel={zoneBShortLabel}
        bulkRangeLabel={bulkRangeLabel}
        bulkCount={bulkCount}
        emptiedDays={emptiedDayYmds.map((ymd) => shortDayMonth(ymd, i18n.language))}
        vacationBRangeLabel={vacationBRangeLabel}
        zoneBSaveRangeLabel={
          selectedZoneBDays.length > 0
            ? formatRangeLabel(
                {
                  startYmd: selectedZoneBDays[0]!,
                  endYmd: selectedZoneBDays[selectedZoneBDays.length - 1]!,
                },
                i18n.language,
              )
            : formatRangeLabel(
                { startYmd: settings.zoneBStartYmd, endYmd: zoneBEndYmd },
                i18n.language,
              )
        }
        zoneBPriceFromLabel={zoneBShortLabel}
        zoneBWorkingDaysLabel={workingDaysSummary || '—'}
        zoneBForm={zoneB}
        formatLabel={t(`format.${zoneB.format}`)}
        onClose={closeModal}
        onConfirm={confirmModal}
      />
    </Page>
  );
};
