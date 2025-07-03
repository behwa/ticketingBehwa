import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
// import mongoose from 'mongoose'; // need to install type defination file
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError } from '@behwatickets/common';

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
// import { errorHandler } from "./middlewares/error-handler";
// import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set('trust proxy', true); // needed if behind proxy (like Docker, Ingress)
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.get('*', async (req, res /*, next*/) => {
  throw new NotFoundError();
  // next(new NotFoundError());
});

app.use(errorHandler);

export { app };