import Queue from 'bull';
import { ExpirationCompletePublisher } from '../src/events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../src/nats-wrapper';

//crete interface call payload
//list out all the properties
interface Payload {
  orderId: string;
}

// channel , bucket - generic type payload
const expirationQueue = new Queue<Payload>('order:expiration', {
  //options object.
  redis: {
    host: process.env.REDIS_HOST
  }
});

// this is process statement
expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  })
  console.log(
    'I want to publish an enpiration: complee event for oderId', 
    job.data.orderId
  );
});

export { expirationQueue }