import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
// import mongoose from 'mongoose'; // need to install type defination file
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from '@behwatickets/common';
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrderRouter } from "./routes/index";
import { deleteOrderRouter } from "./routes/delete";

// import { errorHandler } from "./middlewares/error-handler";
// import { NotFoundError } from "./errors/not-found-error";

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

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.get('*', async (req, res /*, next*/) => {
  throw new NotFoundError();
  // next(new NotFoundError());
});

// Add this line — your global error handler middleware
app.use(errorHandler);

export { app };