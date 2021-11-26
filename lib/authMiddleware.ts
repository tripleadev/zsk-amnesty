import { NextApiRequest, NextApiResponse } from "next";
import * as jose from "jose";
import type { Admin } from "@prisma/client";

export const withAuth =
  <R extends NextApiRequest>(
    handler: (req: R & { user: Admin }, res: NextApiResponse) => unknown,
  ) =>
  async (req: R, res: NextApiResponse) => {
    const jwe = req.cookies.jwe;
    if (!jwe) return res.status(401).json({ message: "Unauthorized" });

    const { plaintext, protectedHeader, additionalAuthenticatedData } = await jose.generalDecrypt(
      jwe,
      new TextEncoder().encode(process.env.JWE_SECRET),
    );
    const decoder = new TextDecoder();

    req.user = decoder.decode(plaintext);

    handler(req, res);
  };
