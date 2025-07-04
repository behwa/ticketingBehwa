import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
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

  } catch (err) {
    console.error('index expiration connection failed', err);
    // process.exit(1);
  }

}

start();


