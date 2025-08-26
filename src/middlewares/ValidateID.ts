import { Request, Response, NextFunction } from "express";


export const ValidatedID = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;


  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ message: "Invalid ID: Must be a positive number" });
  }

  next();
};
