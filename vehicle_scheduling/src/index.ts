import express, { Application } from 'express';
import cors from 'cors';
import schedulerRoutes from './routes/schedulerRoutes';
import { Log } from '../../logging_middleware/dist/index';

const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', schedulerRoutes);

app.get('/health', async (req, res) => {
  await Log('backend', 'info', 'route', 'Health check endpoint called');
  res.json({ status: 'ok', service: 'vehicle-maintenance-scheduler' });
});

app.listen(PORT, async () => {
  await Log('backend', 'info', 'route', `Vehicle Maintenance Scheduler running on port ${PORT}`);
  console.log(`Vehicle Maintenance Scheduler running on port ${PORT}`);
});
