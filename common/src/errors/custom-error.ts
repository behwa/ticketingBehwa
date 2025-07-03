export abstract class CustomError extends Error {
  // here list down all properties must be verify other class use to extended.
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[] // this is define a signature - not a method.

}

// class NotFoundError extends CustomError {
//   statusCode = 404;
// }