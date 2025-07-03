import nats, {Message, Stan} from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const clientId = `${randomBytes(4).toString('hex')}_listener`;

const stan = nats.connect('ticketing', clientId, {
    url: 'http://localhost:4222'
})

stan.on('connect', () => {
    console.log('Lisener connected to NATS');

    stan.on('close', () => {
        console.log('NATS connection close!');
        process.exit();
    })

    new TicketCreatedListener(stan).listen();

    // const options = stan .subscriptionOptions() .setManualAckMode(true);
    //     const options = stan
    //         .subscriptionOptions()
    //         .setManualAckMode(true)
    //         .setDeliverAllAvailable()
    //         .setDurableName('accounting-service');

    // const subscription = stan.subscribe(
    //     'ticket:created',
    //     'orders-service-queue-group',
    //     options
    // );

    // subscription.on('message', (msg: Message) => {
    //     // console.log('Message received');

    //     const data = msg.getData();

    //     if(typeof data === 'string') {
    //         console.log(
    //             `Recevied event #${msg.getSequence()}, with data: ${data}`
    //         )
    //     }

    //     msg.ack();

    // });
})

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());



