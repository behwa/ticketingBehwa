export enum OrderStatus {

    // Wehn the order has been created, but the 
    // ticket it is trying to order has not beem reserved
    Created = 'created',

    // The ticket the order is trying to reserve has already
    // been reserved, or when the user has canncelled the order
    // The order expires before payment
    Cancelled = 'cancelled',

    // The order has successfully reserved the ticket
    AwaitingPayment = 'awaiting:payment',

    // THe order has reserved the ticket and the user has
    // provided payment successfully
    Complete = 'complete'
}