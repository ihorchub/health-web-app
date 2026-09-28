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

/** UK display aliases for free-text search `q` (backend-spec: both languages). */
export const SPECIALTY_SEARCH_ALIASES_UK: Record<(typeof SPECIALTIES)[number]["id"], string[]> = {
  family_doctor: ["сімейний лікар", "сімейний", "сімейна", "сімейна лікарка"],
  cardiologist: ["кардіолог", "кардіологія"],
  dermatologist: ["дерматолог", "дерматологія"],
  paediatrician: ["педіатр", "педіатрія"],
  neurologist: ["невролог", "неврологія"],
  ophthalmologist: ["офтальмолог", "окуліст"],
  orthopedist: ["ортопед", "ортопедія"],
  endocrinologist: ["ендокринолог", "ендокринологія"],
  gastroenterologist: ["гастроентеролог", "гастроентерологія"],
  gynecologist: ["гінеколог", "гінекологія"],
  urologist: ["уролог", "урологія"],
  otolaryngologist: ["отоларинголог", "лор"],
  psychiatrist: ["психіатр", "психіатрія"],
  pulmonologist: ["пульмонолог", "пульмонологія"],
};

export type SpecialtyId = (typeof SPECIALTIES)[number]["id"];

export const SPECIALTY_IDS: SpecialtyId[] = SPECIALTIES.map((s) => s.id);

export function isSpecialtyId(value: string): value is SpecialtyId {
  return (SPECIALTY_IDS as string[]).includes(value);
}

/** Specialty ids whose EN/UK labels contain the free-text needle. */
export function specialtyIdsMatchingQuery(q: string): SpecialtyId[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];

  return SPECIALTIES.filter((s) => {
    if (s.name.toLowerCase().includes(needle) || s.id.toLowerCase().includes(needle)) {
      return true;
    }
    return (SPECIALTY_SEARCH_ALIASES_UK[s.id] ?? []).some((alias) =>
      alias.toLowerCase().includes(needle) || needle.includes(alias.toLowerCase()),
    );
  }).map((s) => s.id);
}
