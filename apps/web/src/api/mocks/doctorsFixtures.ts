import type {
  DoctorProfile,
  DoctorReview,
  DoctorSearchCard,
  SpecialtyId,
  VisitFormat,
} from '@/api/doctors/types';

interface MockDoctorRecord {
  id: string;
  firstName: string;
  lastName: string;
  specialty: SpecialtyId;
  clinicId: string;
  cityId: string;
  address: string;
  photoUrl: string;
  supportedFormats: VisitFormat;
  nearestFreeAt: string | null;
  basePrice: number;
  promoPrice: number | null;
  ratingAverage: number;
  reviewCount: number;
  isFavourite: boolean;
  yearsPractice: number;
  languages: Array<'uk' | 'en'>;
  descriptionUk: string;
  descriptionEn: string;
  consultationCount: number;
  reviews: DoctorReview[];
}

const reviewsFor = (
  doctorId: string,
  samples: Array<Omit<DoctorReview, 'id'>>,
): DoctorReview[] =>
  samples.map((sample, index) => ({
    ...sample,
    id: `rev_${doctorId}_${index + 1}`,
  }));

/** Canonical mock doctors — ids only for city/clinic/specialty; dual bios for SCR-03. */
export const MOCK_DOCTOR_RECORDS: MockDoctorRecord[] = [
  {
    id: 'doc_olena_kovalenko',
    firstName: 'Олена',
    lastName: 'Коваленко',
    specialty: 'cardiologist',
    clinicId: 'clinic_kyiv_center',
    cityId: 'city_kyiv',
    address: 'вул. Антоновича, 12',
    photoUrl: '/brand/doctor-avatars/doctor-f.png',
    supportedFormats: 'offline',
    nearestFreeAt: '2026-09-15T10:00:00+03:00',
    basePrice: 600,
    promoPrice: 450,
    ratingAverage: 4.9,
    reviewCount: 48,
    isFavourite: false,
    yearsPractice: 14,
    languages: ['uk', 'en'],
    descriptionUk:
      'Допомагаю пацієнтам дбати про серце: профілактика, діагностика та супровід хронічних станів.',
    descriptionEn:
      'I help patients care for their heart: prevention, diagnostics, and chronic condition support.',
    consultationCount: 1260,
    reviews: reviewsFor('doc_olena_kovalenko', [
      {
        rating: 5,
        text: 'Уважно вислухала і чітко пояснила план обстеження.',
        patientDisplayName: 'Марія П.',
        createdAt: '2026-08-12T10:00:00+03:00',
      },
      {
        rating: 5,
        text: 'Прийом без затримок, рекомендації зрозумілі.',
        patientDisplayName: 'Ігор К.',
        createdAt: '2026-07-28T14:20:00+03:00',
      },
      {
        rating: 4,
        text: 'Дуже професійно, трохи довго чекала в коридорі.',
        patientDisplayName: 'Оксана Л.',
        createdAt: '2026-07-02T09:10:00+03:00',
      },
    ]),
  },
  {
    id: 'doc_andriy_shevchenko',
    firstName: 'Андрій',
    lastName: 'Шевченко',
    specialty: 'family_doctor',
    clinicId: 'clinic_lviv_old',
    cityId: 'city_lviv',
    address: 'пл. Ринок, 8',
    photoUrl: '/brand/doctor-avatars/doctor-m.png',
    supportedFormats: 'online',
    nearestFreeAt: '2026-09-16T09:30:00+03:00',
    basePrice: 750,
    promoPrice: null,
    ratingAverage: 4.7,
    reviewCount: 31,
    isFavourite: true,
    yearsPractice: 12,
    languages: ['uk', 'en'],
    descriptionUk:
      'Допомагаю пацієнтам дбати про здоровʼя всієї родини: профілактика, гострі стани та хронічні хвороби.',
    descriptionEn:
      'I help families stay healthy: prevention, acute care, and chronic disease management.',
    consultationCount: 980,
    reviews: reviewsFor('doc_andriy_shevchenko', [
      {
        rating: 5,
        text: 'Зручна онлайн-консультація, все по суті.',
        patientDisplayName: 'Наталія С.',
        createdAt: '2026-08-20T11:00:00+03:00',
      },
      {
        rating: 4,
        text: 'Пояснив аналізи зрозумілою мовою.',
        patientDisplayName: 'Тарас М.',
        createdAt: '2026-08-01T16:40:00+03:00',
      },
    ]),
  },
  {
    id: 'doc_maria_bondar',
    firstName: 'Марія',
    lastName: 'Бондар',
    specialty: 'dermatologist',
    clinicId: 'clinic_odesa_sea',
    cityId: 'city_odesa',
    address: 'вул. Дерибасівська, 3',
    photoUrl: '/brand/doctor-avatars/doctor-f.png',
    supportedFormats: 'both',
    nearestFreeAt: '2026-09-15T14:00:00+03:00',
    basePrice: 650,
    promoPrice: 520,
    ratingAverage: 5.0,
    reviewCount: 112,
    isFavourite: false,
    yearsPractice: 9,
    languages: ['uk'],
    descriptionUk:
      'Працюю з проблемами шкіри у дорослих і підлітків: від акне до хронічних дерматозів.',
    descriptionEn:
      'I treat skin conditions in adults and teens — from acne to chronic dermatoses.',
    consultationCount: 2100,
    reviews: reviewsFor('doc_maria_bondar', [
      {
        rating: 5,
        text: 'Шкіра нарешті спокійна після курсу лікування.',
        patientDisplayName: 'Аліна В.',
        createdAt: '2026-08-18T12:00:00+03:00',
      },
      {
        rating: 5,
        text: 'Делікатно і професійно.',
        patientDisplayName: 'Юлія Р.',
        createdAt: '2026-07-15T10:30:00+03:00',
      },
      {
        rating: 5,
        text: 'Рекомендую всім друзям.',
        patientDisplayName: 'Катерина Д.',
        createdAt: '2026-06-22T15:00:00+03:00',
      },
    ]),
  },
  {
    id: 'doc_igor_melnyk',
    firstName: 'Ігор',
    lastName: 'Мельник',
    specialty: 'family_doctor',
    clinicId: 'clinic_kharkiv_main',
    cityId: 'city_kharkiv',
    address: 'вул. Сумська, 45',
    photoUrl: '/brand/doctor-avatars/doctor-m.png',
    supportedFormats: 'offline',
    nearestFreeAt: '2026-09-17T11:00:00+03:00',
    basePrice: 700,
    promoPrice: 580,
    ratingAverage: 4.8,
    reviewCount: 64,
    isFavourite: false,
    yearsPractice: 11,
    languages: ['uk', 'en'],
    descriptionUk:
      'Сімейний лікар із фокусом на профілактику та раннє виявлення проблем.',
    descriptionEn: 'Family doctor focused on prevention and early detection.',
    consultationCount: 740,
    reviews: reviewsFor('doc_igor_melnyk', [
      {
        rating: 5,
        text: 'Швидко зорієнтував щодо подальших кроків.',
        patientDisplayName: 'Сергій Б.',
        createdAt: '2026-08-05T09:00:00+03:00',
      },
    ]),
  },
  {
    id: 'doc_natalia_kruk',
    firstName: 'Наталія',
    lastName: 'Крук',
    specialty: 'paediatrician',
    clinicId: 'clinic_dnipro_river',
    cityId: 'city_dnipro',
    address: 'наб. Перемоги, 20',
    photoUrl: '/brand/doctor-avatars/doctor-f.png',
    supportedFormats: 'both',
    nearestFreeAt: '2026-09-15T16:20:00+03:00',
    basePrice: 620,
    promoPrice: null,
    ratingAverage: 4.6,
    reviewCount: 22,
    isFavourite: false,
    yearsPractice: 8,
    languages: ['uk'],
    descriptionUk: 'Педіатр, який спокійно працює з дітьми й пояснює батькам кожен крок.',
    descriptionEn:
      'Paediatrician who works calmly with children and explains every step to parents.',
    consultationCount: 510,
    reviews: reviewsFor('doc_natalia_kruk', [
      {
        rating: 5,
        text: 'Дитина не боялася, лікарка дуже тепла.',
        patientDisplayName: 'Олена Г.',
        createdAt: '2026-08-10T13:00:00+03:00',
      },
    ]),
  },
  {
    id: 'doc_oksana_lytvyn',
    firstName: 'Оксана',
    lastName: 'Литвин',
    specialty: 'dermatologist',
    clinicId: 'clinic_kyiv_left',
    cityId: 'city_kyiv',
    address: 'вул. Березняківська, 14',
    photoUrl: '/brand/doctor-avatars/doctor-f.png',
    supportedFormats: 'both',
    nearestFreeAt: '2026-09-18T12:00:00+03:00',
    basePrice: 950,
    promoPrice: 800,
    ratingAverage: 4.9,
    reviewCount: 87,
    isFavourite: false,
    yearsPractice: 15,
    languages: ['uk', 'en'],
    descriptionUk: 'Консультую з питань дерматології та естетичного догляду за шкірою.',
    descriptionEn: 'I consult on dermatology and aesthetic skin care.',
    consultationCount: 1680,
    reviews: reviewsFor('doc_oksana_lytvyn', [
      {
        rating: 5,
        text: 'Чіткий план і видимий результат.',
        patientDisplayName: 'Інна Т.',
        createdAt: '2026-08-14T17:00:00+03:00',
      },
      {
        rating: 4,
        text: 'Дорого, але варто.',
        patientDisplayName: 'Вікторія Ч.',
        createdAt: '2026-07-30T11:20:00+03:00',
      },
    ]),
  },
  {
    id: 'doc_petro_savchuk',
    firstName: 'Петро',
    lastName: 'Савчук',
    specialty: 'cardiologist',
    clinicId: 'clinic_kyiv_center',
    cityId: 'city_kyiv',
    address: 'вул. Антоновича, 12',
    photoUrl: '/brand/doctor-avatars/doctor-m.png',
    supportedFormats: 'offline',
    nearestFreeAt: '2026-09-19T08:40:00+03:00',
    basePrice: 800,
    promoPrice: null,
    ratingAverage: 4.4,
    reviewCount: 19,
    isFavourite: false,
    yearsPractice: 20,
    languages: ['uk'],
    descriptionUk: 'Кардіолог із досвідом супроводу пацієнтів після гострих станів.',
    descriptionEn: 'Cardiologist experienced in post-acute patient follow-up.',
    consultationCount: 2200,
    reviews: reviewsFor('doc_petro_savchuk', [
      {
        rating: 4,
        text: 'Досвідчений спеціаліст.',
        patientDisplayName: 'Микола Ф.',
        createdAt: '2026-06-18T10:00:00+03:00',
      },
    ]),
  },
  {
    id: 'doc_iryna_tkach',
    firstName: 'Ірина',
    lastName: 'Ткач',
    specialty: 'paediatrician',
    clinicId: 'clinic_lviv_west',
    cityId: 'city_lviv',
    address: 'вул. Наукова, 7',
    photoUrl: '/brand/doctor-avatars/doctor-f.png',
    supportedFormats: 'online',
    nearestFreeAt: null,
    basePrice: 550,
    promoPrice: 480,
    ratingAverage: 4.3,
    reviewCount: 15,
    isFavourite: false,
    yearsPractice: 6,
    languages: ['uk', 'en'],
    descriptionUk: 'Онлайн-консультації для батьків щодо здоровʼя малюків і підлітків.',
    descriptionEn: 'Online consultations for parents on infant and teen health.',
    consultationCount: 320,
    reviews: reviewsFor('doc_iryna_tkach', [
      {
        rating: 4,
        text: 'Зручно онлайн, коли дитина хворіє вдома.',
        patientDisplayName: 'Галина Ш.',
        createdAt: '2026-08-08T19:00:00+03:00',
      },
    ]),
  },
  {
    id: 'doc_sergiy_holub',
    firstName: 'Сергій',
    lastName: 'Голуб',
    specialty: 'family_doctor',
    clinicId: 'clinic_kyiv_center',
    cityId: 'city_kyiv',
    address: 'вул. Антоновича, 12',
    photoUrl: '/brand/doctor-avatars/doctor-m.png',
    supportedFormats: 'both',
    nearestFreeAt: '2026-09-15T18:00:00+03:00',
    basePrice: 500,
    promoPrice: null,
    ratingAverage: 4.2,
    reviewCount: 9,
    isFavourite: false,
    yearsPractice: 5,
    languages: ['uk'],
    descriptionUk: 'Молодий сімейний лікар із сучасним підходом до діагностики.',
    descriptionEn: 'Young family doctor with a modern diagnostic approach.',
    consultationCount: 190,
    reviews: reviewsFor('doc_sergiy_holub', [
      {
        rating: 4,
        text: 'Приємно й по суті.',
        patientDisplayName: 'Дмитро З.',
        createdAt: '2026-07-25T12:00:00+03:00',
      },
    ]),
  },
];

