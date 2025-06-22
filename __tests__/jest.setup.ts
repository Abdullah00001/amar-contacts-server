// import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// jest.mock('ioredis', () => require('ioredis-mock'));

// beforeAll(async () => {
//   const dbUri = process.env.MONGODB_URI as string;
//   await mongoose.connect(dbUri);
// });

// afterEach(async () => {
//   const collections = await mongoose.connection.db?.collections();
//   if (collections) {
//     for (const collection of collections) {
//       await collection.deleteMany({});
//     }
//   }
// });

// afterAll(async () => {
//   await mongoose.disconnect();
// });
