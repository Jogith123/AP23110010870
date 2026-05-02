# Campus Notifications System Design

## Overview
The Campus Notifications Microservice provides real-time updates to students regarding Placements, Events, and Results. This backend service manages notification creation, delivery, and tracking with comprehensive logging integration.

## Architecture

### System Components
```
┌─────────────────────────────────────────────────────────┐
│              Campus Notifications Backend                │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Routes     │  │ Controllers  │  │  Services    │  │
│  │              │  │              │  │              │  │
│  │ - POST /api  │  │ - Create     │  │ - In-memory  │  │
│  │   /notifs    │  │ - Get        │  │   storage    │  │
│  │ - GET /api   │  │ - Mark Read  │  │ - Business   │  │
│  │   /notifs    │  │ - Delete     │  │   logic      │  │
│  │ - PATCH /api │  │              │  │              │  │
│  │   /notifs/:id│  │              │  │              │  │
│  │ - DELETE /api│  │              │  │              │  │
│  │   /notifs/:id│  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │   Logging Middleware    │
              │  (Test Server Integration)│
              └─────────────────────────┘
```

## Data Models

### Notification
```typescript
interface Notification {
  id: string;                    // Unique identifier
  type: 'placement' | 'event' | 'result';
  title: string;                 // Notification title
  message: string;               // Detailed message
  targetAudience: string[];      // Target user groups
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;               // Timestamp
  isRead: boolean;               // Read status
}
```

### CreateNotificationRequest
```typescript
interface CreateNotificationRequest {
  type: 'placement' | 'event' | 'result';
  title: string;
  message: string;
  targetAudience: string[];
  priority?: 'low' | 'medium' | 'high';  // Default: medium
}
```

## API Endpoints

### 1. Create Notification
**Endpoint:** `POST /api/notifications`

**Request Body:**
```json
{
  "type": "placement",
  "title": "Google Interview Scheduled",
  "message": "Your interview with Google is scheduled for tomorrow at 10 AM",
  "targetAudience": ["computer-science", "final-year"],
  "priority": "high"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "1714672800000-abc123def",
    "type": "placement",
    "title": "Google Interview Scheduled",
    "message": "Your interview with Google is scheduled for tomorrow at 10 AM",
    "targetAudience": ["computer-science", "final-year"],
    "priority": "high",
    "createdAt": "2024-05-02T10:00:00.000Z",
    "isRead": false
  }
}
```

### 2. Get All Notifications
**Endpoint:** `GET /api/notifications`

**Query Parameters:**
- `type` (optional): Filter by notification type
- `isRead` (optional): Filter by read status (true/false)
- `priority` (optional): Filter by priority level

**Example:** `GET /api/notifications?type=placement&isRead=false`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1714672800000-abc123def",
      "type": "placement",
      "title": "Google Interview Scheduled",
      "message": "Your interview with Google is scheduled for tomorrow at 10 AM",
      "targetAudience": ["computer-science", "final-year"],
      "priority": "high",
      "createdAt": "2024-05-02T10:00:00.000Z",
      "isRead": false
    }
  ],
  "count": 1
}
```

### 3. Get Notifications by Type
**Endpoint:** `GET /api/notifications/type/:type`

**Example:** `GET /api/notifications/type/event`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "1714672900000-xyz789ghi",
      "type": "event",
      "title": "Tech Symposium",
      "message": "Annual Tech Symposium starts next week",
      "targetAudience": ["all-students"],
      "priority": "medium",
      "createdAt": "2024-05-02T10:01:40.000Z",
      "isRead": false
    }
  ],
  "count": 1
}
```

### 4. Mark as Read
**Endpoint:** `PATCH /api/notifications/:id/read`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "1714672800000-abc123def",
    "type": "placement",
    "title": "Google Interview Scheduled",
    "message": "Your interview with Google is scheduled for tomorrow at 10 AM",
    "targetAudience": ["computer-science", "final-year"],
    "priority": "high",
    "createdAt": "2024-05-02T10:00:00.000Z",
    "isRead": true
  }
}
```

### 5. Delete Notification
**Endpoint:** `DELETE /api/notifications/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

## Logging Integration

All operations are logged using the custom Logging Middleware:

- **Stack:** `backend`
- **Levels:** `info`, `warn`, `error`
- **Packages:** `controller`, `service`, `route`

### Logging Examples
- Notification creation: `Log('backend', 'info', 'service', 'Created placement notification: Google Interview Scheduled')`
- Notification retrieval: `Log('backend', 'info', 'service', 'Retrieved 5 notifications')`
- Error handling: `Log('backend', 'error', 'controller', 'Failed to create notification: ...')`

## Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Logging:** Custom Logging Middleware (Test Server Integration)
- **Data Storage:** In-memory (for evaluation purposes)

## Security Considerations

- Pre-authorized users (no authentication required for this evaluation)
- CORS enabled for cross-origin requests
- Input validation on all endpoints
- Error handling with proper logging

## Future Enhancements

- WebSocket integration for real-time push notifications
- Database persistence (PostgreSQL/MongoDB)
- User preference management
- Notification scheduling
- Email/SMS integration
- Push notification support (FCM/APNs)
