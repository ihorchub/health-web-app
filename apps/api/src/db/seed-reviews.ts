/**
 * Idempotent demo seed: completed appointments + reviews for every doctor.
 * Safe to re-run — uses fixed seed_* ids and onConflictDoNothing.
 */
import "dotenv/config";

import { getDb } from "./client.js";
import { appointments } from "./schema/appointments.js";
import { doctorProfiles, patientProfiles } from "./schema/profiles.js";
import { reviews } from "./schema/reviews.js";
import { users } from "./schema/users.js";
import { hashPassword } from "../lib/password.js";

const REVIEWER_PATIENTS = [
  { id: "seed_patient_reviewer_01", firstName: "Олена", lastName: "Коваль", gender: "female" as const },
  { id: "seed_patient_reviewer_02", firstName: "Андрій", lastName: "Шевченко", gender: "male" as const },
  { id: "seed_patient_reviewer_03", firstName: "Марія", lastName: "Бондар", gender: "female" as const },
  { id: "seed_patient_reviewer_04", firstName: "Іван", lastName: "Ткачук", gender: "male" as const },
  { id: "seed_patient_reviewer_05", firstName: "Наталія", lastName: "Лисенко", gender: "female" as const },
];

const REVIEW_TEXTS = [
  { rating: 5, text: "Чудовий лікар, усе чітко й спокійно. Рекомендую!" },
  { rating: 5, text: "Дуже уважний прийом, пояснив усе зрозуміло." },
  { rating: 4, text: "Все добре, трохи зачекала, але консультація варта того." },
  { rating: 5, text: "Професійно і з турботою. Запишусь знову." },
  { rating: 4, text: "Гарний досвід, клініка зручна, лікар компетентний." },
  { rating: 3, text: "Нормально, але хотілося б більше часу на запитання." },
  { rating: 5, text: "Найкращий візит за останній рік — дякую!" },
  { rating: 4, text: "Friendly and professional. Clear recommendations." },
];

function daysAgo(days: number, hour: number, minute: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(hour - 3, minute, 0, 0); // approx Europe/Kyiv as UTC+3
  return d;
}

export async function seedReviews(): Promise<{ doctors: number; reviews: number }> {
  const db = getDb();
  const doctors = await db
    .select({
      id: doctorProfiles.userId,
      cityId: doctorProfiles.cityId,
      clinicId: doctorProfiles.clinicId,
      duration: doctorProfiles.visitDurationMinutes,
    })
    .from(doctorProfiles);

  if (doctors.length === 0) {
    console.warn("No doctors found — nothing to seed.");
    return { doctors: 0, reviews: 0 };
  }

  const passwordHash = await hashPassword("SeedReview1!");
  const fallbackCity = doctors[0]!.cityId;
  const fallbackClinic = doctors[0]!.clinicId;

  for (const patient of REVIEWER_PATIENTS) {
    await db
      .insert(users)
      .values({
        id: patient.id,
        email: `${patient.id}@seed.medicly.local`,
        passwordHash,
        role: "patient",
        emailVerifiedAt: new Date(),
      })
      .onConflictDoNothing();

    await db
      .insert(patientProfiles)
      .values({
        userId: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        dob: "1992-05-15",
        gender: patient.gender,
        homeCityId: fallbackCity,
        homeClinicId: fallbackClinic,
      })
      .onConflictDoNothing();
  }

  let insertedReviews = 0;

  for (const [doctorIndex, doctor] of doctors.entries()) {
    // 3–5 reviews per doctor, cycling reviewers and texts
    const reviewCount = 3 + (doctorIndex % 3);

    for (let i = 0; i < reviewCount; i += 1) {
      const patient = REVIEWER_PATIENTS[(doctorIndex + i) % REVIEWER_PATIENTS.length]!;
      const sample = REVIEW_TEXTS[(doctorIndex * 3 + i) % REVIEW_TEXTS.length]!;
      const appointmentId = `seed_apt_${doctor.id}_${i}`;
      const reviewId = `seed_rev_${doctor.id}_${i}`;
      const startAt = daysAgo(14 + i * 7 + doctorIndex, 9 + i, 0);
      const completedAt = new Date(startAt.getTime() + doctor.duration * 60_000);

      await db
        .insert(appointments)
        .values({
          id: appointmentId,
          doctorId: doctor.id,
          patientId: patient.id,
          startAt,
          durationMinutes: doctor.duration,
          format: "offline",
          status: "Completed",
          completedAt,
        })
        .onConflictDoNothing();

      const result = await db
        .insert(reviews)
        .values({
          id: reviewId,
          appointmentId,
          patientId: patient.id,
          doctorId: doctor.id,
          rating: sample.rating,
          text: sample.text,
          createdAt: completedAt,
        })
        .onConflictDoNothing()
        .returning({ id: reviews.id });

      if (result.length > 0) {
        insertedReviews += 1;
      }
    }
  }

  return { doctors: doctors.length, reviews: insertedReviews };
}
