import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
  id: string;
  isAdmin?: boolean;
}

export const verifyToken = (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing after Bearer" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const verifyAdmin = (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) => {
  verifyToken(req, res, () => {
    if (req.user?.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
  });
};

export const verifyUserOrAdmin = (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) => {
  verifyToken(req, res, () => {
    if (req.user?.isAdmin || req.user?.id === req.params.id) {
      next();
    } else {
      return res.status(403).json({ message: "Access denied. Not allowed." });
    }
  });
};
