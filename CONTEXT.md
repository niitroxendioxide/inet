# 🧳 Travel Packages Platform - Project Context

## 🧠 Overview

We are developing a **travel sales platform** for a school project. The platform allows users to explore and purchase **tourism packages** that may include:

- ✈️ Flights  
- 🏨 Accommodations  
- 🚌 Transportation  
- 🗺️ Excursions  

Users can either buy:
- Complete **travel packages** (a combination of the products above), or  
- **Individual products** (e.g., only a hotel or a flight).

Whenever a user selects a package or individual product, it is **added to a shopping cart** for checkout.

---

## 🖥️ Applications Overview

The platform is split into two main applications:

### 1. Frontend
- **Framework**: React + TypeScript  
- **Views**:  
  - **Client View**: Users can browse, view, and purchase travel packages or individual products.  
  - **Admin View**: Administrators can manage (create, update, delete) travel products and packages.

### 2. Backend
- **Tech Stack**: Express + TypeScript + Prisma + PostgreSQL  
- **Responsibilities**:
  - Manage business logic and data persistence.
  - Expose a REST or GraphQL API to the frontend.
  - Handle authentication (e.g., Admin vs. Client roles).
  - Process shopping cart logic and order creation.

---

## 🏗️ Monorepo Setup

The project will be organized as a **monorepo** using `pnpm`. It will contain:

travel-platform/
├── apps/
│ ├── frontend/ # React + TS application
│ └── backend/ # Express + TS + Prisma server
├── packages/
│ ├── ui/ # Shared UI components (optional)
│ └── config/ # Shared configuration (e.g., tsconfig, ESLint)
├── prisma/ # Database schema and migrations
├── .env # Environment variables
└── pnpm-workspace.yaml

---

## 🧑‍💻 Roles & Permissions

- **Client Users**
  - Browse and search packages/products.
  - Add items to cart.
  - Purchase products.
  - View past orders.

- **Admin Users**
  - Add/edit/delete flights, hotels, excursions, and transports.
  - Create custom packages combining these products.
  - Monitor purchases and user activity (basic analytics).

---

## 🎯 UX Reference

The UX/UI is inspired by modern travel platforms such as:
- [Despegar](https://www.despegar.com/)
- [Airbnb](https://www.airbnb.com/)

Clients should experience a fluid, user-friendly interface that supports filtering, product detail views, and seamless checkout. Admins should have access to intuitive product management interfaces.

---

## 🔐 Authentication

Authentication will likely support:
- Email/password login
- Role-based access control (Client vs Admin)

Can be handled via:
- JWT based
- Admin panel routes protected in the frontend.

---

## 📦 Products & Packages Data Model (Simplified)

```plaintext
User
├── id
├── name
├── role (CLIENT | ADMIN)

Product (abstract)
├── id
├── name
├── description
├── price
├── type (FLIGHT | HOTEL | EXCURSION | TRANSPORT)

Package
├── id
├── name
├── description
├── price
├── productIds[] → relation to multiple products

Cart
├── id
├── userId
├── items[] → Products or Packages
