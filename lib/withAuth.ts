import { NextApiRequest, NextApiResponse } from "next";
import type { Admin } from "@prisma/client";

type AuthRequestExtend = { user: Admin };

export const withAuth =
  <R extends NextApiRequest>(
    handler: (req: R & AuthRequestExtend, res: NextApiResponse) => unknown,
  ) =>
  async (req: R, res: NextApiResponse) => {
    const sessionId = req.cookies.session;
    if (!sessionId) return res.status(401).json({ message: "Unauthorized" });

    handler(req, res);
  };
