import cors from 'cors';

const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];
const allowedMethods = ['GET', 'POST', 'OPTIONS'];

const corsOptionsDelegate = function (req, callback) {
  const origin = req.header('Origin');

  if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
    callback(null, {
      origin: true,
      methods: allowedMethods,
      credentials: true
    });
  } else {
    callback(new Error('CORS_ORIGIN_NOT_ALLOWED'), null);
  }
};

const corsMiddleware = cors(corsOptionsDelegate);

function handleCorsError(err, req, res, next) {
  if (err?.message === 'CORS_ORIGIN_NOT_ALLOWED') {
    return res.status(403).json({
      error: 'Origin not allowed by CORS policy',
      allowedOrigins
    });
  }
  next(err);
}

export { corsMiddleware, handleCorsError };
