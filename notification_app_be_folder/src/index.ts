import express, { Application } from 'express';
import cors from 'cors';
import notificationRoutes from './routes/notificationRoutes';
import { Log } from '../../logging_middleware/dist/index';

const app: Application = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/api', notificationRoutes);

app.get('/health', async (req, res) => {
  await Log('backend', 'info', 'route', 'Health check endpoint called');
  res.json({ status: 'ok', service: 'campus-notifications' });
});

app.listen(PORT, async () => {
  await Log('backend', 'info', 'route', `Campus Notifications Service running on port ${PORT}`);
  console.log(`Campus Notifications Service running on port ${PORT}`);
});
