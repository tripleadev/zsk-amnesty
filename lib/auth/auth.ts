import { prisma } from "../db";

export const verifySession = async (sessionId: string) => {
  const session = await prisma.session.findUnique({
    include: {
      user: true,
    },
    where: {
      id: sessionId,
    },
  });

  if (!session) {
    throw new Error("Session not found");
  }

  if (session.expiresAt < new Date()) {
    throw new Error("Session expired");
  }

  return session;
};

const EXPIRE_SESSION_AFTER = 1000 * 60 * 60 * 24 * 7; // 7 days
const REFRESH_SESSION_AFTER = 1000 * 60 * 60 * 24; // 1 day

export const getSessionExpirationDate = () => {
  return new Date(Date.now() + EXPIRE_SESSION_AFTER);
};

export const shouldRefreshSession = (refreshedAt: Date) => {
  return new Date(Date.now()) > new Date(refreshedAt.getTime() + REFRESH_SESSION_AFTER);
};

export const getSessionCookie = (sessionId: string, expireAt: Date) =>
  `authorization=${sessionId}; Expires=${expireAt.toUTCString()}; Secure; HttpOnly; Path=/`;

export const getDeleteSessionCookie = () =>
  `authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
