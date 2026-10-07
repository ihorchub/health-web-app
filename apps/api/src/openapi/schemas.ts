/**
 * Shared TypeBox schemas for Medicly API success responses and DTOs (OpenAPI documentation).
 */
import { Type, type Static } from "@sinclair/typebox";

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

export const Role = Type.Union([Type.Literal("patient"), Type.Literal("doctor")]);
export type Role = Static<typeof Role>;

export const OkTrue = Type.Object({ ok: Type.Literal(true) });
export type OkTrue = Static<typeof OkTrue>;

export const IdNameItem = Type.Object({
  id: Type.String(),
  name: Type.String(),
});
export type IdNameItem = Static<typeof IdNameItem>;

export const VisitFormat = Type.Union([Type.Literal("offline"), Type.Literal("online")]);
export type VisitFormat = Static<typeof VisitFormat>;

export const VisitFormatCard = Type.Union([
  Type.Literal("offline"),
  Type.Literal("online"),
  Type.Literal("both"),
]);
export type VisitFormatCard = Static<typeof VisitFormatCard>;

export const AppointmentStatus = Type.Union([
  Type.Literal("Upcoming"),
  Type.Literal("Reschedule Pending"),
  Type.Literal("Completed"),
  Type.Literal("Cancelled"),
  Type.Literal("Rescheduled"),
]);
export type AppointmentStatus = Static<typeof AppointmentStatus>;

export const CancelledBy = Type.Union([Type.Literal("patient"), Type.Literal("doctor")]);
export type CancelledBy = Static<typeof CancelledBy>;

/**
 * Native TypeBox nullables — required for Fastify response serialization.
 * OpenAPI export post-processes Type.Null() artifacts for Orval (see export-openapi.ts).
 */
const NullableString = Type.Union([Type.String(), Type.Null()]);
const NullableNumber = Type.Union([Type.Number(), Type.Null()]);
const NullableCancelledBy = Type.Union([
  Type.Literal("patient"),
  Type.Literal("doctor"),
  Type.Null(),
]);
const NullableStringArray = Type.Union([Type.Array(Type.String()), Type.Null()]);
function NullableObj<T extends ReturnType<typeof Type.Object>>(schema: T) {
  return Type.Union([schema, Type.Null()]);
}

export const ProfileLanguage = Type.Union([Type.Literal("uk"), Type.Literal("en")]);

export const Gender = Type.Union([Type.Literal("female"), Type.Literal("male")]);

export const DatabaseStatus = Type.Union([
  Type.Literal("connected"),
  Type.Literal("disconnected"),
  Type.Literal("not_configured"),
]);

// ---------------------------------------------------------------------------
// Errors (4xx/5xx bodies)
// ---------------------------------------------------------------------------

export const ApiErrorBody = Type.Object({
  error: Type.Object({
    code: Type.String(),
    message: Type.Optional(Type.String()),
    fields: Type.Optional(Type.Record(Type.String(), Type.String())),
  }),
});
export type ApiErrorBody = Static<typeof ApiErrorBody>;

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

export const HealthResponse = Type.Object({
  ok: Type.Boolean(),
  service: Type.Literal("medicly-api"),
  database: DatabaseStatus,
});
export type HealthResponse = Static<typeof HealthResponse>;

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export const AuthSessionResponse = Type.Object({
  userId: Type.String(),
  role: Role,
  redirectTo: Type.String(),
});
export type AuthSessionResponse = Static<typeof AuthSessionResponse>;

export const RegisterStep1Response = Type.Object({
  registrationId: Type.String(),
  email: Type.String(),
  role: Role,
  nextStep: Type.Literal("email"),
  devVerifyToken: Type.Optional(Type.String()),
});
export type RegisterStep1Response = Static<typeof RegisterStep1Response>;

export const RegistrationNextStep = Type.Union([
  Type.Literal("email"),
  Type.Literal("profile"),
  Type.Literal("done"),
  Type.Literal("complete"),
]);

export const RegistrationStatusResponse = Type.Object({
  registrationId: Type.String(),
  role: Role,
  email: Type.String(),
  emailVerified: Type.Boolean(),
  profileCompleted: Type.Boolean(),
  nextStep: RegistrationNextStep,
});
export type RegistrationStatusResponse = Static<typeof RegistrationStatusResponse>;

