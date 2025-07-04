import mongoose from 'mongoose'; // need to install type defination file

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

const start = async () => {
  console.log('Orderr starting.....222');
  if(!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!')
  }

  if(!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  if(!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined')
  }

  if(!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined')
  }
  if(!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined')
  }

  // await mongoose.connect('mongodb://localhost')
  try {
    // await natsWrapper.connect('ticketing', 'qweasd', 'http://nats-srv:4222');
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL

    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection close!');
      process.exit();
    })

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection failed', err);
    // process.exit(1);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });

}

start();


