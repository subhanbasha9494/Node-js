# DevTinder - A Professional Connection Management API

DevTinder is a RESTful API that enables professionals to create profiles, manage connections, and build their professional network. It provides secure user authentication, comprehensive profile management, and a connection request system similar to professional networking platforms.

The application is built using Express.js and MongoDB, featuring JWT-based authentication, bcrypt password hashing, and mongoose for data modeling. It implements a robust validation system for user inputs and provides a clean API interface for managing professional connections with different states (interested, ignored, accepted, rejected).

## Repository Structure
```
.
├── package.json              # Project dependencies and scripts
└── src/                     # Source code directory
    ├── app.js              # Application entry point and Express setup
    ├── config/             # Configuration files
    │   └── database.js     # MongoDB connection configuration
    ├── middlewares/        # Custom middleware functions
    │   └── auth.js         # JWT authentication middleware
    ├── models/             # Mongoose data models
    │   ├── connectionRequest.js  # Connection request schema
    │   └── user.js         # User profile schema
    ├── routes/             # API route handlers
    │   ├── auth.js         # Authentication routes (login/signup)
    │   ├── profile.js      # Profile management routes
    │   └── request.js      # Connection request routes
    └── utils/
        └── validation.js   # Input validation utilities
```

## Usage Instructions
### Prerequisites
- Node.js (v12 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd devtinder
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
- Create a MongoDB Atlas cluster or use local MongoDB
- Update the connection string in `src/config/database.js`

4. Start the server:
```bash
npm run dev
```

### Quick Start
1. Create a new user account:
```bash
curl -X POST http://localhost:9494/signup \
-H "Content-Type: application/json" \
-d '{
  "firstName": "John",
  "lastName": "Doe",
  "emailId": "john@example.com",
  "password": "StrongPass123!"
}'
```

2. Login to get authentication token:
```bash
curl -X POST http://localhost:9494/login \
-H "Content-Type: application/json" \
-d '{
  "emailId": "john@example.com",
  "password": "StrongPass123!"
}'
```

### More Detailed Examples
1. Update user profile:
```bash
curl -X PATCH http://localhost:9494/profile/edit \
-H "Content-Type: application/json" \
-H "Cookie: token=<your-jwt-token>" \
-d '{
  "skills": ["JavaScript", "Node.js"],
  "about": "Full-stack developer with 5 years experience"
}'
```

2. Send connection request:
```bash
curl -X POST http://localhost:9494/request/send/interested/<user-id> \
-H "Cookie: token=<your-jwt-token>"
```

### Troubleshooting
Common issues and solutions:

1. Authentication Errors
- Error: "Invalid Credentials"
  - Verify email and password are correct
  - Ensure email is registered
  - Check if password meets strength requirements

2. Connection Issues
- Error: "Connection Request Already Exists"
  - Check existing connection status
  - Wait for previous request to be resolved

3. Profile Updates
- Error: "Invalid Edit Request"
  - Verify update fields match allowed fields list
  - Check data format for each field

## Data Flow
The application follows a standard REST API flow where authentication tokens control access to protected resources, and data is validated before being stored in MongoDB.

```ascii
Client -> Auth Middleware -> Route Handler -> Database
   ^                                            |
   |____________________________________________|
           Response with processed data
```

Key component interactions:
1. Authentication middleware validates JWT tokens
2. Route handlers process validated requests
3. Mongoose models enforce data schema
4. Validation utilities ensure data integrity
5. Database layer persists user and connection data
6. Error handling middleware catches and formats errors
7. Response formatting provides consistent API output