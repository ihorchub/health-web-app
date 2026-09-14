import type { FastifyPluginAsync } from "fastify";

import { ApiError, errorBody } from "../lib/errors.js";

export const errorsPlugin: FastifyPluginAsync = async (app) => {
  app.setErrorHandler((error: unknown, _request, reply) => {
    if (error instanceof ApiError) {
      return reply.status(error.statusCode).send(errorBody(error.code, error.fields));
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "validation" in error &&
      (error as { validation?: unknown }).validation
    ) {
      return reply.status(400).send(errorBody("AUTH_VALIDATION_FAILED"));
    }
    app.log.error(error);
    return reply.status(500).send({
      error: { code: "INTERNAL_ERROR" },
    });
  });
};
