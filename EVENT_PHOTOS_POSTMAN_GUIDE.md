# Event Photos API Integration Guide

## Backend Endpoints Required

Your backend needs to implement these endpoints for the Event Photos functionality:

### 1. Get Event Photos
**GET** `https://app-backend-production-31a4.up.railway.app/api/event-photo/{eventId}/photos`

**Headers:**
```
Authorization: Bearer {your_jwt_token}
Content-Type: application/json
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "photos": [
      {
        "_id": "64f123abc789",
        "eventId": "64e456def012",
        "user": {
          "_id": "64d789ghi345",
          "fname": "John",
          "lname": "Doe",
          "userLogo": "https://example.com/avatar.jpg"
        },
        "imageUrl": "https://example.com/event-photo.jpg",
        "caption": "Great event photo!",
        "likes": ["64d789ghi345", "64e456def012"],
        "reactions": [
          {
            "user": "64d789ghi345",
            "emoji": "👍",
            "createdAt": "2024-01-15T10:30:00Z"
          }
        ],
        "likeCount": 2,
        "reactionCounts": {
          "👍": 1,
          "❤️": 2
        },
        "totalEngagement": 5,
        "createdAt": "2024-01-15T09:15:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### 2. Get Event Details with Photos
**GET** `https://app-backend-production-31a4.up.railway.app/api/event-photo/{eventId}/details`

**Headers:**
```
Authorization: Bearer {your_jwt_token}
Content-Type: application/json
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "event": {
      "_id": "64e456def012",
      "title": "Team Building Event",
      "description": "Annual team building activities",
      "status": "active",
      "createdAt": "2024-01-10T08:00:00Z"
    },
    "photos": [
      // Same format as Get Event Photos
    ]
  }
}
```

### 3. Get Event Leaderboard
**GET** `https://app-backend-production-31a4.up.railway.app/api/event-photo/{eventId}/leaderboard`

**Headers:**
```
Authorization: Bearer {your_jwt_token}
Content-Type: application/json
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "user": {
        "_id": "64d789ghi345",
        "fname": "John",
        "lname": "Doe",
        "userLogo": "https://example.com/avatar.jpg"
      },
      "stats": {
        "totalPhotos": 5,
        "totalLikes": 25,
        "totalReactions": 15,
        "totalEngagement": 40
      }
    }
  ]
}
```

### 4. Upload Event Photo
**POST** `https://app-backend-production-31a4.up.railway.app/api/event-photo/{eventId}/upload`

**Headers:**
```
Authorization: Bearer {your_jwt_token}
Content-Type: multipart/form-data
```

**Body (FormData):**
```
photo: [Image File]
caption: "Optional caption text"
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "_id": "64f123abc789",
    "eventId": "64e456def012",
    "user": {
      "_id": "64d789ghi345",
      "fname": "John",
      "lname": "Doe"
    },
    "imageUrl": "https://example.com/uploaded-photo.jpg",
    "caption": "Great event!",
    "likes": [],
    "reactions": [],
    "likeCount": 0,
    "reactionCounts": {},
    "totalEngagement": 0,
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

### 5. Like/Unlike Photo
**POST** `https://app-backend-production-31a4.up.railway.app/api/event-photo/photo/{photoId}/like`

**Headers:**
```
Authorization: Bearer {your_jwt_token}
Content-Type: application/json
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "action": "liked", // or "unliked"
    "likeCount": 3,
    "totalEngagement": 8,
    "likes": ["64d789ghi345", "64e456def012", "64f789jkl678"]
  }
}
```

### 6. Add Reaction to Photo
**POST** `https://app-backend-production-31a4.up.railway.app/api/event-photo/photo/{photoId}/reaction`

**Headers:**
```
Authorization: Bearer {your_jwt_token}
Content-Type: application/json
```

**Body:**
```json
{
  "emoji": "👍"
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "reactionCounts": {
      "👍": 2,
      "❤️": 1
    },
    "totalEngagement": 10,
    "reactions": [
      {
        "user": "64d789ghi345",
        "emoji": "👍",
        "createdAt": "2024-01-15T13:00:00Z"
      }
    ]
  }
}
```

