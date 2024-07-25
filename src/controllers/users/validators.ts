import createHttpError from "http-errors";
import isEmail from "validator/lib/isEmail";

import type { UsersCreateBody } from "../../types/routes/users";

export const validateCreateBody = (body: Partial<UsersCreateBody>) => {
  const { username, email, password, city, name } = body;

  if (!username) {
    throw createHttpError(400, "Username required");
  }
  if (username.length < 5) {
    throw createHttpError(400, "Username must contain at least 5 characters");
  }

  if (!email) {
    throw createHttpError(400, "Email required");
  }
  if (!isEmail(email)) {
    throw createHttpError(400, "Email is invalid");
  }

  if (!password) {
    throw createHttpError(400, "Password required");
  }
  if (password.length < 8) {
    throw createHttpError(400, "Password must contain at least 8 characters");
  }

  if (city && typeof city !== "string") {
    throw createHttpError(400, "City must be a string");
  }

  if (!name) {
    throw createHttpError(400, "Name required");
  }
  if (typeof name !== "string") {
    throw createHttpError(400, "Name must be a string");
  }

  // As the function checked the properties are not missing,
  // return the body as original type
  return body as UsersCreateBody;
};
