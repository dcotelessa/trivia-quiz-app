const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Set up the in-memory MongoDB server before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  console.log(`Connecting to in-memory MongoDB at ${mongoUri}`);
  
  await mongoose.connect(mongoUri);
  console.log('Connected to in-memory MongoDB');
});

// Clear all collections after each test
afterEach(async () => {
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Stop the server and close connections after all tests
afterAll(async () => {
  if (mongoose.connection) {
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
  console.log('In-memory MongoDB server stopped');
});

// Increase Jest timeout for all tests
jest.setTimeout(30000);
