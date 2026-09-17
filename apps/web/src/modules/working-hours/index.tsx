import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAppRole } from '@/hooks/useAppRole';
import {
  WorkingHoursCalendar,
  WORKING_HOURS_DEMO_TODAY,
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
  TitleRow,
  ZonesRow,
} from '@/modules/working-hours/styles';
import type { BulkCancelScope, ZoneBFormState } from '@/modules/working-hours/types';
import { formatDisplayDate } from '@/modules/working-hours/utils/calendarGrid';
import { AppRole } from '@/types/role';
import { AppRoute } from '@/utils/routeUtils/routes';

const LIKA = '/brand/lika-poses/lika2.png';

export const WorkingHoursPage = () => {
  const { t, i18n } = useTranslation('workingHours');
  const navigate = useNavigate();
  const { role } = useAppRole();

  const [anchorYm, setAnchorYm] = useState('2026-08');
  const [zoneB, setZoneB] = useState<ZoneBFormState>(MOCK_WORKING_HOURS.zoneB);
  const [bulkScope, setBulkScope] = useState<BulkCancelScope>('today');
  const [cancelReason, setCancelReason] = useState('');
  const [modal, setModal] = useState<WorkingHoursModalKind>(null);

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

  const closeModal = () => {
    setModal(null);
  };

  const confirmModal = () => {
    if (modal === 'bulk') {
      toast.success(t('bulkDone'));
    } else if (modal === 'saveB') {
      toast.success(t('saved'));
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
        <BackLink
          type="button"
          onClick={() => {
            void navigate(AppRoute.DOCTOR_DAY);
          }}
        >
          {t('backToDay')}
        </BackLink>

        <PageIntro>
          <TitleRow>
            <div>
              <PageTitle>{t('title')}</PageTitle>
              <PageSubtitle>{t('subtitle')}</PageSubtitle>
            </div>
            <HelpLink type="button">{t('howItWorks')}</HelpLink>
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
          todayYmd={WORKING_HOURS_DEMO_TODAY}
          appointmentDays={appointmentDays}
        />

        <ZonesRow>
          <ZoneAPanel
            params={MOCK_WORKING_HOURS.zoneA}
            bulkScope={bulkScope}
            onBulkScopeChange={setBulkScope}
            cancelReason={cancelReason}
            onCancelReasonChange={setCancelReason}
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

        <ImportantStrip>
          <Mascot src={LIKA} alt="" />
          <div>
            <strong>{t('important.title')}</strong>
            <ul>
              <li>{t('important.b1')}</li>
              <li>{t('important.b2')}</li>
              <li>{t('important.b3')}</li>
            </ul>
          </div>
        </ImportantStrip>
      </Content>

      <WorkingHoursModals
        kind={modal}
        zoneBStartLabel={zoneBStartLabel}
        onClose={closeModal}
        onConfirm={confirmModal}
      />
    </Page>
  );
};
