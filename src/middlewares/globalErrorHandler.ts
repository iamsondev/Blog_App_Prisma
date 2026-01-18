import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errDetails = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    ((statusCode = 400),
      (errorMessage = "You provided incorrect field type or errorMessage"));
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      ((statusCode = 400),
        (errorMessage =
          "An operation failed because it depends on one or more records that were required but not found"));
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    ((statusCode = 500), (errorMessage = "Error occurred during execution"));
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === "p1000") {
      ((statusCode = 400),
        (errorMessage =
          "Authentication failed!! please check your credential"));
    }
    if (err.errorCode === "p1001") {
      ((statusCode = 400), (errorMessage = "Can't reach database server"));
    }
  }
  res.status(statusCode);
  res.json({
    message: errorMessage,
    error: errDetails,
  });
}

export default errorHandler;
