import jwt from "jsonwebtoken";
import { config } from "../config.js";
export function generateToken<T = any>(data: T) {
  const token = jwt.sign({ ...(data || {}) }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
  const refreshToken = jwt.sign({ ...(data || {}) }, config.jwtSecret + "refresh", {
    expiresIn: config.jwtExpiresIn,
  });
  return {
    token,
    refreshToken,
  };
}