export const VerifyEmailResponse = Type.Object({
  registrationId: Type.String(),
  emailVerified: Type.Literal(true),
  role: Role,
  nextStep: Type.Literal("profile"),
});
export type VerifyEmailResponse = Static<typeof VerifyEmailResponse>;

export const ResendEmailResponse = Type.Object({
  ok: Type.Literal(true),
  sentTo: Type.String(),
});
export type ResendEmailResponse = Static<typeof ResendEmailResponse>;

export const RegisterStep3Response = Type.Object({
  registrationId: Type.String(),
  profileCompleted: Type.Literal(true),
  nextStep: Type.Literal("done"),
});
export type RegisterStep3Response = Static<typeof RegisterStep3Response>;

export const MeResponse = Type.Object({
  id: Type.String(),
  role: Role,
  email: Type.String(),
  firstName: Type.String(),
  redirectTo: Type.String(),
  language: NullableString,
  theme: NullableString,
});
export type MeResponse = Static<typeof MeResponse>;

/** GET /api/v1/auth/me — null when unauthenticated. */
export const MeResponseNullable = NullableObj(MeResponse);
export type MeResponseNullable = Static<typeof MeResponseNullable>;

// ---------------------------------------------------------------------------
// Reference
// ---------------------------------------------------------------------------

export const ReferenceCitiesResponse = Type.Object({
  items: Type.Array(IdNameItem),
});
export type ReferenceCitiesResponse = Static<typeof ReferenceCitiesResponse>;

export const ReferenceClinicItem = Type.Object({
  id: Type.String(),
  cityId: Type.String(),
  name: Type.String(),
});
export type ReferenceClinicItem = Static<typeof ReferenceClinicItem>;

export const ReferenceClinicsResponse = Type.Object({
  items: Type.Array(ReferenceClinicItem),
});
export type ReferenceClinicsResponse = Static<typeof ReferenceClinicsResponse>;

export const ReferenceSpecialtiesResponse = Type.Object({
  items: Type.Array(IdNameItem),
});
export type ReferenceSpecialtiesResponse = Static<typeof ReferenceSpecialtiesResponse>;

// ---------------------------------------------------------------------------
// Doctors — search, profile, calendar
// ---------------------------------------------------------------------------

export const DoctorSearchCard = Type.Object({
  id: Type.String(),
  firstName: Type.String(),
  lastName: Type.String(),
  specialty: Type.String(),
  clinicName: Type.String(),
  cityName: Type.String(),
  clinicId: Type.String(),
  cityId: Type.String(),
  photoUrl: NullableString,
  supportedFormats: VisitFormatCard,
  nearestFreeAt: NullableString,
  basePrice: Type.Number(),
  promoPrice: NullableNumber,
  ratingAverage: Type.Number(),
  reviewCount: Type.Number(),
  isFavourite: Type.Boolean(),
});
export type DoctorSearchCard = Static<typeof DoctorSearchCard>;

export const DoctorsSearchPrefill = Type.Object({
  cityId: NullableString,
  clinicId: NullableString,
});
export type DoctorsSearchPrefill = Static<typeof DoctorsSearchPrefill>;

export const DoctorsSearchResponse = Type.Object({
  total: Type.Number(),
  nextCursor: NullableString,
  items: Type.Array(DoctorSearchCard),
  prefill: Type.Optional(DoctorsSearchPrefill),
});
export type DoctorsSearchResponse = Static<typeof DoctorsSearchResponse>;

export const DoctorReviewDto = Type.Object({
  id: Type.String(),
  rating: Type.Number(),
  text: Type.String(),
  patientDisplayName: Type.String(),
  createdAt: Type.String(),
});
export type DoctorReviewDto = Static<typeof DoctorReviewDto>;

