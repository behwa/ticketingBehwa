import request from 'supertest';
import { app } from '../../app';
// import setup from '../../test/setup'; 
import { Ticket } from '../../models/ticket';

import { natsWrapper } from '../../nats-wrapper';


it('has a route handler listening to /api/tickets for post request', async () => {
    const response = await request(app)
     .post('/api/tickets')
     .send({});

    // console.log('response = ' + JSON.stringify(response));

    expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is singed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({})
        .expect(401);

    // console.log('response = ' + JSON.stringify(response));
})

it('returns a status other than 401 if the user is signed in', async () => {
    const cookie = await global.signin(); // Wait for the cookie

    const response = await request(app)
     .post('/api/tickets')
     .set('Cookie', cookie)
     .send({});

    console.log('response = ' + JSON.stringify(response));

    expect(response.status).not.toEqual(401)
})

it('return an error if an invalid title is provided', async () => {
    const cookie = await global.signin(); // Wait for the cookie

    await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 10
        })
        .expect(400);

    await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            price: 10
        })
        .expect(400);
})

it('returns an error if an invalid price is provided', async () => {
    const cookie = await global.signin(); // Wait for the cookie

    await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asdasd',
            price: -10
        })
        .expect(400);
    
    await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'asdasd'
        })
        .expect(400);
})

it('creates a ticket with valid inputs', async () => {
const cookie = global.signin(); // Wait for the cookie

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'asldkfj';

  var response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price: 20,
    })
    .expect(201);


    console.log('response = ' + JSON.stringify(response))

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
})

it('publishers an event', async () => {
    const cookie = global.signin(); // Wait for the cookie

    const title = 'asldkfj';

    console.log('test see natsWrapper')
    console.log(natsWrapper);

    var response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
        title,
        price: 20,
        })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})