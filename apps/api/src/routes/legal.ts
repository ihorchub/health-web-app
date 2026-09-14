import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

const STUB_BODY =
  "Legal copy is Open (client content). This placeholder confirms the API route works.";

export const legalRoutes: FastifyPluginAsync = async (app) => {
  const responseSchema = Type.Object({
    lang: Type.String(),
    title: Type.String(),
    body: Type.String(),
  });

  app.get(
    "/api/v1/legal/privacy",
    {
      schema: {
        querystring: Type.Object({ lang: Type.Optional(Type.String()) }),
        response: { 200: responseSchema },
      },
    },
    async (request) => {
      const lang = (request.query as { lang?: string }).lang ?? "en";
      return {
        lang,
        title: lang === "uk" ? "Політика конфіденційності" : "Privacy Policy",
        body: STUB_BODY,
      };
    },
  );

  app.get(
    "/api/v1/legal/terms",
    {
      schema: {
        querystring: Type.Object({ lang: Type.Optional(Type.String()) }),
        response: { 200: responseSchema },
      },
    },
    async (request) => {
      const lang = (request.query as { lang?: string }).lang ?? "en";
      return {
        lang,
        title: lang === "uk" ? "Умови використання" : "Terms of Use",
        body: STUB_BODY,
      };
    },
  );
};
