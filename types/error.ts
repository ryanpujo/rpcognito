import { ValidationError } from 'express-validator';

export class GeneralError extends Error {
  statusCode = 500;
  mongoCode: string | number | undefined;
  constructor(message: string) {
    super(message);
  }
}

export class NotFound extends GeneralError {
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export class BadRequest extends GeneralError {
  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}

export class Unauthorized extends GeneralError {
  constructor(message?: string) {
    super(message ?? 'unauthorized');
    this.statusCode = 401;
  }
}
export class DuplicateError extends GeneralError {
  constructor(message: string, mongoCode: string | number | undefined) {
    super(message);
    this.statusCode = 409;
    this.mongoCode = mongoCode;
  }
}

export class RequestValidationError extends GeneralError {
  constructor(private readonly errs: ValidationError[], message: string) {
    super(message);
    this.statusCode = 400;
  }

  public serializeError() {
    return this.errs.map((verr) => {
      if (verr.type === 'field') {
        return { message: verr.msg, path: verr.path };
      }
      return { message: verr.msg };
    });
  }
}
