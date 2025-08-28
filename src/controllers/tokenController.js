import { generatePublicToken } from "../services/jwtService.js";

export const generateToken = (req, res) => {
  try {
    const token = generatePublicToken();
    res.json({ token });
  } catch (error) {
    return res.status(403).json({ error: "Ocurrió un error al generar token" });
  }
};
