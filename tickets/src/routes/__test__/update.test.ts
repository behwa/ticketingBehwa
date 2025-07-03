import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async() => {
    const cookie = global.signin(); // Wait for the cookie
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: 'qwewqe',
            price: 20
        })
        .expect(404)
})

it('returns a 401 if the user is not authenticated', async() => {
    const cookie = global.signin(); // Wait for the cookie
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'qwewqe',
            price: 20
        })
        .expect(401)
})

it('returns a 401 if the user does not own the ticket', async () => {
  const userOneCookie = global.signin(); // user A

  // User A creates the ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', userOneCookie)
    .send({
      title: 'Original Title',
      price: 50,
    });

  const userTwoCookie = global.signin(); // user B

  // User B tries to update it
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', userTwoCookie)
    .send({
      title: 'Hacked Title',
      price: 999,
    })
    .expect(401); // Expect Unauthorized
});

it('returns a 400 if the user provides and invalid title or price', async() => {
    const userOneCookie = global.signin(); // user A

  // User A creates the ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', userOneCookie)
    .send({
      title: 'Original Title',
      price: 50,
    });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', userOneCookie)
        .send({
            title: '',
            price: 20
        })
        .expect(400);
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', userOneCookie)
        .send({
            title: '1232asd',
            price: -10
        })
        .expect(400);
})

it('updates the ticket provided valid inputs', async() => {
  const userOneCookie = global.signin(); // user A

  // User A creates the ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', userOneCookie)
    .send({
      title: 'Original Title',
      price: 50,
    });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', userOneCookie)
        .send({
            title: 'new title',
            price: 100
        })
        .expect(200);

    const ticketResponse = await request(app)
                .get(`/api/tickets/${response.body.id}`)
                .send();
    
    expect(ticketResponse.body.title).toEqual('new title');
    expect(ticketResponse.body.price).toEqual(100);
})

it('publishers an event', async() => {
  const userOneCookie = global.signin(); // user A

  // User A creates the ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', userOneCookie)
    .send({
      title: 'Original Title',
      price: 50,
    });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', userOneCookie)
      .send({
          title: 'new title',
          price: 100
      })
      .expect(200);

    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
})

it('rejects update if the ticket is reserved', async () => {
  const userOneCookie = global.signin(); // user A

  // User A creates the ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', userOneCookie)
    .send({
      title: 'Original Title',
      price: 50,
    });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', userOneCookie)
    .send({
        title: 'new title',
        price: 100
    })
    .expect(400);
})