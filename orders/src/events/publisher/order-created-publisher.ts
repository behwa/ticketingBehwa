import { Publisher, OrderCreatedEvent, Subjects  } from "@behwatickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
} 