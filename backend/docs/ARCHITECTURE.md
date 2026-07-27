# Architecture Documentation

## System Overview

The ReteamNow Backend follows a layered architecture pattern with clear separation of concerns:

```
HTTP Request → Middleware → Routes → Controllers → Services → Models → MongoDB
```

## Layers

### 1. Middleware Layer (`/middlewares`)

Handles cross-cutting concerns before requests reach route handlers:

- **Authentication** (`authMiddleware.js`): JWT token verification
- **Authorization**: Role-based access control
- **File Upload** (`upload.middleware.js`): Multer-based file handling
- **Validation** (`validationMiddleware.js`): Request data validation
- **Error Handling** (`errorMiddleware.js`): Centralized error response
- **CORS**: Cross-origin resource sharing

### 2. Route Layer (`/routes`)

Defines API endpoints and connects them to controller functions.

### 3. Controller Layer (`/controllers`)

Handles HTTP-specific concerns:
- Parsing request data
- Calling appropriate service functions
- Formatting and sending responses
- Error handling for HTTP contexts

### 4. Service Layer (`/service`)

Contains business logic:
- Orchestrating complex operations
- Integrating with external APIs (Gemini, OpenAI, Google Drive)
- Sending notifications (email, in-app)
- Processing data transformations

### 5. Model Layer (`/models`)

Mongoose schema definitions for MongoDB collections.

## Data Flow

```
Client → Express Router → Auth Middleware → Route → Controller → Service → Mongoose Model → MongoDB
```

## Real-time Communication

Socket.IO handles real-time events:
- Join rooms based on `userId`
- Event-driven notifications
- Chat messaging

## Multi-tenancy

The application uses a workspace-based multi-tenancy model:
- Each organization (workspace) has isolated data
- Data filtering via `workspaceName` field on documents
- Users can belong to multiple workspaces

## External Integrations

1. **Google Gemini AI** - Question generation for compliance tests
2. **OpenAI** - AI-powered features
3. **Google Drive** - Document extraction for compliance content
4. **Google Health Connect** - Fitness data (mobile app)
5. **Nodemailer** - Email delivery
6. **AWS S3** - File storage (optional)

## Security Considerations

- JWT tokens with configurable expiry
- Password hashing with bcrypt
- CORS configuration
- Input validation middleware
- File upload size limits
- MongoDB injection prevention via Mongoose
