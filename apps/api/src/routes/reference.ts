import { Type } from "@sinclair/typebox";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsync } from "fastify";

import { SPECIALTIES } from "../constants/specialties.js";
import { getDb } from "../db/client.js";
import { cities, clinics } from "../db/schema/reference.js";

export const referenceRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/api/v1/reference/cities",
    {
      schema: {
        response: {
          200: Type.Object({
            items: Type.Array(Type.Object({ id: Type.String(), name: Type.String() })),
          }),
        },
      },
    },
    async () => {
      const items = await getDb().select({ id: cities.id, name: cities.name }).from(cities);
      return { items };
    },
  );

  app.get(
    "/api/v1/reference/clinics",
    {
      schema: {
        querystring: Type.Object({ cityId: Type.String() }),
        response: {
          200: Type.Object({
            items: Type.Array(
              Type.Object({
                id: Type.String(),
                cityId: Type.String(),
                name: Type.String(),
              }),
            ),
          }),
        },
      },
    },
    async (request) => {
      const { cityId } = request.query as { cityId: string };
      const items = await getDb()
        .select({ id: clinics.id, cityId: clinics.cityId, name: clinics.name })
        .from(clinics)
        .where(eq(clinics.cityId, cityId));
      return { items };
    },
  );

  app.get(
    "/api/v1/reference/specialties",
    {
      schema: {
        response: {
          200: Type.Object({
            items: Type.Array(Type.Object({ id: Type.String(), name: Type.String() })),
          }),
        },
      },
    },
    async () => ({ items: SPECIALTIES }),
  );
};
