# Pull Requests Functionality

## Overview
The Pull Requests feature allows users to extract client notification requests directly from the ITP (Inspecția Tehnică Periodică) station system. This feature bridges the gap between the station's internal system and the notification management application.

## How It Works

### 1. Accessing the Feature
- Navigate to the Dashboard
- Click the blue "Extrage Cereri ITP" (Extract ITP Requests) button in the header

### 2. Pulling Requests
- Click "Extrage Cereri" to connect to the ITP station system
- The system will fetch new client requests that require notifications
- A loading indicator shows the connection progress

### 3. Reviewing Requests
- Pulled requests display with the following information:
  - Request ID and date
  - Client name
  - Vehicle plate number
  - Phone number
  - Suggested expiration date
  - Additional notes (if any)

### 4. Importing Selected Requests
- Use checkboxes to select which requests to import
- "Selectează toate" option for bulk selection
- Click "Importă selectate" to add them to your notification system
- Selected requests become regular notifications in the dashboard

## API Integration

### Expected API Endpoints
```
GET /api/stations/pull-requests
- Returns new client requests from ITP station
- Response format:
{
  "success": true,
  "requests": [
    {
      "id": "REQ_123",
      "plateNumber": "B123ABC",
      "clientName": "Popescu Ion",
      "phoneNumber": "0721234567",
      "requestDate": "2024-01-01T10:00:00Z",
      "suggestedExpirationDate": "2025-01-01T10:00:00Z",
      "notes": "Optional notes"
    }
  ]
}

POST /api/notifications/bulk-import
- Imports multiple notifications at once
- Request format:
{
  "notifications": [
    {
      "plateNumber": "B123ABC",
      "phoneNumber": "0721234567",
      "validity": "1y",
      "expirationDate": "2025-01-01",
      "source": "ITP_STATION_PULL"
    }
  ]
}
```

## Mock Data (Development Mode)
When the API endpoints are not available, the system uses mock data to demonstrate functionality:
- Generates 5-12 sample requests
- Uses realistic Romanian plate numbers and phone numbers
- Includes various client names and scenarios
- Simulates API delays for realistic user experience

## Error Handling
The system handles various error scenarios:
- Connection failures to ITP station
- Authentication errors
- No new requests available
- System maintenance periods

## Features
- **Real-time Pull**: Connects to live ITP station system
- **Bulk Selection**: Select multiple requests for import
- **Request Preview**: Review all details before importing
- **Error Recovery**: Graceful handling of connection issues
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Clear feedback during operations