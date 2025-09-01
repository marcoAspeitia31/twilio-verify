import { generateSign } from "../services/hmacService.js";

export const hmacMiddleware = (req, res, next) => {
  try {
    const receivedSign = req.headers["x-signature"];
    const payload = req.body;

    if (!receivedSign) {
      return res.status(400).json({ error: "Falta la firma en headers" });
    }

    const expectedSign = generateSign(payload);

    if (receivedSign !== expectedSign) {
      return res.status(401).json({ error: "Firma inválida" });
    }

    next();
    
  } catch (error) {
    return res.status(403).json({ error: "Ocurrió un error al validar firma" });
  }
};
