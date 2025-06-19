import cors from 'cors';

const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];

const corsOptions = {
  origin: function (origin, callback) {
    // Aceptar si no hay origin (Postman, Apphive) o si está en la lista blanca
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true // Si deseas permitir cookies/autenticación cruzada
};

export default cors(corsOptions);
