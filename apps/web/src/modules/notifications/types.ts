export type NotificationEventType =
  | 'patient_booked'
  | 'patient_cancelled'
  | 'patient_rescheduled'
  | 'patient_accepted_proposal'
  | 'patient_picked_other_slot'
  | 'doctor_cancelled'
  | 'doctor_proposed_time';

export interface AppNotification {
  id: string;
  type: NotificationEventType;
  /** ISO local datetime */
  createdAt: string;
  patientName?: string;
  doctorName?: string;
  /** Display time for the visit referenced */
  visitAt?: string;
}
