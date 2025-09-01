import { generateSign } from "../services/hmacService.js";

export const generateHmacSign = (req, res) => {
  try {
    const { payload } = req.body;
    const sign = generateSign(payload);
    return res.status(200).json({ sign });
  } catch (error) {
    return res
      .status(403)
      .json({ error: "Ocurrió un error al generar firma cifrada" });
  }
};
