import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";
// import { RequestValidationError } from "../errors/request-validation-error";
// import { DatabaseConnectionError } from "../errors/database-connection-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log("Something went wrong 22", err);

  if (err instanceof CustomError) {
    // console.log('err.errors = ' + JSON.stringify(err.errors))
    // const formattedErrors = err.errors.map((error) => {
    //   const e = error as { msg: string; path: string };
    //   return { message: e.msg, field: e.path }
    // })
    console.log('handling this error as a request validation error');

    return res.status(err.statusCode).send({ errors: err.serializeErrors() })
  }

  // if (err instanceof DatabaseConnectionError) {
  //   console.log('handling this error as a db connection error');
  //   return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  // }

  console.error(err);
  res.status(400).send({
    errors: [{ message: 'Somethin wnent' }]
  });
};
