import { Listener, Subjects, ExpirationCompleteEvent, OrderStatus } from "@behwatickets/common";
import { Message } from 'node-nats-streaming';
import { queueGroupName } from "./queue-group-name";
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
  queueGroupName = queueGroupName;
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled  //,
      // ticket: null
    })

    await order.save();

    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
          id: order.ticket.id
      }
    });

    msg.ack();
  }
}