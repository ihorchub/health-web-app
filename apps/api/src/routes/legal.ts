import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

import { getPrivacyDocument, getTermsDocument } from "../content/legal/index.js";
import { LegalDocumentResponse } from "../openapi/schemas.js";

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
      const lang = (request.query as { lang?: string }).lang;
      return getPrivacyDocument(lang);
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
      const lang = (request.query as { lang?: string }).lang;
      return getTermsDocument(lang);
    },
  );
};
