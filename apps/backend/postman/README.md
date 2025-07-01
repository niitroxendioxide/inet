# Travel Platform API - Postman Collection

This directory contains a Postman collection for testing the Travel Platform API endpoints.

## Setup Instructions

1. Install [Postman](https://www.postman.com/downloads/)
2. Import the collection:
   - Open Postman
   - Click "Import" button
   - Select the `TravelPlatform.postman_collection.json` file

## Environment Setup

Create a new environment in Postman with the following variables:

- `baseUrl`: The base URL of your API (default: `http://localhost:3000`)
- `authToken`: This will be automatically set after successful login

### Creating the Environment

1. Click the "Environments" tab in Postman
2. Click "New Environment"
3. Name it "Travel Platform Local"
4. Add the variable `baseUrl` with initial value `http://localhost:3000`
5. Save the environment
6. Select the environment from the environment dropdown

## Using the Collection

The collection is organized into four main folders:

### 1. Authentication
- Register User: Create a new user account
- Login: Authenticate and receive a JWT token (automatically sets the `authToken` variable)

### 2. Products
- Get All Products: List all available products
- Get Product by ID: Retrieve a specific product
- Create Product (Admin): Add a new product
- Update Product (Admin): Modify an existing product
- Delete Product (Admin): Remove a product

### 3. Packages
- Get All Packages: List all available travel packages
- Get Package by ID: Retrieve a specific package
- Create Package (Admin): Create a new travel package
- Update Package (Admin): Modify an existing package
- Delete Package (Admin): Remove a package

### 4. Cart
- Get User's Cart: View the current shopping cart
- Add Item to Cart: Add a product or package to cart
- Update Cart Item: Modify item quantity
- Remove Item from Cart: Delete an item from cart

## Testing Flow

1. **Start with Authentication**
   - Register a new user (if needed)
   - Login to get the authentication token
   - The token will be automatically set for subsequent requests

2. **Test Products/Packages (Admin)**
   - Create some products
   - Create packages using the product IDs
   - Test updating and deleting

3. **Test Shopping Cart (Client)**
   - Add products/packages to cart
   - Update quantities
   - Remove items
   - View cart

## Notes

- All endpoints except registration and login require authentication
- Admin endpoints require an admin user token
- The collection uses environment variables to maintain state
- Request bodies are pre-filled with example data
- Variable paths (like `:id`) need to be replaced with actual IDs 