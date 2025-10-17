import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ||
  "7d") as SignOptions["expiresIn"];

export interface TokenPayload extends JwtPayload {
  userId: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
