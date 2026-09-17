import type { DoctorProfileData, PatientProfileData } from '@/modules/profile/types';

export const MOCK_PATIENT_PROFILE: PatientProfileData = {
  firstName: 'Оксана',
  lastName: 'Коваленко',
  phone: '+380 67 123 45 67',
  email: 'oksana.kovalenko@email.com',
  dateOfBirth: '1990-03-15',
  cityId: 'city_kyiv',
  clinicId: 'clinic_kyiv_center',
  cityName: 'Київ',
  clinicName: 'Добробут',
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
  cityName: 'Київ',
  clinicName: 'МедЦентр Дніпро',
  address: 'вул. Хрещатик, 22',
  specialtyLabel: 'Психотерапевт, Психіатр',
  yearsPractice: 10,
  languages: 'Українська, English',
  licenseFileName: 'license_petrenko.pdf',
  consultationCount: 320,
  ratingAverage: 4.9,
  reviewCount: 128,
  basePrice: 600,
  promoPrice: 480,
  format: 'both',
  photoUrl: '/brand/doctor-avatars/doctor-m.png',
  shortBioUk:
    'Допомагаю людям знайти внутрішню рівновагу та подолати тривожність через доказові методи психотерапії.',
  shortBioEn:
    'I help people find inner balance and overcome anxiety through evidence-based psychotherapy.',
  fullBioUk:
    'Понад 10 років практикую доказову психотерапію. Працюю з тривожними розладами, депресією, панічними атаками та професійним вигоранням. У роботі поєдную когнітивно-поведінкову терапію та схематерапію, щоб клієнти отримували стійкі зміни, а не лише короткочасне полегшення.',
  fullBioEn:
    'Over 10 years practicing evidence-based psychotherapy. I work with anxiety disorders, depression, panic attacks, and burnout, combining CBT and schema therapy for lasting change.',
  education: [
    {
      id: 'edu_1',
      title: 'Національний медичний університет ім. О.О. Богомольця',
      subtitle: 'Спеціальність: Лікувальна справа',
      years: '2010 – 2016',
      kind: 'education',
    },
    {
      id: 'edu_2',
      title: 'Когнітивно-поведінкова терапія',
      subtitle: 'Сертифікат',
      years: '2020',
      kind: 'certificate',
    },
    {
      id: 'edu_3',
      title: 'Схематерапія',
      subtitle: 'Підвищення кваліфікації',
      years: '2022',
      kind: 'certificate',
    },
  ],
  reviews: [
    {
      id: 'rev_1',
      author: 'Марія П.',
      rating: 5,
      text: 'Дуже уважний прийом, усе пояснили спокійно. Легко записатися на зручний час.',
    },
    {
      id: 'rev_2',
      author: 'Андрій К.',
      rating: 4,
      text: 'Зручний онлайн-формат. Єдине — чекав трохи довше за планований слот.',
    },
    {
      id: 'rev_3',
      author: 'Оксана Л.',
      rating: 5,
      text: 'Чіткі рекомендації й приємна атмосфера в клініці. Рекомендую.',
    },
  ],
};
