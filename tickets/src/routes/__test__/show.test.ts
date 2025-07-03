import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('return a 404 if the ticket is not found', async() =>{
    const id = new mongoose.Types.ObjectId().toHexString();
    
    const response = await request(app)
        // .get('/api/tickets/1232143124qwe')
        .get(`/api/tickets/${id}`)
        .send()
        .expect(404);

    // console.log('hey hey')
    // console.log(response.body)
})


it('return the ticket if the ticket is found', async() =>{
    const cookie = await global.signin(); // Wait for the cookie

    const title = "concert";
    const price = 20;

    const reponse = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title, price
        })
        .expect(201);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${reponse.body.id}`)
        .send()
        .expect(200);

    expect(ticketResponse.body.title).toEqual(title)
    expect(ticketResponse.body.price).toEqual(price)
});