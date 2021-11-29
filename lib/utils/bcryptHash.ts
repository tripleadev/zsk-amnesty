import Bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hash = (password: string) => {
  return Bcrypt.hash(password, SALT_ROUNDS);
};

export const compare = (password: string, hash: string) => {
  return Bcrypt.compare(password, hash);
};