export const DoctorProfileDto = Type.Object({
  id: Type.String(),
  firstName: Type.String(),
  lastName: Type.String(),
  specialty: Type.String(),
  clinicId: Type.String(),
  cityId: Type.String(),
  clinicName: Type.String(),
  cityName: Type.String(),
  address: Type.String(),
  photoUrl: NullableString,
  yearsPractice: Type.Number(),
  visitDurationMinutes: Type.Number(),
  languages: Type.Array(ProfileLanguage),
  descriptionUk: Type.String(),
  descriptionEn: Type.String(),
  bio: Type.String(),
  supportedFormats: VisitFormatCard,
  basePrice: Type.Number(),
  promoPrice: NullableNumber,
  ratingAverage: Type.Number(),
  reviewCount: Type.Number(),
  consultationCount: Type.Number(),
  isFavourite: Type.Boolean(),
  reviews: Type.Array(DoctorReviewDto),
});
export type DoctorProfileDto = Static<typeof DoctorProfileDto>;

export const CalendarSlotStatus = Type.Union([
  Type.Literal("free"),
  Type.Literal("taken"),
  Type.Literal("reserved"),
  Type.Literal("past"),
]);
export type CalendarSlotStatus = Static<typeof CalendarSlotStatus>;

export const CalendarSlot = Type.Object({
  startAt: Type.String(),
  status: CalendarSlotStatus,
});
export type CalendarSlot = Static<typeof CalendarSlot>;

export const CalendarDayFlag = Type.Union([
  Type.Literal("has_free"),
  Type.Literal("full"),
  Type.Literal("day_off"),
  Type.Literal("outside_window"),
  Type.Literal("past"),
]);
export type CalendarDayFlag = Static<typeof CalendarDayFlag>;

export const DoctorCalendarDaySummary = Type.Object({
  date: Type.String(),
  flag: CalendarDayFlag,
});
export type DoctorCalendarDaySummary = Static<typeof DoctorCalendarDaySummary>;

export const DoctorCalendarResponse = Type.Object({
  doctorId: Type.String(),
  zoneAStart: Type.String(),
  zoneAEnd: Type.String(),
  visitDurationMinutes: Type.Number(),
  supportedFormats: Type.Array(VisitFormat),
  days: Type.Array(DoctorCalendarDaySummary),
  slots: Type.Array(CalendarSlot),
});
export type DoctorCalendarResponse = Static<typeof DoctorCalendarResponse>;

// ---------------------------------------------------------------------------
// Patients — cabinet, lists, profile, reviews
// ---------------------------------------------------------------------------

export const CabinetExistingReview = Type.Object({
  id: Type.String(),
  rating: Type.Number(),
  text: NullableString,
});
export type CabinetExistingReview = Static<typeof CabinetExistingReview>;

export const CabinetAppointmentRow = Type.Object({
  id: Type.String(),
  doctorId: Type.String(),
  doctorFirstName: Type.String(),
  doctorLastName: Type.String(),
  doctorPhotoUrl: NullableString,
  specialty: Type.String(),
  clinicName: Type.String(),
  cityName: Type.String(),
  startAt: Type.String(),
  durationMinutes: Type.Number(),
  format: VisitFormat,
  status: AppointmentStatus,
  reason: NullableString,
  cancelledBy: NullableCancelledBy,
  proposedStartAt: NullableString,
  canMove: Type.Boolean(),
  canCancel: Type.Boolean(),
  canReview: Type.Boolean(),
  existingReview: NullableObj(CabinetExistingReview),
  pendingDecisionUrl: NullableString,
});
export type CabinetAppointmentRow = Static<typeof CabinetAppointmentRow>;

export const PatientMiniCalendarDay = Type.Object({
  date: Type.String(),
  count: Type.Number(),
});
export type PatientMiniCalendarDay = Static<typeof PatientMiniCalendarDay>;

export const PatientCabinetReviewsSummary = Type.Object({
  leftCount: Type.Number(),
  pendingCount: Type.Number(),
});
export type PatientCabinetReviewsSummary = Static<typeof PatientCabinetReviewsSummary>;

export const PatientCabinetMetrics = Type.Object({
  upcomingCount: Type.Number(),
  pastCount: Type.Number(),
});
export type PatientCabinetMetrics = Static<typeof PatientCabinetMetrics>;

export const PatientCabinetZoneA = Type.Object({
  start: Type.String(),
  end: Type.String(),
});
export type PatientCabinetZoneA = Static<typeof PatientCabinetZoneA>;

