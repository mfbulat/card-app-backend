import { Response } from "express";

export const errorManage = (
  err: unknown,
  res: Response,
  statusCode: number,
) => {
  if (err instanceof Error) {
    res.status(statusCode).json({ error: err.message });
  } else {
    res.status(statusCode).json({ error: "An unknown error occurred" });
  }
};
