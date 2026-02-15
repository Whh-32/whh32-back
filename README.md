# Node.js Authentication API with SQL Server & SOLID Principles

A professional, production-ready Node.js REST API backend with JWT authentication, SQL Server database, and SOLID architecture principles.

## 🌟 Features

- ✅ **JWT Authentication** - Secure user authentication with JSON Web Tokens
- ✅ **SQL Server Database** - Enterprise-grade database with proper indexing
- ✅ **SOLID Principles** - Clean, maintainable, and scalable architecture
- ✅ **Repository Pattern** - Abstracted data access layer
- ✅ **Service Layer** - Business logic separation
- ✅ **Validation** - Joi schema validation for all inputs
- ✅ **Swagger Documentation** - Interactive API documentation
- ✅ **Error Handling** - Centralized error handling with Winston logging
- ✅ **Security Best Practices** - Password hashing, SQL injection prevention
- ✅ **Pagination & Search** - Efficient data retrieval

## 🏗️ Architecture

This project follows **SOLID principles**:

### **S - Single Responsibility Principle**
- Each class/module has one reason to change
- Controllers handle HTTP, Services handle business logic, Repositories handle data access

### **O - Open/Closed Principle**
- BaseRepository is open for extension (UserRepository, ItemRepository extend it)
- Closed for modification - new features added via inheritance

### **L - Liskov Substitution Principle**
- All repositories can be used interchangeably where BaseRepository is expected
- Derived classes maintain base class behavior

### **I - Interface Segregation Principle**
- Small, focused interfaces (middleware, validators, services)
- No client forced to depend on methods it doesn't use

### **D - Dependency Inversion Principle**
- High-level modules (Controllers) depend on abstractions (Services)
- Services depend on abstractions (Repositories)
- Not on concrete implementations

## 📁 Project Structure

```
├── src/
│   ├── config/
│   │   ├── database.js          # Database connection (Singleton)
│   │   └── swagger.js            # Swagger configuration
│   ├── controllers/
│   │   ├── AuthController.js    # Authentication HTTP handlers
│   │   └── ItemController.js    # Item HTTP handlers
│   ├── database/
│   │   └── migrations/
│   │       ├── 001_create_users_table.sql
│   │       ├── 002_create_items_table.sql
│   │       └── runMigrations.js
│   ├── middleware/
│   │   ├── auth.js              # JWT verification middleware
│   │   ├── errorHandler.js      # Global error handler
│   │   └── validate.js          # Validation middleware
│   ├── repositories/
│   │   ├── BaseRepository.js    # Base CRUD operations
│   │   ├── UserRepository.js    # User-specific queries
│   │   └── ItemRepository.js    # Item-specific queries
│   ├── routes/
│   │   ├── auth.routes.js       # Auth route definitions
│   │   └── item.routes.js       # Item route definitions
│   ├── services/
│   │   ├── AuthService.js       # Authentication business logic
│   │   └── ItemService.js       # Item business logic
│   ├── utils/
│   │   └── logger.js            # Winston logger configuration
│   ├── validators/
│   │   └── schemas.js           # Joi validation schemas
│   └── server.js                # Application entry point
├── .env                         # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQL Server (MSSQL)** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Data validation
- **Winston** - Logging
- **Swagger** - API documentation

## 📋 Prerequisites

- Node.js (v14 or higher)
- SQL Server (2016 or higher) or Azure SQL Database
- npm or yarn

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Edit the `.env` file with your SQL Server credentials:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRES_IN=24h

# SQL Server Configuration
DB_SERVER=localhost
DB_PORT=1433
DB_DATABASE=AuthDB
DB_USER=sa
DB_PASSWORD=YourStrong@Passw0rd
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true
```

### 3. Create Database

Connect to your SQL Server and create the database:

```sql
CREATE DATABASE AuthDB;
GO
```

### 4. Run Database Migrations

```bash
npm run migrate
```

This will create the following tables:
- **Users** - User authentication and profile data
- **Items** - Sample resource for CRUD operations

### 5. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Swagger UI
Open your browser and navigate to: `http://localhost:3000/api-docs`

### Base URL
```
http://localhost:3000
```

## 🔐 Authentication Endpoints

### 1. Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Current User Profile

```http
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "created_at": "2024-02-01T10:00:00.000Z",
      "last_login": "2024-02-01T15:30:00.000Z"
    }
  }
}
```