export const DoctorListCard = Type.Object({
  id: Type.String(),
  firstName: Type.String(),
  lastName: Type.String(),
  specialty: Type.String(),
  clinicName: Type.String(),
  cityName: Type.String(),
  photoUrl: NullableString,
  basePrice: Type.Number(),
  promoPrice: NullableNumber,
  ratingAverage: Type.Number(),
});
export type DoctorListCard = Static<typeof DoctorListCard>;

export const PatientCabinetResponse = Type.Object({
  upcoming: Type.Array(CabinetAppointmentRow),
  past: Type.Array(CabinetAppointmentRow),
  pendingBanner: NullableObj(CabinetAppointmentRow),
  nextAppointment: NullableObj(CabinetAppointmentRow),
  miniCalendar: Type.Array(PatientMiniCalendarDay),
  favourites: Type.Array(DoctorListCard),
  recentlyViewed: Type.Array(DoctorListCard),
  myReviews: PatientCabinetReviewsSummary,
  metrics: PatientCabinetMetrics,
  zoneA: PatientCabinetZoneA,
});
export type PatientCabinetResponse = Static<typeof PatientCabinetResponse>;

export const PatientAppointmentsResponse = Type.Object({
  upcoming: Type.Array(CabinetAppointmentRow),
  past: Type.Array(CabinetAppointmentRow),
});
export type PatientAppointmentsResponse = Static<typeof PatientAppointmentsResponse>;

export const PatientDoctorListResponse = Type.Object({
  items: Type.Array(DoctorListCard),
});
export type PatientDoctorListResponse = Static<typeof PatientDoctorListResponse>;

export const FavouriteAddResponse = Type.Object({
  ok: Type.Literal(true),
  isFavourite: Type.Literal(true),
});
export type FavouriteAddResponse = Static<typeof FavouriteAddResponse>;

export const FavouriteRemoveResponse = Type.Object({
  ok: Type.Literal(true),
  isFavourite: Type.Literal(false),
});
export type FavouriteRemoveResponse = Static<typeof FavouriteRemoveResponse>;

export const ReviewDto = Type.Object({
  id: Type.String(),
  appointmentId: Type.String(),
  doctorId: Type.String(),
  rating: Type.Number(),
  text: NullableString,
  createdAt: Type.String(),
});
export type ReviewDto = Static<typeof ReviewDto>;

export const PendingReviewItem = Type.Object({
  appointmentId: Type.String(),
  doctorId: Type.String(),
  startAt: Type.String(),
});
export type PendingReviewItem = Static<typeof PendingReviewItem>;

export const PatientReviewsResponse = Type.Object({
  left: Type.Array(ReviewDto),
  pending: Type.Array(PendingReviewItem),
});
export type PatientReviewsResponse = Static<typeof PatientReviewsResponse>;

export const CreateReviewResponse = Type.Object({
  review: ReviewDto,
});
export type CreateReviewResponse = Static<typeof CreateReviewResponse>;

export const PatientProfileDto = Type.Object({
  id: Type.String(),
  email: Type.String(),
  firstName: Type.String(),
  lastName: Type.String(),
  dob: Type.String(),
  gender: Gender,
  phone: NullableString,
  photoUrl: NullableString,
  homeCityId: Type.String(),
  homeClinicId: Type.String(),
  language: NullableString,
  theme: NullableString,
});
export type PatientProfileDto = Static<typeof PatientProfileDto>;

// ---------------------------------------------------------------------------
// Doctor — schedule, dashboard, me profile
// ---------------------------------------------------------------------------

export const WeeklyDayTemplate = Type.Object({
  works: Type.Boolean(),
  start: Type.Optional(Type.String()),
  end: Type.Optional(Type.String()),
  lunchStart: Type.Optional(Type.String()),
  lunchEnd: Type.Optional(Type.String()),
});
export type WeeklyDayTemplate = Static<typeof WeeklyDayTemplate>;

export const WeeklyTemplate = Type.Object({
  monday: WeeklyDayTemplate,
  tuesday: WeeklyDayTemplate,
  wednesday: WeeklyDayTemplate,
  thursday: WeeklyDayTemplate,
  friday: WeeklyDayTemplate,
  saturday: WeeklyDayTemplate,
  sunday: WeeklyDayTemplate,
});
export type WeeklyTemplate = Static<typeof WeeklyTemplate>;

