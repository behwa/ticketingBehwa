import mongoose from 'mongoose'; // need to install type defination file

import { app } from './app';

const start = async () => {
  console.log('Starting up... auth Test_223333555666');
  if(!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  // await mongoose.connect('mongodb://localhost')
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection failed', err);
    // process.exit(1);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });

}

start();


