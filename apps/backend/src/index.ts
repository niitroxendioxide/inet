import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { productsRouter } from './routes/products';
import { packagesRouter } from './routes/packages';
import { cartRouter } from './routes/cart';
import { errorHandler } from './middleware/errorHandler';
import { authenticateJWT } from './middleware/auth';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', authenticateJWT, productsRouter);
app.use('/api/packages', authenticateJWT, packagesRouter);
app.use('/api/cart', authenticateJWT, cartRouter);

// Error handling
app.use(errorHandler);

// Start server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
}); 