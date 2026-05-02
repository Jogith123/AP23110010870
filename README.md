# Vehicle Maintenance Scheduler

A microservice for optimizing vehicle maintenance task scheduling using the Knapsack algorithm to maximize operational impact within mechanic-hour constraints.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│           Vehicle Maintenance Scheduler                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Routes     │  │ Controllers  │  │  Services    │     │
│  │              │  │              │  │              │     │
│  │ GET /api/    │  │ - Schedule   │  │ - API Calls  │     │
│  │   schedule   │  │   Logic      │  │ - Auth       │     │
│  │ GET /api/    │  │              │  │              │     │
│  │   schedule/  │  │              │  │              │     │
│  │   :depotID   │  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │   Logging Middleware    │
              │  (Test Server Integration)│
              └─────────────────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │     Test Server APIs    │
              │  /depots, /tasks, etc.  │
              └─────────────────────────┘
```

## Project Structure

```
AP23110010870/
├── logging_middleware/          # Reusable logging package
│   ├── src/
│   │   ├── auth.ts             # Authentication module
│   │   ├── logger.ts           # Log function implementation
│   │   └── index.ts            # Package exports
│   ├── dist/                   # Compiled JavaScript
│   └── package.json
├── vehicle_maintenance_scheduler/  # Main application
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   │   └── schedulerController.ts
│   │   ├── services/           # Business logic & API calls
│   │   │   └── apiService.ts
│   │   ├── routes/             # API route definitions
│   │   │   └── schedulerRoutes.ts
│   │   ├── utils/              # Utility functions
│   │   │   └── scheduler.ts    # Knapsack algorithm
│   │   └── index.ts            # Application entry point
│   ├── dist/                   # Compiled JavaScript
│   └── package.json
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Jogith123/AP23110010870.git
cd AP23110010870
```

2. **Install dependencies for logging middleware**
```bash
cd logging_middleware
npm install
npm run build
cd ..
```

3. **Install dependencies for vehicle scheduler**
```bash
cd vehicle_maintenance_scheduler
npm install
npm run build
cd ..
```

### Running the Application

**Development mode:**
```bash
cd vehicle_maintenance_scheduler
npm run dev
```

**Production mode:**
```bash
cd vehicle_maintenance_scheduler
npm run build
npm start
```

The service will start on port 3001 by default.

## API Endpoints

### 1. Get Schedule for All Depots
**Endpoint:** `GET /api/schedule`

**Description:** Returns optimized maintenance schedules for all depots.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "depotID": 1,
      "mechanicHours": 60,
      "scheduledTasks": [
        {
          "TaskID": "uuid-string",
          "Duration": 5,
          "Impact": 10
        }
      ],
      "totalImpact": 10,
      "totalDuration": 5
    }
  ]
}
```

### 2. Get Schedule for Specific Depot
**Endpoint:** `GET /api/schedule/:depotID`

**Description:** Returns optimized maintenance schedule for a specific depot.

**Parameters:**
- `depotID` (path parameter): The ID of the depot

**Response:**
```json
{
  "success": true,
  "data": {
    "depotID": 1,
    "mechanicHours": 60,
    "scheduledTasks": [
      {
        "TaskID": "uuid-string",
        "Duration": 5,
        "Impact": 10
      }
    ],
    "totalImpact": 10,
    "totalDuration": 5
  }
}
```

### 3. Health Check
**Endpoint:** `GET /health`

**Description:** Returns service health status.

**Response:**
```json
{
  "status": "ok",
  "service": "vehicle-maintenance-scheduler"
}
```

## Testing with Postman/Insomnia

### Test Collection Setup

**Base URL:** `http://localhost:3001`

### Test Steps

1. **Start the server**
```bash
cd vehicle_maintenance_scheduler
npm start
```

2. **Test Health Check**
- Method: GET
- URL: `http://localhost:3001/health`
- Expected Response: 200 OK with service status

3. **Test Schedule for All Depots**
- Method: GET
- URL: `http://localhost:3001/api/schedule`
- Expected Response: 200 OK with array of depot schedules

4. **Test Schedule for Specific Depot**
- Method: GET
- URL: `http://localhost:3001/api/schedule/1`
- Expected Response: 200 OK with single depot schedule

### Screenshot Requirements

For each API call, capture:
- Request URL and method
- Request body (if applicable)
- Response body
- Response time (shown in Postman/Insomnia)

## Algorithm Details

### Knapsack Algorithm

The scheduler uses a 0/1 Knapsack dynamic programming approach:

- **Items:** Maintenance tasks
- **Weight:** Task duration (mechanic-hours)
- **Value:** Operational impact score
- **Capacity:** Available mechanic-hours per depot

**Time Complexity:** O(n × W) where n = number of tasks, W = mechanic-hours capacity
**Space Complexity:** O(n × W)

## Logging

All operations are logged using the custom logging middleware:

- **Stack:** `backend`
- **Levels:** `debug`, `info`, `warn`, `error`, `fatal`
- **Packages:** `controller`, `service`, `route`, `utils`

Logs are sent to the evaluation service for monitoring and debugging.

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Logging:** Custom middleware with test server integration
- **Algorithm:** Dynamic Programming (Knapsack)

## Error Handling

The service includes comprehensive error handling:
- Invalid depot ID validation
- API failure handling with logging
- Graceful error responses with appropriate HTTP status codes
