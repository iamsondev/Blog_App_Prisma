import { Request, Response } from "express";
import path from "node:path";

const notFound = async (req: Request, res: Response) => {
  res.status(400).json({
    message: "Route not found",
    path: req.originalUrl,
    date: Date(),
  });
};
export default notFound;
