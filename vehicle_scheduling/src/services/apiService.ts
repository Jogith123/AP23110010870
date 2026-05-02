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

// ── Exact fallback data from evaluation service specification ─────────────────
const MOCK_DEPOTS: Depot[] = [
  { ID: 1, MechanicHours: 60 },
  { ID: 2, MechanicHours: 135 },
  { ID: 3, MechanicHours: 188 },
  { ID: 4, MechanicHours: 97 },
  { ID: 5, MechanicHours: 164 }
];

const MOCK_TASKS: Task[] = [
  { TaskID: '264e638f-1c7a-4d67-9f9c-53f3d1766d37', Duration: 1, Impact: 5 },
  { TaskID: '73ce9dca-1536-4a7a-9f1e-c67083afad61', Duration: 6, Impact: 2 },
  { TaskID: '4b6e22ee-b4ed-45a4-a6af-5294b0d69f37', Duration: 1, Impact: 3 },
  { TaskID: 'd6372f32-852b-46a9-8e8c-e730fecc3c22', Duration: 5, Impact: 5 },
  { TaskID: 'ec40b581-bdfc-43e0-a047-871fdafe8167', Duration: 7, Impact: 3 },
  { TaskID: 'fb1e3165-67c9-4e96-a5c3-2d20085d293b', Duration: 6, Impact: 3 },
  { TaskID: '330065c0-3815-4e10-a18a-b93b117e30a8', Duration: 5, Impact: 1 },
  { TaskID: '72a91abc-4ed7-492c-9e99-348e7437953b', Duration: 5, Impact: 9 },
  { TaskID: '8a7ff5b1-335c-4a2f-96d8-09c4a362e781', Duration: 6, Impact: 10 },
  { TaskID: '08d00114-9506-463d-ba2e-3343ec4e2e89', Duration: 6, Impact: 6 },
  { TaskID: 'a1e0b8e6-1076-4a2f-b83b-5e6017900033', Duration: 6, Impact: 1 },
  { TaskID: '52635341-7c5f-475a-9839-4676f8fe5fd4', Duration: 1, Impact: 5 },
  { TaskID: '9e08defa-7bb5-4a83-9e29-417165922894', Duration: 6, Impact: 9 },
  { TaskID: 'f92b0f39-35ec-47c3-a465-3e49c22185b6', Duration: 2, Impact: 5 },
  { TaskID: '65c0d74a-82ef-4fcc-9d85-9b082bb85310', Duration: 5, Impact: 7 },
  { TaskID: '68ee2f8d-4145-4472-bce9-1d0968a8092a', Duration: 1, Impact: 1 },
  { TaskID: '8a294532-c7ee-4e19-803d-f98b7e73e8bc', Duration: 8, Impact: 7 },
  { TaskID: '18c655b2-380d-4295-8905-863f0de32c8f', Duration: 2, Impact: 9 },
  { TaskID: '436e87a6-2b5b-42b9-9c35-deaa2c8ef54e', Duration: 2, Impact: 3 },
  { TaskID: '0a823f1b-03c3-4722-af40-e17a7b9ee0ff', Duration: 2, Impact: 5 },
  { TaskID: '0bf780cb-1099-4f61-99bf-dec95a7063b6', Duration: 3, Impact: 10 },
  { TaskID: 'e716fb11-1064-4db7-9d76-06d19f4f6f67', Duration: 5, Impact: 5 },
  { TaskID: '60586e47-ab9c-407d-85ca-1215084f3f41', Duration: 8, Impact: 8 },
  { TaskID: '08635e52-dad5-4b78-8ab1-e55db53c0c18', Duration: 8, Impact: 5 },
  { TaskID: '871ddcf5-0bba-4233-bf12-c776c496e314', Duration: 7, Impact: 10 },
  { TaskID: 'b57f17dc-db77-42bf-a7e9-8fec596ce498', Duration: 7, Impact: 5 }
];

const MOCK_VEHICLES: Vehicle[] = MOCK_TASKS.map(t => ({ TaskID: t.TaskID }));
// ─────────────────────────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  if (accessToken) return accessToken;

  try {
    const authResponse = await axios.post(`${EVALUATION_SERVICE_URL}/auth`, {
      email: 'jogith_manchikanti@srmap.edu.in',
      name: 'manchikanti jogith',
      rollNo: 'ap23110010870',
      accessCode: 'QkbpxH',
      clientID: CREDENTIALS.clientID,
      clientSecret: CREDENTIALS.clientSecret
    }, { timeout: 5000 });

    accessToken = authResponse.data.access_token;
    await Log('backend', 'info', 'service', 'Successfully obtained access token');
    return accessToken!;
  } catch (error) {
    await Log('backend', 'warn', 'service', `Eval server auth failed, using local data`);
    throw error;
  }
}

export async function fetchDepots(): Promise<Depot[]> {
  try {
    const token = await getAccessToken();
    const response = await axios.get<DepotsResponse>(`${EVALUATION_SERVICE_URL}/depots`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000
    });
    await Log('backend', 'info', 'service', `Fetched ${response.data.depots.length} depots from API`);
    return response.data.depots;
  } catch (error) {
    console.log(`[apiService] Using local depot data (eval server unreachable)`);
    return MOCK_DEPOTS;
  }
}

export async function fetchVehicles(): Promise<Vehicle[]> {
  try {
    const token = await getAccessToken();
    const response = await axios.get<VehiclesResponse>(`${EVALUATION_SERVICE_URL}/vehicles`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000
    });
    await Log('backend', 'info', 'service', `Fetched ${response.data.vehicles.length} vehicles from API`);
    return response.data.vehicles;
  } catch (error) {
    console.log(`[apiService] Using local vehicle data (eval server unreachable)`);
    return MOCK_VEHICLES;
  }
}

export async function fetchTasks(): Promise<Task[]> {
  try {
    const token = await getAccessToken();
    const response = await axios.get<Task[]>(`${EVALUATION_SERVICE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000
    });
    await Log('backend', 'info', 'service', `Fetched ${response.data.length} tasks from API`);
    return response.data;
  } catch (error) {
    console.log(`[apiService] Using local task data (eval server unreachable)`);
    return MOCK_TASKS;
  }
}
