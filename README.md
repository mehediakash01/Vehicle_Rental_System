# Vehicle Rental System

**Live URL:** *To be added*

- **Admin**
  - Email: `bale@gmail.com`
  - Password: `123456`

---

## Features

- **User Management**
  - Get user
  - Signup user
  - Login user
  - Update user
  - Delete user
- **Vehicle Management**
  - Create vehicle
  - Get vehicle by ID
  - Get all vehicles
  - Update vehicle
  - Delete vehicle
- **Booking Management**
  - Create booking
  - Get bookings (admin & customer)
  - Update booking status
- **Authentication & Security**
  - JWT-based authentication
  - Role-based access verification

---

## Technology Stack

- **Backend:** Node.js, Express.js, TypeScript  
- **Database:** PostgreSQL (using `pg` Pool)  
- **Authentication:** JSON Web Token (JWT)  
- **Environment Management:** dotenv  
- **Other Tools:** Node.js runtime, TypeScript compiler  

---



## Setup & Usage

1. **Clone the repository**
```bash
git clone <https://github.com/mehediakash01/Vehicle_Rental_Systeml>
cd vehicle-rental-system


## Setup & Usage

1. **Install dependencies**
```bash
npm install


2. Create .env file

PORT=5000
DATABASE_URL=<your_postgres_connection_string>
JWT_SECRET=<your_jwt_secret>

3. Initialize database & run server

npm run dev


4. API Testing

Use Postman or any API client to test endpoints under /api/v1/

Include JWT token in Authorization header for protected routes.