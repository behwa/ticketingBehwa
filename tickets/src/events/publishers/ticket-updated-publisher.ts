import { Publisher, Subjects, TicketUpdatedEvent } from '@behwatickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}


