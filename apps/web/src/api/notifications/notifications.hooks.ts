import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getNotifications,
  postNotificationRead,
  postNotificationsReadAll,
  type NotificationsListResponse,
} from '@/api/notifications/notifications';

export const notificationsQueryKeys = {
  list: () => ['notifications'] as const,
};

interface UseGetNotificationsOptions {
  enabled?: boolean;
  refetchIntervalMs?: number | false;
}

/** GET /api/v1/notifications */
export const useGetNotifications = (options: UseGetNotificationsOptions = {}) => {
  return useQuery<NotificationsListResponse>({
    queryKey: notificationsQueryKeys.list(),
    queryFn: () => getNotifications(),
    enabled: options.enabled ?? true,
    refetchInterval: options.refetchIntervalMs ?? 60_000,
  });
};

/** POST /api/v1/notifications/:id/read */
export const usePostNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation<{ ok: true }, Error, { id: string }>({
    mutationFn: ({ id }) => postNotificationRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsQueryKeys.list() });
    },
  });
};

/** POST /api/v1/notifications/read-all */
export const usePostNotificationsReadAll = () => {
  const queryClient = useQueryClient();

  return useMutation<{ ok: true }, Error, void>({
    mutationFn: () => postNotificationsReadAll(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsQueryKeys.list() });
    },
  });
};
