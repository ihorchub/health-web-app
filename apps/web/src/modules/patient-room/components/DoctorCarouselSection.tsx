import type { DoctorSearchCard } from '@/api/doctors';
import { DoctorCard } from '@/modules/search/components/DoctorsSection';
import {
  CarouselTrack,
  SectionHead,
  SectionLink,
  SectionTitle,
} from '@/modules/patient-room/styles';
import { AppRole } from '@/types/role';

interface DoctorCarouselSectionProps {
  title: string;
  linkLabel?: string;
  onLink?: () => void;
  doctors: DoctorSearchCard[];
  clinicNames: Record<string, string>;
  cityNames: Record<string, string>;
  onOpenProfile: (doctor: DoctorSearchCard) => void;
  onBook: (doctor: DoctorSearchCard) => void;
  onFavourite: (doctor: DoctorSearchCard) => void;
  onViewHours: (doctor: DoctorSearchCard) => void;
}

export const DoctorCarouselSection = ({
  title,
  linkLabel,
  onLink,
  doctors,
  clinicNames,
  cityNames,
  onOpenProfile,
  onBook,
  onFavourite,
  onViewHours,
}: DoctorCarouselSectionProps) => {
  return (
    <section>
      <SectionHead>
        <SectionTitle>{title}</SectionTitle>
        {linkLabel && onLink ? (
          <SectionLink type="button" onClick={onLink}>
            {linkLabel}
          </SectionLink>
        ) : null}
      </SectionHead>

      <CarouselTrack>
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            role={AppRole.PATIENT}
            clinicName={clinicNames[doctor.clinicId] ?? ''}
            cityName={cityNames[doctor.cityId] ?? ''}
            onOpenProfile={onOpenProfile}
            onBook={onBook}
            onFavourite={onFavourite}
            onViewHours={onViewHours}
          />
        ))}
      </CarouselTrack>
    </section>
  );
};
