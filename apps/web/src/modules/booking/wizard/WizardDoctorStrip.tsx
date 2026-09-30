import type { DoctorProfile } from '@/api/doctors';
import { DoctorPhoto } from '@/components/DoctorPhoto/DoctorPhoto';
import {
  DoctorStrip,
  StripMeta,
  StripName,
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
      <DoctorPhoto
        photoUrl={doctor.photoUrl}
        firstName={doctor.firstName}
        lastName={doctor.lastName}
        size="sm"
      />
      <StripText>
        <StripName>
          {doctorPrefix} {doctor.firstName} {doctor.lastName}
        </StripName>
        <StripMeta>{meta}</StripMeta>
      </StripText>
    </DoctorStrip>
  );
};
