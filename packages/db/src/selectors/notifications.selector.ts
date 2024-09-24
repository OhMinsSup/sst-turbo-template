import { Prisma } from "@prisma/client";

import { getUserSelector } from "./users.selector";

export const getNotificationSelector = () => {
  return Prisma.validator<Prisma.NotificationSelect>()({
    id: true,
    read: true,
    type: true,
    message: true,
    createdAt: true,
    SenderUser: {
      select: getUserSelector(),
    },
    ReceiverUser: {
      select: getUserSelector(),
    },
  });
};

export type NotificationPayload = Prisma.NotificationGetPayload<{
  select: ReturnType<typeof getNotificationSelector>;
}>;
