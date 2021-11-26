import { NextApiRequest, NextApiResponse } from "next";
import { withValidation } from "../../lib/validateMiddleware";
import { LoginInputSchema } from "../../lib/schemas";

const handler = withValidation(LoginInputSchema, (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    console.log("Hello World!");
  }
});

export default handler;
