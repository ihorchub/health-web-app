import type { DoctorProfileData, PatientProfileData } from '@/modules/profile/types';

export const MOCK_PATIENT_PROFILE: PatientProfileData = {
  firstName: 'Оксана',
  lastName: 'Литвин',
  phone: '+380 67 123 45 67',
  email: 'oksana.litvyn@example.com',
  dateOfBirth: '1992-04-15',
  cityId: 'city_kyiv',
  clinicId: 'clinic_kyiv_center',
  photoUrl: '/brand/doctor-avatars/doctor-f.png',
};

export const MOCK_DOCTOR_PROFILE: DoctorProfileData = {
  id: 'doc_demo_profile',
  firstName: 'Іван',
  lastName: 'Петренко',
  phone: '+380 50 123 45 67',
  email: 'ivan.petrenko@example.com',
  dateOfBirth: '1988-03-12',
  cityId: 'city_kyiv',
  clinicId: 'clinic_kyiv_center',
  specialty: 'family_doctor',
  yearsPractice: 10,
  languages: 'Українська, English',
  licenseFileName: 'license_petrenko.pdf',
  consultationCount: 320,
  ratingAverage: 4.9,
  reviewCount: 128,
  photoUrl: '/brand/doctor-avatars/doctor-m.png',
  shortBioUk: 'Допомагаю знайти внутрішню рівновагу та повернутися до активного життя.',
  shortBioEn: 'I help people find inner balance and return to an active life.',
  fullBioUk:
    'Понад 10 років практики в доказовій психотерапії. Працюю з тривогою, депресією та вигоранням, використовую КПТ та схема-терапію.',
  fullBioEn:
    'Over 10 years in evidence-based psychotherapy. I work with anxiety, depression, and burnout using CBT and schema therapy.',
  education: [
    {
      id: 'edu_1',
      title: 'НМУ ім. О.О. Богомольця',
      subtitle: 'Лікувальна справа',
      years: '2010 – 2016',
    },
    {
      id: 'edu_2',
      title: 'Когнітивно-поведінкова терапія',
      subtitle: 'Сертифікат',
      years: '2020',
    },
    {
      id: 'edu_3',
      title: 'Схема-терапія',
      subtitle: 'Підвищення кваліфікації',
      years: '2022',
    },
  ],
};