## Postman Test Data for Mock Insertion

Since you don't have mock data, here are the exact Postman requests to insert test data:

### Step 1: Create Sample Event Photos (Mock Insert)

**POST** `https://app-backend-production-31a4.up.railway.app/api/event-photo/mock/insert`

**Headers:**
```
Authorization: Bearer {your_jwt_token}
Content-Type: application/json
```

**Body:**
```json
{
  "eventId": "REPLACE_WITH_ACTUAL_EVENT_ID",
  "mockPhotos": [
    {
      "user": {
        "_id": "USER_ID_1",
        "fname": "Alice",
        "lname": "Johnson",
        "userLogo": "https://randomuser.me/api/portraits/women/1.jpg"
      },
      "imageUrl": "https://picsum.photos/400/400?random=1",
      "caption": "Amazing team building activities! 🎉",
      "likes": ["USER_ID_2", "USER_ID_3"],
      "reactions": [
        {
          "user": "USER_ID_2",
          "emoji": "👍",
          "createdAt": "2024-01-15T10:30:00Z"
        },
        {
          "user": "USER_ID_3",
          "emoji": "❤️",
          "createdAt": "2024-01-15T10:45:00Z"
        }
      ],
      "likeCount": 2,
      "reactionCounts": {
        "👍": 1,
        "❤️": 1
      },
      "totalEngagement": 4
    },
    {
      "user": {
        "_id": "USER_ID_2",
        "fname": "Bob",
        "lname": "Smith",
        "userLogo": "https://randomuser.me/api/portraits/men/2.jpg"
      },
      "imageUrl": "https://picsum.photos/400/400?random=2",
      "caption": "Great food and even better company! 🍕",
      "likes": ["USER_ID_1", "USER_ID_3", "USER_ID_4"],
      "reactions": [
        {
          "user": "USER_ID_1",
          "emoji": "🔥",
          "createdAt": "2024-01-15T11:00:00Z"
        },
        {
          "user": "USER_ID_4",
          "emoji": "👍",
          "createdAt": "2024-01-15T11:15:00Z"
        }
      ],
      "likeCount": 3,
      "reactionCounts": {
        "🔥": 1,
        "👍": 1
      },
      "totalEngagement": 5
    },
    {
      "user": {
        "_id": "USER_ID_3",
        "fname": "Carol",
        "lname": "Wilson",
        "userLogo": "https://randomuser.me/api/portraits/women/3.jpg"
      },
      "imageUrl": "https://picsum.photos/400/400?random=3",
      "caption": "Perfect weather for outdoor activities! ☀️",
      "likes": ["USER_ID_1", "USER_ID_2"],
      "reactions": [
        {
          "user": "USER_ID_1",
          "emoji": "✨",
          "createdAt": "2024-01-15T12:00:00Z"
        }
      ],
      "likeCount": 2,
      "reactionCounts": {
        "✨": 1
      },
      "totalEngagement": 3
    }
  ]
}
```

### Step 2: Test Individual Endpoints

1. **First, get your actual event ID** from your existing events:
   **GET** `https://app-backend-production-31a4.up.railway.app/api/event`

2. **Replace placeholders** in the mock data:
   - `REPLACE_WITH_ACTUAL_EVENT_ID` → Use an actual event ID from step 1
   - `USER_ID_1`, `USER_ID_2`, etc. → Use actual user IDs from your database

3. **Test the endpoints** one by one using the actual event ID and user IDs.

## Frontend Integration Notes

The EventPhotosScreen is now configured to work with these endpoints:

1. **Automatic token handling**: Uses AsyncStorage to get JWT tokens
2. **Error handling**: Shows appropriate error messages
3. **Loading states**: Displays loading indicators
4. **Refresh functionality**: Pull-to-refresh support
5. **Empty states**: Shows when no photos exist

## Next Steps

1. Implement these backend endpoints in your Node.js server
2. Use the Postman requests above to insert mock data
3. Test the frontend functionality with real data
4. Implement image upload functionality with proper file handling

The frontend is ready to consume these APIs once your backend implements them!
