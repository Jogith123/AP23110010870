import axios from 'axios';
import { Log } from '../../../logging_middleware/dist/index';

const EVALUATION_SERVICE_URL = 'http://20.207.122.201/evaluation-service';

export interface Depot {
  ID: number;
  MechanicHours: number;
}

export interface Vehicle {
  TaskID: string;
}

export interface Task {
  TaskID: string;
  Duration: number;
  Impact: number;
}

export interface DepotsResponse {
  depots: Depot[];
}

export interface VehiclesResponse {
  vehicles: Vehicle[];
}

const CREDENTIALS = {
  clientID: '545d1313-e08e-4430-8a6a-9dfc082a2fc6',
  clientSecret: 'QazEdxfkezUzVRJF'
};

let accessToken: string | null = null;

async function getAccessToken(): Promise<string> {
  if (accessToken) return accessToken;
  
  try {
    const authResponse = await axios.post(`${EVALUATION_SERVICE_URL}/auth`, {
      clientID: CREDENTIALS.clientID,
      clientSecret: CREDENTIALS.clientSecret
    });
    
    accessToken = authResponse.data.access_token;
    await Log('backend', 'info', 'service', 'Successfully obtained access token');
    return accessToken!;
  } catch (error) {
    await Log('backend', 'error', 'service', `Failed to get access token: ${error}`);
    throw error;
  }
}

export async function fetchDepots(): Promise<Depot[]> {
  try {
    const token = await getAccessToken();
    const response = await axios.get<DepotsResponse>(`${EVALUATION_SERVICE_URL}/depots`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await Log('backend', 'info', 'service', `Fetched ${response.data.depots.length} depots`);
    return response.data.depots;
  } catch (error) {
    await Log('backend', 'error', 'service', `Failed to fetch depots: ${error}`);
    throw error;
  }
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    const token = await getAccessToken();
    const response = await axios.get<VehiclesResponse>(`${EVALUATION_SERVICE_URL}/vehicles`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await Log('backend', 'info', 'service', `Fetched ${response.data.vehicles.length} vehicles`);
    return response.data.vehicles;
  } catch (error) {
    await Log('backend', 'error', 'service', `Failed to fetch vehicles: ${error}`);
    throw error;
  }
}

export async function fetchTasks(): Promise<Task[]> {
  try {
    const token = await getAccessToken();
    const response = await axios.get<Task[]>(`${EVALUATION_SERVICE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    await Log('backend', 'info', 'service', `Fetched ${response.data.length} tasks`);
    return response.data;
  } catch (error) {
    await Log('backend', 'error', 'service', `Failed to fetch tasks: ${error}`);
    throw error;
  }
}
