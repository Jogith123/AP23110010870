import { Request, Response } from 'express';
import { fetchDepots, fetchTasks } from '../services/apiService';
import { scheduleForDepot } from '../utils/scheduler';
import { Log } from '../../../logging_middleware/dist/index';

export async function getSchedule(req: Request, res: Response): Promise<void> {
  try {
    await Log('backend', 'info', 'controller', 'Received schedule request');
    
    const depots = await fetchDepots();
    const tasks = await fetchTasks();
    
    const results = [];
    
    for (const depot of depots) {
      const result = await scheduleForDepot(depot.ID, depot.MechanicHours, tasks);
      results.push(result);
    }
    
    await Log('backend', 'info', 'controller', `Generated schedule for ${results.length} depots`);
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    await Log('backend', 'error', 'controller', `Schedule generation failed: ${error}`);
    res.status(500).json({
      success: false,
      error: 'Failed to generate schedule'
    });
  }
}

export async function getScheduleByDepot(req: Request, res: Response): Promise<void> {
  try {
    const depotID = parseInt(req.params.depotID);
    
    if (isNaN(depotID)) {
      await Log('backend', 'warn', 'controller', `Invalid depot ID: ${req.params.depotID}`);
      res.status(400).json({
        success: false,
        error: 'Invalid depot ID'
      });
      return;
    }
    
    await Log('backend', 'info', 'controller', `Received schedule request for depot ${depotID}`);
    
    const depots = await fetchDepots();
    const depot = depots.find(d => d.ID === depotID);
    
    if (!depot) {
      await Log('backend', 'warn', 'controller', `Depot ${depotID} not found`);
      res.status(404).json({
        success: false,
        error: 'Depot not found'
      });
      return;
    }
    
    const tasks = await fetchTasks();
    const result = await scheduleForDepot(depotID, depot.MechanicHours, tasks);
    
    await Log('backend', 'info', 'controller', `Generated schedule for depot ${depotID}`);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    await Log('backend', 'error', 'controller', `Schedule generation failed for depot: ${error}`);
    res.status(500).json({
      success: false,
      error: 'Failed to generate schedule'
    });
  }
}
