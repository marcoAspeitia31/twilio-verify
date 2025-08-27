import { verifyToken } from '../services/jwtService.js';

export function verifyJwt(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token faltante' });

  const token = authHeader.split(' ')[1]; 
  if (!token) return res.status(401).json({ error: 'Token faltante' });

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}
