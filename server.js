const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Global unhandle exception
process.on('uncaughtException', err => {
  console.log('UNHANDLER EXCEPTION! 🤬 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env'});
const app = require('./app');

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => {console.log('DB connection successful!')});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}....`);
});

// Global unhandle rejection 
process.on('unhandledRejection', err => {
  console.log('UNHANDLER REJECTION! 🤬 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Global unhandle exception
process.on('uncaughtException', err => {
  console.log('UNHANDLER EXCEPTION! 🤬 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
