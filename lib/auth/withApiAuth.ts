import { NextApiRequest, NextApiResponse } from "next";
import type { Session, Admin } from "@prisma/client";
import {
  getSessionCookie,
  getSessionExpirationDate,
  shouldRefreshSession,
  verifySession,
} from "./auth";
import { prisma } from "../db";

type AuthRequestExtend = { session: Session & { user: Admin } };

export const withApiAuth =
  <R extends NextApiRequest>(
    handler: (req: R & AuthRequestExtend, res: NextApiResponse) => unknown,
  ) =>
  async (req: R, res: NextApiResponse) => {
    try {
      const sessionId = req.cookies.authorization;
      const session = await verifySession(sessionId);

      if (shouldRefreshSession(session.updatedAt)) {
        const sessionExpiry = getSessionExpirationDate();

        await prisma.session.update({
          where: {
            id: sessionId,
          },
          data: {
            expiresAt: sessionExpiry,
          },
        });
        res.setHeader("Set-Cookie", getSessionCookie(sessionId, sessionExpiry));
      }

      (req as R & AuthRequestExtend).session = session;

      return await handler(req as R & AuthRequestExtend, res);
    } catch {
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
