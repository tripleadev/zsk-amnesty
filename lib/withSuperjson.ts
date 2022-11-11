import { NextApiRequest, NextApiResponse } from "next";
import superjson from "superjson";

export const withSuperjson =
  <R extends NextApiRequest>(handler: (req: R, res: NextApiResponse) => unknown) =>
  (req: R, res: NextApiResponse) => {
    const defaultResJson = res.json;

    res.json = (data) => {
      return defaultResJson.call(res, superjson.serialize(data));
    };

    return handler(req, res);
  };
