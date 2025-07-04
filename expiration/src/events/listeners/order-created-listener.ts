import { Listener, OrderCreatedEvent, Subjects } from "@behwatickets/common";
import { Message } from 'node-nats-streaming';
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('Waiting this many milliseconds to process t he job:', delay);

    await expirationQueue.add({
      orderId: data.id
    }
    , 
    {
      // delay: 10000 // 10000 is 10 seconds
      delay
    }
    );

    msg.ack();
  }
}