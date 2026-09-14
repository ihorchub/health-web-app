import type { DoctorProfile } from '@/api/doctors';
import {
  DoctorStrip,
  StripMeta,
  StripName,
  StripPhoto,
  StripText,
} from '@/modules/booking/wizard/doctorStripStyles';

interface WizardDoctorStripProps {
  doctor: DoctorProfile;
  specialtyLabel: string;
  clinicName: string;
  durationLabel: string;
  doctorPrefix: string;
}

export const WizardDoctorStrip = ({
  doctor,
  specialtyLabel,
  clinicName,
  durationLabel,
  doctorPrefix,
}: WizardDoctorStripProps) => {
  const meta = [specialtyLabel, clinicName, durationLabel].filter(Boolean).join(' · ');

  return (
    <DoctorStrip>
      <StripPhoto src={doctor.photoUrl} alt="" />
      <StripText>
        <StripName>
          {doctorPrefix} {doctor.firstName} {doctor.lastName}
        </StripName>
        <StripMeta>{meta}</StripMeta>
      </StripText>
    </DoctorStrip>
  );
};