export const toSearchCard = (record: MockDoctorRecord): DoctorSearchCard => ({
  id: record.id,
  firstName: record.firstName,
  lastName: record.lastName,
  specialty: record.specialty,
  clinicId: record.clinicId,
  cityId: record.cityId,
  photoUrl: record.photoUrl,
  supportedFormats: record.supportedFormats,
  nearestFreeAt: record.nearestFreeAt,
  basePrice: record.basePrice,
  promoPrice: record.promoPrice,
  ratingAverage: record.ratingAverage,
  reviewCount: record.reviewCount,
  isFavourite: record.isFavourite,
  descriptionUk: record.descriptionUk,
  descriptionEn: record.descriptionEn,
});

export const toDoctorProfile = (record: MockDoctorRecord): DoctorProfile => ({
  id: record.id,
  firstName: record.firstName,
  lastName: record.lastName,
  specialty: record.specialty,
  clinicId: record.clinicId,
  cityId: record.cityId,
  address: record.address,
  photoUrl: record.photoUrl,
  yearsPractice: record.yearsPractice,
  languages: record.languages,
  descriptionUk: record.descriptionUk,
  descriptionEn: record.descriptionEn,
  supportedFormats: record.supportedFormats,
  basePrice: record.basePrice,
  promoPrice: record.promoPrice,
  ratingAverage: record.ratingAverage,
  reviewCount: record.reviewCount,
  consultationCount: record.consultationCount,
  isFavourite: record.isFavourite,
  reviews: record.reviews,
});

export const findMockDoctor = (doctorId: string) =>
  MOCK_DOCTOR_RECORDS.find((doctor) => doctor.id === doctorId);

/** @deprecated use MOCK_DOCTOR_RECORDS — kept as search projection helper */
export const MOCK_DOCTORS = MOCK_DOCTOR_RECORDS.map(toSearchCard);
