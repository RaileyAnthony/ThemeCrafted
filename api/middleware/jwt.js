import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

export const verifyToken = (req, res, next) => {
  let token;
  // Look for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // (Optional) fallback: check cookies if you want to support both
  // if (!token && req.cookies.accessToken) token = req.cookies.accessToken;

  if (!token) return next(createError(401, "You are not authenticated!"));

  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err) return next(createError(403, "Token Not Valid!"));
    req.userId = payload.id;
    req.isSeller = payload.isSeller;
    next();
  });
};
