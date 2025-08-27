import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export function generatePublicToken() {
  const payload = { type: "public" };
  const token = jwt.sign(payload, SECRET, { expiresIn: '1m' });
  return token;
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}