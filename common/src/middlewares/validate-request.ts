import { Request, Response, NextFunction } from "express";
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error'

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    
    console.log('req.body =', req.body);
    console.log('req.params =', req.params);
    console.log('req.query =', req.query);
    console.log('test validationResult1')

    const errors = validationResult(req);
    console.log('errors =', errors.array());
    if(!errors.isEmpty()) {
        console.log('isEmpty come in? ')
        throw new RequestValidationError(errors.array());
    }

    next();
}