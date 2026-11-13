export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  let status = error.status || 500;
  let message = error.message || "Something went wrong.";

  if (error.code === "ER_DUP_ENTRY") {
    status = 409;
    message = "A record with these details already exists.";
  }

  if (error.code === "LIMIT_FILE_SIZE") {
    status = 400;
    message = "Image is too large. Maximum size is 5 MB.";
  }

  if (error.code === "ECONNREFUSED" || error.code === "PROTOCOL_CONNECTION_LOST") {
    status = 503;
    message = "The database is unavailable. Please try again later.";
  }

  if (status >= 500) {
    console.error(error);
    message = process.env.NODE_ENV === "production" ? "Internal server error." : message;
  }

  res.status(status).json({ message });
}
