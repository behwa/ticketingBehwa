import express from "express";
import 'express-async-errors';
import { json } from "body-parser";
// import mongoose from 'mongoose'; // need to install type defination file
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from '@behwatickets/common';
import { createTicketRouter } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes/index";
import { updateTicketRouter } from "./routes/update";

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

app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.get('*', async (req, res /*, next*/) => {
  throw new NotFoundError();
  // next(new NotFoundError());
});

// Add this line — your global error handler middleware
app.use(errorHandler);

export { app };