import { NextApiRequest, NextApiResponse } from "next";
import { AnyObjectSchema, InferType } from "yup";

export const withValidation =
  <R extends NextApiRequest, S extends AnyObjectSchema>(
    schema: S,
    handler: (req: Omit<R, "body"> & { body: InferType<S> }, res: NextApiResponse) => unknown,
  ) =>
  async (req: R, res: NextApiResponse) => {
    try {
      req.body = await schema.validate(req.body, { abortEarly: false });
      return handler(req, res);
    } catch (error) {
      return res.status(400).json(error);
    }
  };
