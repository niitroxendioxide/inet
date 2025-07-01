# Travel Platform API Documentation

## Overview

This is the backend API for the Travel Platform, a system that allows users to browse, purchase, and manage travel packages and individual travel products.

## Tech Stack

- **Node.js & Express**: Backend framework
- **TypeScript**: Programming language
- **Prisma**: ORM and database toolkit
- **PostgreSQL**: Database
- **JWT**: Authentication mechanism

## Project Structure

```
apps/backend/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── index.ts          # Application entry point
│   ├── middleware/       # Custom middleware
│   │   ├── auth.ts      # Authentication middleware
│   │   └── errorHandler.ts # Error handling middleware
│   ├── routes/          # API routes
│   │   ├── auth.ts      # Authentication routes
│   │   ├── products.ts  # Product management
│   │   ├── packages.ts  # Package management
│   │   └── cart.ts      # Shopping cart operations
│   └── types/          # TypeScript type definitions
│       └── express.d.ts # Express type extensions
```

## Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      UserRole @default(CLIENT)
  carts     Cart[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Product Model
```prisma
model Product {
  id          String      @id @default(cuid())
  name        String
  description String
  price       Float
  type        ProductType
  packages    Package[]   @relation("PackageToProduct")
  cartItems   CartItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

### Package Model
```prisma
model Package {
  id          String    @id @default(cuid())
  name        String
  description String
  price       Float
  products    Product[] @relation("PackageToProduct")
  cartItems   CartItem[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Two roles are supported:
- CLIENT: Regular users who can browse and purchase
- ADMIN: Administrators who can manage products and packages

### Authentication Endpoints

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## Products API

### Endpoints

#### Get All Products
```http
GET /api/products
Authorization: Bearer <token>
```

#### Get Product by ID
```http
GET /api/products/:id
Authorization: Bearer <token>
```

#### Create Product (Admin Only)
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Flight to Paris",
  "description": "Direct flight to Paris",
  "price": 500.00,
  "type": "FLIGHT"
}
```

#### Update Product (Admin Only)
```http
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Flight to Paris",
  "price": 550.00
}
```

#### Delete Product (Admin Only)
```http
DELETE /api/products/:id
Authorization: Bearer <token>
```

## Packages API

### Endpoints

#### Get All Packages
```http
GET /api/packages
Authorization: Bearer <token>
```

#### Get Package by ID
```http
GET /api/packages/:id
Authorization: Bearer <token>
```

#### Create Package (Admin Only)
```http
POST /api/packages
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Paris Adventure",
  "description": "Complete Paris travel package",
  "price": 1200.00,
  "productIds": ["product1-id", "product2-id"]
}
```

#### Update Package (Admin Only)
```http
PUT /api/packages/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Paris Adventure",
  "price": 1300.00,
  "productIds": ["product1-id", "product3-id"]
}
```

#### Delete Package (Admin Only)
```http
DELETE /api/packages/:id
Authorization: Bearer <token>
```

## Shopping Cart API

### Endpoints

#### Get User's Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

#### Add Item to Cart
```http
POST /api/cart/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product-id",  // Either productId or packageId
  "packageId": "package-id",  // must be provided, not both
  "quantity": 1
}
```

#### Update Cart Item
```http
PUT /api/cart/items/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 2
}
```

#### Remove Item from Cart
```http
DELETE /api/cart/items/:id
Authorization: Bearer <token>
```

## Error Handling

The API uses a centralized error handling mechanism through the `AppError` class and `errorHandler` middleware. Common HTTP status codes used:

- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Example error response:
```json
{
  "status": "error",
  "message": "Invalid input data"
}
```

## Development

### Environment Variables

Create a `.env` file in the `apps/backend` directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/travel_platform?schema=public"
JWT_SECRET="your-super-secret-key-change-this-in-production"
PORT=3000
```

### Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build the application
- `pnpm start`: Start production server
- `pnpm prisma:generate`: Generate Prisma Client
- `pnpm prisma:migrate:dev`: Create and apply migrations in development
- `pnpm prisma:migrate:deploy`: Apply migrations in production
- `pnpm prisma:studio`: Open Prisma Studio
- `pnpm db:setup`: Full database setup

### Type Safety

The API is fully typed using TypeScript, including:
- Request and response types
- Database models through Prisma
- Express route handlers
- Middleware functions

### Security Features

1. Password Hashing
   - Passwords are hashed using bcrypt before storage

2. JWT Authentication
   - Tokens expire after 24 hours
   - Protected routes require valid JWT
   - Role-based access control for admin functions

3. Input Validation
   - Request body validation using express-validator
   - Type checking through TypeScript
   - Prisma schema validation

4. Error Handling
   - Centralized error handling
   - Consistent error responses
   - Production-safe error messages

## API Response Examples

### Successful Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CLIENT"
  }
}
```

### Product Response
```json
{
  "id": "product-id",
  "name": "Flight to Paris",
  "description": "Direct flight to Paris",
  "price": 500.00,
  "type": "FLIGHT",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Cart Response
```json
{
  "id": "cart-id",
  "userId": "user-id",
  "items": [
    {
      "id": "item-id",
      "quantity": 1,
      "product": {
        "id": "product-id",
        "name": "Flight to Paris",
        "price": 500.00
      }
    }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
``` 
