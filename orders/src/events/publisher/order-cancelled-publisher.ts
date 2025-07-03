import { Publisher, OrderCancelledEvent, Subjects  } from "@behwatickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
} 