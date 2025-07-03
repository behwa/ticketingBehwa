import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { validateRequest, BadRequestError, RequestValidationError } from '@behwatickets/common';

// import { validateRequest } from "../middlewares/validate-request";
// import { RequestValidationError } from "../errors/request-validation-error";
// import { DatabaseConnectionError } from "../errors/database-connection-error";


import { User } from "../models/user";
// import { BadRequestError } from "../errors/bad-request-error";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    // console.log("Creating a user...");
    // throw new DatabaseConnectionError();
    // throw new Error("Error connecting to database");

    // res.send({});
    const { email, password } = req.body;

    const existingUser = await User.find({ email });
    console.log('existingUser' + JSON.stringify(existingUser));

    if (existingUser.length > 0) {
      console.log('Email in use');
      throw new BadRequestError('Email in use');
      // return res.send({});
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate json web token 
    // if(!process.env.JWT_KEY) {
    //   throw new Error('jwtkeyError')
    // }
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    },  process.env.JWT_KEY! );


    //Store it on session object - refine entire object 
    req.session = {
      jwt: userJwt
    };

    res.status(201).send(user);

  }
);

export { router as signupRouter };
