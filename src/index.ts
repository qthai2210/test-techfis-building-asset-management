import 'reflect-metadata'; // Must be first
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './inversify.config';
import express from 'express';
import cors from 'cors';
import { config } from './config';
import { authRouter } from './routes/auth.route';
import { adminRouter } from './routes/admin.route';
import { errorMiddleware } from './middlewares/error.middleware';

// Start the server
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const rootPath = '/api/v1';

app.use(`${rootPath}/auth`, authRouter);
app.use(`${rootPath}/admin`, adminRouter);

// Health check (manually added as it's simple)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Global Error Handling Middleware (Must be the last middleware)
app.use(errorMiddleware);

app.listen(config.PORT, () => {
  console.log(`🚀 Server is running on port ${config.PORT}`);
});