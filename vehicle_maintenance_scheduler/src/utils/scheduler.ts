import { Log } from '../../../logging_middleware/dist/index';

export interface Task {
  TaskID: string;
  Duration: number;
  Impact: number;
}

export interface ScheduledTask {
  TaskID: string;
  Duration: number;
  Impact: number;
}

export interface ScheduleResult {
  depotID: number;
  mechanicHours: number;
  scheduledTasks: ScheduledTask[];
  totalImpact: number;
  totalDuration: number;
}

export function knapsackSchedule(tasks: Task[], capacity: number): ScheduledTask[] {
  const n = tasks.length;
  
  if (n === 0 || capacity === 0) {
    return [];
  }

  const dp: number[][] = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const task = tasks[i - 1];
    for (let w = 0; w <= capacity; w++) {
      if (task.Duration <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - task.Duration] + task.Impact
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  const selectedTasks: ScheduledTask[] = [];
  let w = capacity;
  
  for (let i = n; i > 0 && w > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      const task = tasks[i - 1];
      selectedTasks.push({
        TaskID: task.TaskID,
        Duration: task.Duration,
        Impact: task.Impact
      });
      w -= task.Duration;
    }
  }

  return selectedTasks.reverse();
}

export async function scheduleForDepot(depotID: number, mechanicHours: number, tasks: Task[]): Promise<ScheduleResult> {
  await Log('backend', 'info', 'service', `Starting schedule for depot ${depotID} with ${mechanicHours} hours`);
  
  const scheduledTasks = knapsackSchedule(tasks, mechanicHours);
  
  const totalImpact = scheduledTasks.reduce((sum, task) => sum + task.Impact, 0);
  const totalDuration = scheduledTasks.reduce((sum, task) => sum + task.Duration, 0);
  
  await Log('backend', 'info', 'service', `Scheduled ${scheduledTasks.length} tasks for depot ${depotID} with total impact ${totalImpact}`);
  
  return {
    depotID,
    mechanicHours,
    scheduledTasks,
    totalImpact,
    totalDuration
  };
}
