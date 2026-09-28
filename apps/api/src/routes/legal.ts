import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

import { LegalDocumentResponse } from "../openapi/schemas.js";

const STUB_BODY =
  "Legal copy is Open (client content). This placeholder confirms the API route works.";

export const legalRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/api/v1/legal/privacy",
    {
      schema: {
        tags: ["legal"],
        operationId: "getLegalPrivacy",
        querystring: Type.Object({ lang: Type.Optional(Type.String()) }),
        response: { 200: LegalDocumentResponse },
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
        tags: ["legal"],
        operationId: "getLegalTerms",
        querystring: Type.Object({ lang: Type.Optional(Type.String()) }),
        response: { 200: LegalDocumentResponse },
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
