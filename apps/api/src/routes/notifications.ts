import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

import { ApiError } from "../lib/errors.js";
import { listUnread, markAllRead, markRead } from "../services/notifications.js";

export const notificationsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/api/v1/notifications", async (request) => {
    if (!request.sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
    return listUnread(request.sessionUser.id);
  });

  app.post(
    "/api/v1/notifications/:id/read",
    { schema: { params: Type.Object({ id: Type.String() }) } },
    async (request) => {
      if (!request.sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
      const { id } = request.params as { id: string };
      return markRead(request.sessionUser.id, id);
    },
  );

  app.post("/api/v1/notifications/read-all", async (request) => {
    if (!request.sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
    return markAllRead(request.sessionUser.id);
  });
};
