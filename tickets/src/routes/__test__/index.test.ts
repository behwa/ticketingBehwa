import request from 'supertest';
import { app } from '../../app';
import { response } from 'express';

// helper function
const createTicket =  async () => {
    const cookie = await global.signin(); // Wait for the cookie

    return request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'qweasd',
            price: 20
        })
}

it('can fetch a list of tickets', async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200);

    expect(response.body.length).toEqual(3)
})