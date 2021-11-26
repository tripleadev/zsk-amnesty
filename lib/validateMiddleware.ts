import { NextApiRequest, NextApiResponse } from "next";
import { OptionalObjectSchema, ObjectShape } from "yup/lib/object";

export const withValidation = (
  schema: OptionalObjectSchema<ObjectShape>,
  handler: (req: NextApiRequest, res: NextApiResponse) => unknown,
) => {
  if (req.method === "POST" || req.method === "PUT") {
    try {
      req.body = await schema.validate(req.body, { abortEarly: false });
      return handler(req, res);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
  return handler(req, res);
};
