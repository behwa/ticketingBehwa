import mongoose from 'mongoose'; // need to install type defination file

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

const start = async () => {
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

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();
    
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


