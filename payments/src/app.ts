import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from '@behwatickets/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true); // needed if behind proxy (like Docker, Ingress)
app.use(json());
app.use(
  cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !== 'test'
    secure: false
  })
);

app.use(currentUser);

app.use(createChargeRouter);

app.get('*', async (req, res /*, next*/) => {
  throw new NotFoundError();
  // next(new NotFoundError());
});

// Add this line — your global error handler middleware
app.use(errorHandler);

export { app };