export default function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // eslint-disable-next-line no-console
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ message });
}
