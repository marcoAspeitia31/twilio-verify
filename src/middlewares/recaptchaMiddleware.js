import axios from "axios";

export const captchaMiddleware = (expectedAction, minScore = 1) => {
  return async (req, res, next) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          error: "Falta el token de reCAPTCHA",
        });
      }

      const captchaObject = {
        event: {
          token: token,
          expectedAction: expectedAction,
          siteKey: process.env.RECAPTCHA_API_KEY,
        },
      };

      const response = await axios({
        method: "post",
        url: `${process.env.RECAPTCHA_BASE_URL}?key=${process.env.FIREBASE_API_KEY}`,
        data: captchaObject,
      });

      const data = response.data;

      //validar token
      if (!data.tokenProperties.valid) {
        return res.status(403).json({ error: "reCAPTCHA inválido" });
      }

      // Comparar acción
      if (data.event.expectedAction !== expectedAction) {
        return res.status(403).json({
          error: `Acción inválida`,
        });
      }

      // Validar score
      if (data.riskAnalysis.score < minScore) {
        return res.status(403).json({
          error: `Score demasiado bajo: ${data.score}`,
        });
      }


      next(); // pasa al controlador
    } catch (error) {
      return res.status(500).json({ error: "Error interno de verificación" });
    }
  };
};
