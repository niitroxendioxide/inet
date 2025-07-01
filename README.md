# Travel Platform

A monorepo travel sales platform that allows users to explore and purchase tourism packages.

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: Express + TypeScript + Prisma + PostgreSQL
- **Package Manager**: pnpm
- **Authentication**: JWT

## 📁 Project Structure

```
travel-platform/
├── apps/
│   ├── frontend/     # React + TS application
│   └── backend/      # Express + TS + Prisma server
├── packages/
│   ├── ui/          # Shared UI components (optional)
│   └── config/      # Shared configuration
├── prisma/          # Database schema and migrations
└── pnpm-workspace.yaml
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (v8 or higher)
- PostgreSQL (v14 or higher)

### Installation

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   - cd apps/backend  
   - Copy `.env.example` to `.env` in the backend directory
   - Update the database connection string and JWT secret

3. Initialize the database:
   ```bash
   cd apps/backend
   pnpm prisma:generate
   pnpm prisma:migrate:dev
   ```

### Development

1. Start the backend server:
   ```bash
   pnpm dev
   ```

### Production
```bash
pnpm install --frozen-lockfile; pnpm run build
pnpm run start
```
2. The API will be available at `http://localhost:3000`



## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products (Protected Routes)
- `GET /api/products` - Get all products
- `POST /api/products` - Create a product (Admin only)
- `PUT /api/products/:id` - Update a product (Admin only)
- `DELETE /api/products/:id` - Delete a product (Admin only)

### Packages (Protected Routes)
- `GET /api/packages` - Get all packages
- `POST /api/packages` - Create a package (Admin only)
- `PUT /api/packages/:id` - Update a package (Admin only)
- `DELETE /api/packages/:id` - Delete a package (Admin only)

### Cart (Protected Routes)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove item from cart