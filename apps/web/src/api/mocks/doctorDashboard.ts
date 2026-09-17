import type { AppointmentDto } from '@/api/appointments/types';
import type {
  DoctorDashboardFreeWindow,
  DoctorDashboardPendingPatient,
  DoctorDashboardResponse,
  DoctorDashboardVisit,
  ProposeAppointmentBody,
  ProposeAppointmentResponse,
} from '@/api/doctors/dashboard.types';
import {
  AppointmentForbiddenError,
  AppointmentInvalidTransitionError,
  SlotNotFreeError,
} from '@/api/appointments/errors';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const DEMO_DATE = '2026-08-27';

const initialVisits = (): DoctorDashboardVisit[] => [
  {
    id: 'apt_dv_1',
    patientId: 'pat_petro_bondar',
    patientFirstName: 'Петро',
    patientLastName: 'Бондар',
    patientPhone: null,
    patientEmail: null,
    startAt: '2026-08-27T08:00:00+03:00',
    endAt: '2026-08-27T08:30:00+03:00',
    format: 'offline',
    status: 'Completed',
    reason: 'контроль',
    visitDurationMinutes: 30,
    cancelledBy: null,
    proposedStartAt: null,
    isProposalHold: false,
  },
  {
    id: 'apt_dv_2',
    patientId: 'pat_andriy_melnyk',
    patientFirstName: 'Андрій',
    patientLastName: 'Мельник',
    patientPhone: '+380 67 123 4567',
    patientEmail: 'andriy.m@email.com',
    startAt: '2026-08-27T09:00:00+03:00',
    endAt: '2026-08-27T09:30:00+03:00',
    format: 'offline',
    status: 'Upcoming',
    reason: 'біль у спині',
    visitDurationMinutes: 30,
    cancelledBy: null,
    proposedStartAt: null,
    isProposalHold: false,
  },
  {
    id: 'apt_dv_3',
    patientId: 'pat_iryna_koval',
    patientFirstName: 'Ірина',
    patientLastName: 'Коваль',
    patientPhone: '+380 50 222 3344',
    patientEmail: 'iryna.k@email.com',
    startAt: '2026-08-27T10:30:00+03:00',
    endAt: '2026-08-27T11:00:00+03:00',
    format: 'online',
    status: 'Upcoming',
    reason: 'консультація',
    visitDurationMinutes: 30,
    cancelledBy: null,
    proposedStartAt: null,
    isProposalHold: false,
  },
  {
    id: 'apt_dv_4',
    patientId: 'pat_oleh_tkachuk',
    patientFirstName: 'Олег',
    patientLastName: 'Ткачук',
    patientPhone: null,
    patientEmail: null,
    startAt: '2026-08-27T11:30:00+03:00',
    endAt: '2026-08-27T12:00:00+03:00',
    format: 'offline',
    status: 'Cancelled',
    reason: null,
    visitDurationMinutes: 30,
    cancelledBy: 'patient',
    proposedStartAt: null,
    isProposalHold: false,
  },
  {
    id: 'apt_dv_5',
    patientId: 'pat_maria_shevchenko',
    patientFirstName: 'Марія',
    patientLastName: 'Шевченко',
    patientPhone: '+380 63 555 7788',
    patientEmail: 'maria.s@email.com',
    startAt: '2026-08-27T14:00:00+03:00',
    endAt: '2026-08-27T14:30:00+03:00',
    format: 'offline',
    status: 'Reschedule Pending',
    reason: null,
    visitDurationMinutes: 30,
    cancelledBy: null,
    proposedStartAt: '2026-08-27T16:00:00+03:00',
    isProposalHold: false,
  },
  {
    id: 'apt_dv_6',
    patientId: 'pat_natalia_bondar',
    patientFirstName: 'Наталія',
    patientLastName: 'Бондар',
    patientPhone: null,
    patientEmail: null,
    startAt: '2026-08-27T15:30:00+03:00',
    endAt: '2026-08-27T16:00:00+03:00',
    format: 'online',
    status: 'Upcoming',
    reason: null,
    visitDurationMinutes: 30,
    cancelledBy: null,
    proposedStartAt: null,
    isProposalHold: false,
  },
  {
    id: 'apt_dv_5_hold',
    patientId: 'pat_maria_shevchenko',
    patientFirstName: 'Марія',
    patientLastName: 'Шевченко',
    patientPhone: '+380 63 555 7788',
    patientEmail: 'maria.s@email.com',
    startAt: '2026-08-27T16:00:00+03:00',
    endAt: '2026-08-27T16:30:00+03:00',
    format: 'offline',
    status: 'Upcoming',
    reason: null,
    visitDurationMinutes: 30,
    cancelledBy: null,
    proposedStartAt: null,
    isProposalHold: true,
  },
  {
    id: 'apt_dv_8',
    patientId: 'pat_igor_kravchuk',
    patientFirstName: 'Ігор',
    patientLastName: 'Кравчук',
    patientPhone: null,
    patientEmail: null,
    startAt: '2026-08-27T17:30:00+03:00',
    endAt: '2026-08-27T18:00:00+03:00',
    format: 'offline',
    status: 'Upcoming',
    reason: 'аналізи',
    visitDurationMinutes: 30,
    cancelledBy: null,
    proposedStartAt: null,
    isProposalHold: false,
  },
  {
    id: 'apt_dv_9',
    patientId: 'pat_sergiy_melnyk',
    patientFirstName: 'Сергій',
    patientLastName: 'Мельник',
    patientPhone: null,
    patientEmail: null,
    startAt: '2026-08-27T18:00:00+03:00',
    endAt: '2026-08-27T18:30:00+03:00',
    format: 'offline',
    status: 'Upcoming',
    reason: null,
    visitDurationMinutes: 30,
    cancelledBy: null,
    proposedStartAt: null,
    isProposalHold: false,
  },
];

