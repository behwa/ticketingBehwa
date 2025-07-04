import { Publisher, Subjects, TicketCreatedEvent } from '@behwatickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
