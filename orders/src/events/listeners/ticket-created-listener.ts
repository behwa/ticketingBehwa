import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@behwatickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    console.log('test 11')
    const ticket = Ticket.build({
      id, 
      title, 
      price
    });
    console.log('hehe')

    let dataSaved = await ticket.save();
    console.log('yes saved dataSaved  = ' +  dataSaved)
    msg.ack();
  }

}