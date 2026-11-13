import httpError from "../utils/httpError.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function required(fields) {
  return (req, res, next) => {
    const missing = fields.filter((field) => {
      const value = req.body?.[field];
      return value === undefined || value === null || String(value).trim() === "";
    });

    if (missing.length > 0) {
      return next(httpError(400, `Please provide: ${missing.join(", ")}.`));
    }
    next();
  };
}

export function validEmail(field = "email") {
  return (req, res, next) => {
    const value = req.body?.[field];
    if (value !== undefined && value !== "" && !EMAIL_PATTERN.test(String(value).trim())) {
      return next(httpError(400, "Please enter a valid email address."));
    }
    next();
  };
}

export function minLength(field, length) {
  return (req, res, next) => {
    const value = req.body?.[field];
    if (value !== undefined && String(value).length < length) {
      return next(httpError(400, `${field} must be at least ${length} characters.`));
    }
    next();
  };
}

export function oneOf(field, allowed) {
  return (req, res, next) => {
    const value = req.body?.[field];
    if (value !== undefined && value !== "" && !allowed.includes(value)) {
      return next(httpError(400, `Invalid value for ${field}.`));
    }
    next();
  };
}

export function cleanBody(req, res, next) {
  if (req.body && typeof req.body === "object") {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === "string") req.body[key] = req.body[key].trim();
    }
  }
  next();
}
