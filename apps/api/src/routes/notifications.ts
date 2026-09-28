import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

import { ApiError } from "../lib/errors.js";
import { NotificationsListResponse, OkTrue } from "../openapi/schemas.js";
import { listUnread, markAllRead, markRead } from "../services/notifications.js";

export const notificationsRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/api/v1/notifications",
    {
      schema: {
        tags: ["notifications"],
        operationId: "getNotifications",
        response: { 200: NotificationsListResponse },
      },
    },
    async (request) => {
      if (!request.sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
      return listUnread(request.sessionUser.id);
    },
  );

  app.post(
    "/api/v1/notifications/:id/read",
    {
      schema: {
        tags: ["notifications"],
        operationId: "postNotificationRead",
        params: Type.Object({ id: Type.String() }),
        response: { 200: OkTrue },
      },
    },
    async (request) => {
      if (!request.sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
      const { id } = request.params as { id: string };
      return markRead(request.sessionUser.id, id);
    },
  );

  app.post(
    "/api/v1/notifications/read-all",
    {
      schema: {
        tags: ["notifications"],
        operationId: "postNotificationsReadAll",
        response: { 200: OkTrue },
      },
    },
    async (request) => {
      if (!request.sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
      return markAllRead(request.sessionUser.id);
    },
  );
};
