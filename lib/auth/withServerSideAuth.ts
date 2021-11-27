import { Admin, Session } from "@prisma/client";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import {
  getSessionCookie,
  getSessionExpirationDate,
  shouldRefreshSession,
  verifySession,
} from "./auth";
import { prisma } from "../db";

type AuthContextExtend = { session: Session & { user: Admin } };

export const withServerSideAuth =
  <C extends GetServerSidePropsContext, P>(
    handler: (
      ctx: C & AuthContextExtend,
    ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>,
  ) =>
  async (ctx: C) => {
    try {
      const { req } = ctx;
      const sessionId = req.cookies.authorization;
      const session = await verifySession(sessionId);

      console.log(sessionId);

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
        ctx.res.setHeader("Set-Cookie", getSessionCookie(sessionId, sessionExpiry));
      }

      (ctx as C & AuthContextExtend).session = session;

      return await handler(ctx as C & AuthContextExtend);
    } catch {
      return {
        redirect: {
          permanent: false,
          destination: "/admin/login",
        },
      };
    }
  };
