import { RequestHandler, ErrorRequestHandler } from "express";
import { findUserByEmail } from "prisma/queries.js";

export const errorHandlingMW: ErrorRequestHandler = (
  error: Error,
  req,
  res,
  next
) => {
  console.error(error);
  console.log("1");
  if (error.name === "DatabaseError")
    res.status(500).json("An error occurred.");
};

export const getName: RequestHandler = async (req, res, next) => {
  const name = await findUserByEmail("1");
  if (!name) {
    res.status(404).json("User not found.");
    return;
  }
  res.json(name);
  return;
};
