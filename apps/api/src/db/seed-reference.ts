import "dotenv/config";

import { getDb } from "./client.js";
import { cities, clinics } from "./schema/reference.js";

const CITY_CLINICS = [
  {
    cityId: "city_kyiv",
    cityName: "Kyiv",
    clinics: [
      { id: "clinic_kyiv_center", name: "Medicly Kyiv Center" },
      { id: "clinic_kyiv_left", name: "Left Bank Clinic" },
    ],
  },
  {
    cityId: "city_lviv",
    cityName: "Lviv",
    clinics: [
      { id: "clinic_lviv_old", name: "Old Town Clinic" },
      { id: "clinic_lviv_west", name: "West Lviv Clinic" },
    ],
  },
  {
    cityId: "city_odesa",
    cityName: "Odesa",
    clinics: [{ id: "clinic_odesa_sea", name: "Sea View Clinic" }],
  },
  {
    cityId: "city_kharkiv",
    cityName: "Kharkiv",
    clinics: [{ id: "clinic_kharkiv_main", name: "Kharkiv Main Clinic" }],
  },
  {
    cityId: "city_dnipro",
    cityName: "Dnipro",
    clinics: [{ id: "clinic_dnipro_river", name: "River Clinic" }],
  },
];

export async function seedReferenceData(): Promise<void> {
  const db = getDb();
  for (const city of CITY_CLINICS) {
    await db.insert(cities).values({ id: city.cityId, name: city.cityName }).onConflictDoNothing();
    for (const clinic of city.clinics) {
      await db
        .insert(clinics)
        .values({ id: clinic.id, cityId: city.cityId, name: clinic.name })
        .onConflictDoNothing();
    }
  }
}


