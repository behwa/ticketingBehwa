import exporess, { Request, Response } from 'express';
import { body /*, validationResult*/ } from 'express-validator'
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@behwatickets/common';

import { Password } from '../services/password';
// import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
// import { BadRequestError } from '../errors/bad-request-error';

// import { RequestValidationError } from '../errors/request-validation-error';

const router = exporess.Router();

router.post('/api/users/signin',
[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('You must supply a password')
    
],
validateRequest,
async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if(!existingUser) {
        throw new BadRequestError('Invalid credentials2');
    }
    console.log('xistingUser.password = ' + existingUser.password)
    console.log('password = ' + password)
    const passwordsMatch = await Password.compare(existingUser.password, password );

    if( !passwordsMatch) {
        throw new BadRequestError('Invalid Credentials3');
    }

    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    },  process.env.JWT_KEY! );


    //Store it on session object - refine entire object 
    req.session = {
        jwt: userJwt
    };

    res.status(200).send(existingUser);


    // const errors = validationResult(req);

    // if(!errors.isEmpty()) {
    //     throw new RequestValidationError(errors.array());
    // }


    // res.send('Hi there! Test33 88 signin');
} )

export { router as signinRouter };