export const DoctorScheduleFrozenInZoneA = Type.Object({
  hours: Type.Literal(true),
  duration: Type.Literal(true),
  basePrice: Type.Literal(true),
});
export type DoctorScheduleFrozenInZoneA = Static<typeof DoctorScheduleFrozenInZoneA>;

export const ZoneBOverride = Type.Object({
  from: Type.String(),
  to: Type.String(),
  supportedFormats: Type.Optional(Type.Array(VisitFormat)),
  visitDurationMinutes: Type.Optional(Type.Number()),
  workStart: Type.Optional(Type.String()),
  workEnd: Type.Optional(Type.String()),
  lunchStart: Type.Optional(Type.String()),
  lunchEnd: Type.Optional(Type.String()),
  basePriceUah: Type.Optional(Type.Number()),
  dayOff: Type.Optional(Type.Boolean()),
});
export type ZoneBOverride = Static<typeof ZoneBOverride>;

export const DoctorScheduleResponse = Type.Object({
  doctorUserId: Type.String(),
  basePriceUah: Type.Number(),
  promoPriceUah: NullableNumber,
  promoValidUntil: NullableString,
  supportedFormats: Type.Array(VisitFormat),
  weeklyTemplate: WeeklyTemplate,
  vacationDates: Type.Array(Type.String()),
  zoneBOverrides: Type.Array(ZoneBOverride),
  visibleInSearch: Type.Boolean(),
  visitDurationMinutes: Type.Number(),
  specialty: Type.Optional(Type.String()),
  zoneAStart: Type.String(),
  zoneAEnd: Type.String(),
  zoneBStart: Type.String(),
  zoneBEnd: Type.String(),
  frozenInZoneA: DoctorScheduleFrozenInZoneA,
});
export type DoctorScheduleResponse = Static<typeof DoctorScheduleResponse>;

export const BulkCancelResponse = Type.Object({
  cancelledIds: Type.Array(Type.String()),
});
export type BulkCancelResponse = Static<typeof BulkCancelResponse>;

/** PATCH /doctors/me/schedule body (Zone B defaults + optional range override). */
export const PatchDoctorScheduleBody = Type.Object({
  zoneBWeeklyTemplate: Type.Optional(WeeklyTemplate),
  zoneBVisitDurationMinutes: Type.Optional(Type.Number()),
  vacationDates: Type.Optional(Type.Array(Type.String())),
  supportedFormats: Type.Optional(Type.Array(VisitFormat)),
  basePriceUah: Type.Optional(Type.Number()),
  basePriceEffectiveFrom: Type.Optional(Type.String()),
  promoPriceUah: Type.Optional(NullableNumber),
  promoValidUntil: Type.Optional(NullableString),
  zoneBOverride: Type.Optional(ZoneBOverride),
});
export type PatchDoctorScheduleBody = Static<typeof PatchDoctorScheduleBody>;

export const DoctorDashboardVisit = Type.Object({
  id: Type.String(),
  patientDisplayName: Type.String(),
  patientPhotoUrl: NullableString,
  startAt: Type.String(),
  format: VisitFormat,
  reason: NullableString,
  status: AppointmentStatus,
  proposedStartAt: NullableString,
});
export type DoctorDashboardVisit = Static<typeof DoctorDashboardVisit>;

export const DoctorDashboardMetrics = Type.Object({
  visitsToday: Type.Number(),
  pendingCount: Type.Number(),
  freeSlotsToday: Type.Number(),
  cancellationsLast7Days: Type.Number(),
  pastVisitsThisMonth: Type.Number(),
});
export type DoctorDashboardMetrics = Static<typeof DoctorDashboardMetrics>;

export const DoctorDashboardWeekStripDay = Type.Object({
  date: Type.String(),
  visits: Type.Number(),
  pending: Type.Number(),
  cancelled: Type.Number(),
  free: Type.Number(),
});
export type DoctorDashboardWeekStripDay = Static<typeof DoctorDashboardWeekStripDay>;

