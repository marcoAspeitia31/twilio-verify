import cors from 'cors';

const allowedOrigins = process.env.CORS_ORIGINS?.split(',').map(origin => origin.trim()) || [];
const allowedMethods = ['GET', 'POST', 'OPTIONS'];
const allowedHeaders = ["Content-Type", "Authorization", "x-signature"];

const corsOptionsDelegate = function (req, callback) {
  const origin = req.header('Origin');

  // Permitir peticiones sin origen (como Postman, curl)
  if (!origin) {
    return callback(null, {
      origin: false,
      methods: allowedMethods,
      credentials: true,
      allowedHeaders: allowedHeaders
    });
  }

  if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
    return callback(null, {
      origin: true,
      methods: allowedMethods,
      credentials: true,
      allowedHeaders: allowedHeaders
    });
  }

  // Origen no permitido
  return callback(new Error('CORS_ORIGIN_NOT_ALLOWED'), null);
};

const corsMiddleware = cors(corsOptionsDelegate);

function handleCorsError(err, req, res, next) {
  if (err?.message === 'CORS_ORIGIN_NOT_ALLOWED') {
    return res.status(403).json({
      success: false,
      status: 'cors_rejected',
      message: 'Origen no permitido por la política CORS',
      origin: req.header('Origin') || null,
      allowedOrigins
    });
  }
  next(err);
}

export { corsMiddleware, handleCorsError };
