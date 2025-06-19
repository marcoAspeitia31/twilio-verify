import basicAuth from 'basic-auth';

export default function authMiddleware(req, res, next) {
  const user = basicAuth(req);
  if (!user || user.name !== process.env.BASIC_AUTH_USER || user.pass !== process.env.BASIC_AUTH_PASS) {
    res.set('WWW-Authenticate', 'Basic realm="example"');
    return res.status(401).send('Authentication required.');
  }
  next();
}
