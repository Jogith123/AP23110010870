import axios from 'axios';
import { getAccessToken } from './auth';

const EVALUATION_SERVICE_URL = 'http://20.207.122.201/evaluation-service';

export type Stack = 'backend' | 'frontend';
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type Package = 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler' | 'repository' | 'route' | 'service';

const VALID_STACKS: Stack[] = ['backend', 'frontend'];
const VALID_LEVELS: Level[] = ['debug', 'info', 'warn', 'error', 'fatal'];
const VALID_PACKAGES: Package[] = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];

export interface LogRequest {
  stack: Stack;
  level: Level;
  package: Package;
  message: string;
}

export interface LogResponse {
  logID: string;
  message: string;
}

function validateStack(stack: string): stack is Stack {
  return VALID_STACKS.includes(stack as Stack);
}

function validateLevel(level: string): level is Level {
  return VALID_LEVELS.includes(level as Level);
}

function validatePackage(pkg: string): pkg is Package {
  return VALID_PACKAGES.includes(pkg as Package);
}

export async function Log(stack: Stack, level: Level, pkg: Package, message: string): Promise<LogResponse> {
  if (!validateStack(stack)) {
    throw new Error(`Invalid stack: ${stack}. Must be one of: ${VALID_STACKS.join(', ')}`);
  }

  if (!validateLevel(level)) {
    throw new Error(`Invalid level: ${level}. Must be one of: ${VALID_LEVELS.join(', ')}`);
  }

  if (!validatePackage(pkg)) {
    throw new Error(`Invalid package: ${pkg}. Must be one of: ${VALID_PACKAGES.join(', ')}`);
  }

  if (!message || typeof message !== 'string') {
    throw new Error('Message must be a non-empty string');
  }

  try {
    const accessToken = await getAccessToken();
    
    const response = await axios.post<LogResponse>(
      `${EVALUATION_SERVICE_URL}/logs`,
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Logging failed: ${error.response?.data?.message || error.message}`);
    }
    throw new Error(`Logging failed: ${String(error)}`);
  }
}
