import { Router } from 'express';
import { getSchedule, getScheduleByDepot } from '../controllers/schedulerController';

const router = Router();

router.get('/schedule', getSchedule);
router.get('/schedule/:depotID', getScheduleByDepot);

export default router;
