import { StatusCodes } from "../utils/statusCodes.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Access token missing or invalid",
    });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(accessToken);
    req.user = decoded; // Attach user info to request
    // decoded: { id: 1, iat: 1751457856, exp: 1751458756 }

    next();
  } catch (err) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};