const initialFreeWindows = (): DoctorDashboardFreeWindow[] => [
  {
    id: 'fw_1',
    startAt: '2026-08-27T12:00:00+03:00',
    endAt: '2026-08-27T13:00:00+03:00',
    slotsCount: 2,
  },
  {
    id: 'fw_2',
    startAt: '2026-08-27T13:30:00+03:00',
    endAt: '2026-08-27T14:00:00+03:00',
    slotsCount: 1,
  },
  {
    id: 'fw_3',
    startAt: '2026-08-27T19:00:00+03:00',
    endAt: '2026-08-27T20:00:00+03:00',
    slotsCount: 2,
  },
];

const initialProposeSlots = (): string[] => [
  '2026-08-27T15:00:00+03:00',
  '2026-08-27T15:30:00+03:00',
  '2026-08-27T19:00:00+03:00',
];

interface DashboardStore {
  date: string;
  visits: DoctorDashboardVisit[];
  freeWindowsToday: DoctorDashboardFreeWindow[];
  proposeSlots: string[];
}

const store: DashboardStore = {
  date: DEMO_DATE,
  visits: initialVisits(),
  freeWindowsToday: initialFreeWindows(),
  proposeSlots: initialProposeSlots(),
};

const patientDisplay = (visit: DoctorDashboardVisit) =>
  `${visit.patientFirstName} ${visit.patientLastName}`;

const buildMetrics = (visits: DoctorDashboardVisit[]) => {
  const pendingCount = visits.filter(
    (visit) => visit.status === 'Reschedule Pending' && !visit.isProposalHold,
  ).length;
  const freeSlotsToday = store.freeWindowsToday.reduce(
    (sum, window) => sum + window.slotsCount,
    0,
  );

  return {
    visitsToday: visits.filter((visit) => !visit.isProposalHold).length,
    pendingCount,
    freeSlotsToday,
    cancellationsLast7Days: 3,
  };
};

const buildPendingPatients = (
  visits: DoctorDashboardVisit[],
): DoctorDashboardPendingPatient[] => {
  const pending = visits.filter(
    (visit) => visit.status === 'Reschedule Pending' && visit.proposedStartAt,
  );

  const rows = pending.map((visit) => ({
    id: `pending_${visit.id}`,
    patientId: visit.patientId,
    patientFirstName: visit.patientFirstName,
    patientLastName: visit.patientLastName,
    originalStartAt: visit.startAt,
    proposedStartAt: visit.proposedStartAt!,
  }));

  if (rows.length === 1) {
    rows.push({
      id: 'pending_demo_victor',
      patientId: 'pat_victor_romanenko',
      patientFirstName: 'Віктор',
      patientLastName: 'Романенко',
      originalStartAt: '2026-08-28T11:00:00+03:00',
      proposedStartAt: '2026-08-28T12:30:00+03:00',
    });
  }

  return rows;
};

