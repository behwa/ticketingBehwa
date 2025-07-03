import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@behwatickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 0.5 * 60; // 15 * 60;

router.post('/api/orders', 
        requireAuth, 
        [
                body('ticketId')
                .not()
                .isEmpty()
                .custom( (input: string) => mongoose.Types.ObjectId.isValid(input) )
                .withMessage('TicketId must be provided')
        ], 
        validateRequest, 
        async (req: Request, res: Response) => {
                console.log('test')
                console.log('req.body = ' + JSON.stringify(req.body))
                const { ticketId } = req.body;
                // console.log('checking the ticketId = ' + ticketId);
                // Find the ticket the user is trying to order in the database.
                // const ticket = await Ticket.findById(userId);
                const ticket = await Ticket.findById(ticketId);
                // console.log('checking the ticket = ' + ticket);
                if (!ticket) {
                        // throw new BadRequestError('Ticket is already reserved');
                        throw new NotFoundError();
                }

                const isReserved = await ticket.isReserved();

                // Make sure that this ticket is not already reserve.
                // Run query look all order. Find an order where
                // ticket is thcket we found and order status is not cancelled.
                // If we find an order from that means the ticket is reserved.
                const isReserve = await ticket.isReserved();
                if(isReserve) {
                        throw new BadRequestError('Ticket is already reserved');
                }

                // Calculate an expiration date for this order.
                const expiration = new Date();
                expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS )

                // Build the order and save it to the database
                const order = Order.build({
                        userId: req.currentUser!.id,
                        status: OrderStatus.Created,
                        expiresAt: expiration,
                        ticket // ticket: ticket
                })
                let dataSaved = await order.save();
                console.log('dataSaved = ' + dataSaved);

                // Publish an event saying that an order was created
                new OrderCreatedPublisher(natsWrapper.client).publish({
                        id: order.id,
                        version: order.version,
                        status: order.status,
                        userId: order.userId,
                        expiresAt: order.expiresAt.toISOString(),
                        ticket: {
                                id: ticket.id,
                                price: ticket.price
                        }
                })

                res.status(201).send(order);
                // res.send({})
        }
)

export { router as newOrderRouter };