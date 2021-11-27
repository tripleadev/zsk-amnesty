import crypto from "crypto";

export const safeRandomString = (bytes: number) => {
  return crypto.randomBytes(bytes).toString("hex");
};