## 📦 Item Endpoints (Protected)

All item endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### 1. Get All Items

```http
GET /api/items

# With pagination
GET /api/items?page=1&limit=10

# With search
GET /api/items?search=laptop
```

### 2. Get My Items

```http
GET /api/items/my
```

### 3. Get Item by ID

```http
GET /api/items/1
```

### 4. Create Item

```http
POST /api/items
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "name": "Laptop",
  "description": "High performance laptop",
  "price": 999.99,
  "category": "Electronics"
}
```

### 5. Update Item

```http
PUT /api/items/1
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "name": "Updated Laptop",
  "price": 899.99
}
```

### 6. Delete Item

```http
DELETE /api/items/1
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🧪 Testing with cURL

### Register and Login

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### Use Token for Protected Routes

```bash
# Get all items
curl -X GET http://localhost:3000/api/items \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create item
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Item",
    "description": "Test description",
    "price": 99.99
  }'
```

## 🏛️ Database Schema

### Users Table

| Column      | Type          | Constraints                    |
|-------------|---------------|--------------------------------|
| id          | INT           | PRIMARY KEY, IDENTITY          |
| username    | NVARCHAR(50)  | UNIQUE, NOT NULL               |
| email       | NVARCHAR(100) | UNIQUE, NOT NULL               |
| password    | NVARCHAR(255) | NOT NULL                       |
| first_name  | NVARCHAR(50)  | NULL                           |
| last_name   | NVARCHAR(50)  | NULL                           |
| created_at  | DATETIME2     | DEFAULT GETDATE()              |
| updated_at  | DATETIME2     | DEFAULT GETDATE()              |
| last_login  | DATETIME2     | NULL                           |

### Items Table

| Column      | Type           | Constraints                    |
|-------------|----------------|--------------------------------|
| id          | INT            | PRIMARY KEY, IDENTITY          |
| name        | NVARCHAR(100)  | NOT NULL                       |
| description | NVARCHAR(500)  | NULL                           |
| price       | DECIMAL(10,2)  | NOT NULL, CHECK (price >= 0)   |
| category    | NVARCHAR(50)   | NULL                           |
| user_id     | INT            | FOREIGN KEY → Users(id)        |
| created_at  | DATETIME2      | DEFAULT GETDATE()              |
| updated_at  | DATETIME2      | DEFAULT GETDATE()              |

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure authentication
- **SQL Injection Prevention** - Parameterized queries
- **Input Validation** - Joi schema validation
- **Error Handling** - Secure error messages (no sensitive data exposure)
- **CORS** - Configurable cross-origin requests
- **Rate Limiting** - (Recommended to add in production)

## 📊 Logging

Winston logger configuration:
- **Development**: Console + File logging
- **Production**: File logging only
- **Error logs**: `logs/error.log`
- **All logs**: `logs/combined.log`

## 🚀 Production Deployment

### Before deploying to production:

1. **Update Environment Variables**
   - Change `JWT_SECRET` to a strong, random string (min 32 characters)
   - Set `NODE_ENV=production`
   - Update database credentials
   - Configure `DB_ENCRYPT=true` for Azure SQL

2. **Security Enhancements**
   - Add rate limiting (e.g., express-rate-limit)
   - Enable HTTPS
   - Set up proper CORS origins
   - Add helmet.js for security headers
   - Implement refresh tokens

3. **Performance**
   - Enable database connection pooling (already configured)
   - Add Redis for caching
   - Implement request compression

4. **Monitoring**
   - Set up application monitoring (e.g., PM2)
   - Configure log aggregation
   - Add health check endpoints (already included)

## 📝 Best Practices Implemented

✅ **Separation of Concerns** - Controllers, Services, Repositories
✅ **DRY Principle** - BaseRepository for common operations
✅ **Error Handling** - Centralized error middleware
✅ **Validation** - Input validation at route level
✅ **Logging** - Structured logging with Winston
✅ **Security** - Password hashing, parameterized queries
✅ **Documentation** - Comprehensive Swagger docs
✅ **Database Indexing** - Optimized queries
✅ **Code Organization** - Clear folder structure

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT

## 👨‍💻 Author

Your Name

## 🙏 Acknowledgments

- Express.js team
- Microsoft SQL Server team
- Node.js community
# whh32-back
