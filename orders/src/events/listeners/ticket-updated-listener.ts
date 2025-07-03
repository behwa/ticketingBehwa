import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@behwatickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    // console.log('current data in quer come in = ' +  JSON.stringify(data));
    // const ticket = await Ticket.findOne({
    //   _id: data.id//,
    //   // title: '1111 user concert 22'
    // });

    // const ticket = await Ticket.findByEvent({
    //   id: data.id,
    //   version: data.version,
    // });

    const ticket = await Ticket.findByEvent(data);

    // console.log('hey hey any ticket found? = ' + ticket)
    if(!ticket) {
      throw new Error('Ticket not found');
    }

    const { title, price } = data;
    ticket.set({title, price});
    // console.log('come here? data = ' + JSON.stringify(data))
    let feebackSave = await ticket.save();

    // console.log('feebackSave = ' + feebackSave)

    msg.ack();

  }
}