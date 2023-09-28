// import path from 'path'
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/mongo-db.js';

import stripeRoutes from './stripe/stripeRoutes.js';
import userRoutes from './user/userRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);
app.use(cors({ origin: true }));

app.use('/api/stripe', stripeRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send({ version: 'v0.0.1' });
});

const PORT = process.env.PORT || 4000;

// app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