const nextUpcoming = (visits: DoctorDashboardVisit[]) =>
  [...visits]
    .filter((visit) => visit.status === 'Upcoming' && !visit.isProposalHold)
    .sort((a, b) => a.startAt.localeCompare(b.startAt))[0] ?? null;

const buildResponse = (): DoctorDashboardResponse => {
  const visits = [...store.visits].sort((a, b) => a.startAt.localeCompare(b.startAt));

  return {
    date: store.date,
    metrics: buildMetrics(visits),
    visits,
    nextVisit: nextUpcoming(visits),
    pendingPatients: buildPendingPatients(visits),
    freeWindowsToday: store.freeWindowsToday,
    proposeSlots: store.proposeSlots,
  };
};

const findVisit = (id: string) => store.visits.find((visit) => visit.id === id);

/** Mock GET /api/v1/doctors/me/dashboard */
export const mockGetDoctorMeDashboard = async (
  date: string,
): Promise<DoctorDashboardResponse> => {
  await delay(280);

  if (date !== DEMO_DATE) {
    return {
      date,
      metrics: {
        visitsToday: 0,
        pendingCount: 0,
        freeSlotsToday: 0,
        cancellationsLast7Days: 3,
      },
      visits: [],
      nextVisit: null,
      pendingPatients: [],
      freeWindowsToday: [],
      proposeSlots: [],
    };
  }

  return buildResponse();
};

/** Mock POST /api/v1/appointments/:id/complete */
export const mockPostCompleteAppointment = async (id: string): Promise<AppointmentDto> => {
  await delay(320);
  const visit = findVisit(id);
  if (!visit || visit.isProposalHold) {
    throw new AppointmentForbiddenError();
  }
  if (visit.status !== 'Upcoming') {
    throw new AppointmentInvalidTransitionError();
  }

  visit.status = 'Completed';
  return toAppointmentDto(visit);
};

/** Mock POST /api/v1/appointments/:id/cancel (doctor) */
export const mockPostCancelAppointment = async (id: string): Promise<AppointmentDto> => {
  await delay(320);
  const visit = findVisit(id);
  if (!visit || visit.isProposalHold) {
    throw new AppointmentForbiddenError();
  }
  if (visit.status !== 'Upcoming') {
    throw new AppointmentInvalidTransitionError();
  }

  visit.status = 'Cancelled';
  visit.cancelledBy = 'doctor';
  return toAppointmentDto(visit);
};

/** Mock POST /api/v1/appointments/:id/propose */
export const mockPostProposeAppointment = async (
  id: string,
  body: ProposeAppointmentBody,
): Promise<ProposeAppointmentResponse> => {
  await delay(420);
  const visit = findVisit(id);
  if (!visit || visit.isProposalHold) {
    throw new AppointmentForbiddenError();
  }
  if (visit.status !== 'Upcoming') {
    throw new AppointmentInvalidTransitionError();
  }

  const slotFree =
    store.proposeSlots.includes(body.proposedStartAt) &&
    !store.visits.some((row) => row.startAt === body.proposedStartAt);

  if (!slotFree) {
    throw new SlotNotFreeError();
  }

  visit.status = 'Reschedule Pending';
  visit.proposedStartAt = body.proposedStartAt;
  if (body.format) {
    visit.format = body.format;
  }

  const hold: DoctorDashboardVisit = {
    ...visit,
    id: `${visit.id}_hold`,
    startAt: body.proposedStartAt,
    endAt: new Date(
      Date.parse(body.proposedStartAt) + visit.visitDurationMinutes * 60_000,
    ).toISOString(),
    status: 'Upcoming',
    proposedStartAt: null,
    isProposalHold: true,
    reason: null,
  };

  store.visits.push(hold);
  store.proposeSlots = store.proposeSlots.filter((slot) => slot !== body.proposedStartAt);

  return { appointment: visit, proposalHold: hold };
};

const toAppointmentDto = (visit: DoctorDashboardVisit): AppointmentDto => ({
  id: visit.id,
  doctorId: 'me',
  startAt: visit.startAt,
  endAt: visit.endAt,
  format: visit.format,
  status: visit.status,
  reason: visit.reason,
  visitDurationMinutes: visit.visitDurationMinutes,
});

/** Test helper — reset mock store between stories / HMR if needed. */
export const resetDoctorDashboardMock = () => {
  store.visits = initialVisits();
  store.freeWindowsToday = initialFreeWindows();
  store.proposeSlots = initialProposeSlots();
};

export const doctorDashboardDemoDate = DEMO_DATE;

export { patientDisplay };
