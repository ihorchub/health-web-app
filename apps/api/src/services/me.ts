import { eq } from "drizzle-orm";

import { getDb } from "../db/client.js";
import { doctorProfiles, patientProfiles } from "../db/schema/index.js";
import { redirectForRole, type UserRole } from "../lib/redirect.js";
import type { SessionUser } from "../plugins/session.js";

export async function getMeSummary(sessionUser: SessionUser) {
  const db = getDb();
  const role = sessionUser.role;

  if (role === "patient") {
    const [profile] = await db
      .select({ firstName: patientProfiles.firstName, language: patientProfiles.language, theme: patientProfiles.theme })
      .from(patientProfiles)
      .where(eq(patientProfiles.userId, sessionUser.id))
      .limit(1);
    return {
      id: sessionUser.id,
      role,
      email: sessionUser.email,
      firstName: profile?.firstName ?? "",
      redirectTo: redirectForRole(role),
      language: profile?.language ?? null,
      theme: profile?.theme ?? null,
    };
  }

  const [profile] = await db
    .select({ firstName: doctorProfiles.firstName, language: doctorProfiles.language, theme: doctorProfiles.theme })
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, sessionUser.id))
    .limit(1);

  return {
    id: sessionUser.id,
    role,
    email: sessionUser.email,
    firstName: profile?.firstName ?? "",
    redirectTo: redirectForRole(role as UserRole),
    language: profile?.language ?? null,
    theme: profile?.theme ?? null,
  };
}
