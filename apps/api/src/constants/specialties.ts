/** Canonical specialty catalog — used by reference API, registration, and search. */
export const SPECIALTIES = [
  { id: "family_doctor", name: "Family doctor" },
  { id: "cardiologist", name: "Cardiologist" },
  { id: "dermatologist", name: "Dermatologist" },
  { id: "paediatrician", name: "Paediatrician" },
  { id: "neurologist", name: "Neurologist" },
  { id: "ophthalmologist", name: "Ophthalmologist" },
  { id: "orthopedist", name: "Orthopedist" },
  { id: "endocrinologist", name: "Endocrinologist" },
  { id: "gastroenterologist", name: "Gastroenterologist" },
  { id: "gynecologist", name: "Gynecologist" },
  { id: "urologist", name: "Urologist" },
  { id: "otolaryngologist", name: "Otolaryngologist" },
  { id: "psychiatrist", name: "Psychiatrist" },
  { id: "pulmonologist", name: "Pulmonologist" },
] as const;

export type SpecialtyId = (typeof SPECIALTIES)[number]["id"];

export const SPECIALTY_IDS: SpecialtyId[] = SPECIALTIES.map((s) => s.id);

export function isSpecialtyId(value: string): value is SpecialtyId {
  return (SPECIALTY_IDS as string[]).includes(value);
}
