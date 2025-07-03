import { Subjects, Publisher, ExpirationCompleteEvent } from "@behwatickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  
}