export const DoctorDashboardResponse = Type.Object({
  date: Type.String(),
  metrics: DoctorDashboardMetrics,
  visits: Type.Array(DoctorDashboardVisit),
  nextVisit: NullableObj(DoctorDashboardVisit),
  pendingPatients: Type.Array(DoctorDashboardVisit),
  pastVisitsMonth: Type.Array(DoctorDashboardVisit),
  cancellationsLast7Days: Type.Array(DoctorDashboardVisit),
  freeWindowsToday: Type.Array(Type.String()),
  weekStrip: Type.Array(DoctorDashboardWeekStripDay),
});
export type DoctorDashboardResponse = Static<typeof DoctorDashboardResponse>;

export const DoctorEducationItem = Type.Object({
  id: Type.String(),
  kind: Type.Union([
    Type.Literal("university"),
    Type.Literal("certificate"),
    Type.Literal("training"),
  ]),
  title: Type.String(),
  subtitle: NullableString,
  yearFrom: Type.Number(),
  yearTo: NullableNumber,
});
export type DoctorEducationItem = Static<typeof DoctorEducationItem>;

export const DoctorMeProfileDto = Type.Object({
  id: Type.String(),
  email: Type.String(),
  firstName: Type.String(),
  lastName: Type.String(),
  dob: Type.String(),
  phone: NullableString,
  cityId: Type.String(),
  clinicId: Type.String(),
  specialty: Type.String(),
  yearsPractice: Type.Number(),
  photoUrl: NullableString,
  licenseFileUrl: NullableString,
  bio: NullableString,
  languages: NullableStringArray,
  language: NullableString,
  theme: NullableString,
  education: Type.Array(DoctorEducationItem),
  consultationCount: Type.Number(),
});
export type DoctorMeProfileDto = Static<typeof DoctorMeProfileDto>;

// ---------------------------------------------------------------------------
// Appointments
// ---------------------------------------------------------------------------

export const AppointmentDto = Type.Object({
  id: Type.String(),
  doctorId: Type.String(),
  patientId: Type.String(),
  startAt: Type.String(),
  endAt: Type.String(),
  format: VisitFormat,
  status: AppointmentStatus,
  reason: NullableString,
  visitDurationMinutes: Type.Number(),
  proposedStartAt: NullableString,
  cancelledBy: NullableCancelledBy,
});
export type AppointmentDto = Static<typeof AppointmentDto>;

export const BookAppointmentResponse = Type.Object({
  appointment: AppointmentDto,
});
export type BookAppointmentResponse = Static<typeof BookAppointmentResponse>;

export const AppointmentMutationResponse = Type.Object({
  appointment: AppointmentDto,
});
export type AppointmentMutationResponse = Static<typeof AppointmentMutationResponse>;

export const ReschedulePairResponse = Type.Object({
  oldAppointment: AppointmentDto,
  newAppointment: AppointmentDto,
});
export type ReschedulePairResponse = Static<typeof ReschedulePairResponse>;

export const PendingDecisionResponse = Type.Object({
  appointmentId: Type.String(),
  doctorId: Type.String(),
  status: Type.Literal("Reschedule Pending"),
  originalStartAt: Type.String(),
  proposedStartAt: Type.String(),
  format: VisitFormat,
  durationMinutes: Type.Number(),
  reason: NullableString,
});
export type PendingDecisionResponse = Static<typeof PendingDecisionResponse>;

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export const NotificationItem = Type.Object({
  id: Type.String(),
  type: Type.String(),
  createdAt: Type.String(),
  read: Type.Literal(false),
  payload: Type.Record(Type.String(), Type.Unknown()),
});
export type NotificationItem = Static<typeof NotificationItem>;

export const NotificationsListResponse = Type.Object({
  unreadCount: Type.Number(),
  items: Type.Array(NotificationItem),
});
export type NotificationsListResponse = Static<typeof NotificationsListResponse>;

// ---------------------------------------------------------------------------
// Legal
// ---------------------------------------------------------------------------

export const LegalDocumentResponse = Type.Object({
  lang: Type.String(),
  title: Type.String(),
  body: Type.String(),
});
export type LegalDocumentResponse = Static<typeof LegalDocumentResponse>;
