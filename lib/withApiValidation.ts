import { NextApiRequest, NextApiResponse } from "next";
import { AnyObjectSchema, Asserts } from "yup";

type SchemaType = { body?: AnyObjectSchema; query?: AnyObjectSchema };

type InferTypeOrNever<T> = T extends AnyObjectSchema ? Asserts<T> : never;

type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export const withApiValidation =
  <R extends NextApiRequest, S extends SchemaType>(
    schema: S,
    handler: (
      req: Override<
        R,
        {
          body: InferTypeOrNever<S["body"]>;
          query: InferTypeOrNever<S["query"]>;
        }
      >,
      res: NextApiResponse,
    ) => unknown,
  ) =>
  async (req: R, res: NextApiResponse) => {
    try {
      req.body = await schema.body?.validate(req.body, { abortEarly: false });
      req.query = await schema.query?.validate(req.query, { abortEarly: false });

      // @ts-expect-error
      return await handler(req, res);
    } catch (error) {
      return res.status(400).json(error);
    }
  };
