import axios from 'axios';

const EVALUATION_SERVICE_URL = 'http://20.207.122.201/evaluation-service';

export interface AuthCredentials {
  clientID: string;
  clientSecret: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

let cachedToken: string | null = null;
let credentials: AuthCredentials | null = {
  clientID: '545d1313-e08e-4430-8a6a-9dfc082a2fc6',
  clientSecret: 'QazEdxfkezUzVRJF'
};

export async function register(): Promise<AuthCredentials> {
  try {
    const response = await axios.post(`${EVALUATION_SERVICE_URL}/register`);
    credentials = {
      clientID: response.data.clientID,
      clientSecret: response.data.clientSecret
    };
    return credentials;
  } catch (error) {
    throw new Error(`Registration failed: ${error}`);
  }
}

export async function authenticate(): Promise<string> {
  if (!credentials) {
    credentials = await register();
  }

  try {
    const response = await axios.post<AuthResponse>(
      `${EVALUATION_SERVICE_URL}/auth`,
      {
        clientID: credentials.clientID,
        clientSecret: credentials.clientSecret
      }
    );
    cachedToken = response.data.access_token;
    return cachedToken;
  } catch (error) {
    throw new Error(`Authentication failed: ${error}`);
  }
}

export async function getAccessToken(): Promise<string> {
  if (cachedToken) {
    return cachedToken;
  }
  const token = await authenticate();
  return token;
}

export function setCredentials(creds: AuthCredentials): void {
  credentials = creds;
}
