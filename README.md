# Node.js Authentication API with PostgreSQL

Complete production-ready Node.js REST API with JWT authentication, PostgreSQL database, and SOLID principles.

## 🚀 Quick Start

### 1. Start PostgreSQL
```bash
docker-compose up -d postgres
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run migrations
```bash
npm run migrate
```

### 4. Start the server
```bash
npm start
# or for development
npm run dev
```

### 5. Access the API
- API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api-docs
- Health Check: http://localhost:3000/health

## 📁 Project Structure

```
├── src/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection pool
│   │   └── swagger.js            # API documentation config
│   ├── controllers/
│   │   ├── AuthController.js    # Auth HTTP handlers
│   │   └── ItemController.js    # Item HTTP handlers
│   ├── database/
│   │   └── migrations/
│   │       ├── 001_create_users_table.sql
│   │       ├── 002_create_items_table.sql
│   │       └── runMigrations.js
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── errorHandler.js      # Error handling
│   │   └── validate.js          # Request validation
│   ├── repositories/
│   │   ├── BaseRepository.js    # Base CRUD operations
│   │   ├── UserRepository.js    # User data access
│   │   └── ItemRepository.js    # Item data access
│   ├── routes/
│   │   ├── auth.routes.js       # Auth endpoints
│   │   └── item.routes.js       # Item endpoints
│   ├── services/
│   │   ├── AuthService.js       # Auth business logic
│   │   └── ItemService.js       # Item business logic
│   ├── utils/
│   │   └── logger.js            # Winston logger
│   ├── validators/
│   │   └── schemas.js           # Joi validation schemas
│   └── server.js                # App entry point
├── .env                         # Environment variables
├── .gitignore
├── docker-compose.yml           # Docker configuration
├── Dockerfile
├── package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication

**Register User**
```bash
POST /api/auth/register
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login**
```bash
POST /api/auth/login
{
  "username": "johndoe",
  "password": "password123"
}
```

**Get Profile** (Protected)
```bash
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

### Items (All Protected)

**Get All Items**
```bash
GET /api/items
GET /api/items?page=1&limit=10  # With pagination
GET /api/items?search=laptop    # Search
```

**Create Item**
```bash
POST /api/items
{
  "name": "Laptop",
  "description": "High performance laptop",
  "price": 999.99,
  "category": "Electronics"
}
```

**Update Item**
```bash
PUT /api/items/:id
{
  "price": 899.99
}
```

**Delete Item**
```bash
DELETE /api/items/:id
```

## ⚙️ Configuration

Edit `.env` file:

```env
# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key_min_32_characters
JWT_EXPIRES_IN=24h

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=authdb
DB_USER=postgres
DB_PASSWORD=postgres
```

## 🐳 Docker Commands

```bash
# Start PostgreSQL only
docker-compose up -d postgres

# Start both PostgreSQL and API
docker-compose up -d

# View logs
docker logs postgres
docker logs -f postgres  # Follow

# Stop services
docker-compose stop

# Remove everything (including data)
docker-compose down -v
```

## 🏗️ SOLID Principles

- **S**ingle Responsibility - Each class has one job
- **O**pen/Closed - Extend via inheritance, not modification
- **L**iskov Substitution - Repositories are interchangeable
- **I**nterface Segregation - Small, focused interfaces
- **D**ependency Inversion - Depend on abstractions

## 📊 Database Schema

**Users Table:**
- id (SERIAL PRIMARY KEY)
- username (VARCHAR UNIQUE)
- email (VARCHAR UNIQUE)
- password (VARCHAR)
- first_name, last_name (VARCHAR)
- created_at, updated_at, last_login (TIMESTAMP)

**Items Table:**
- id (SERIAL PRIMARY KEY)
- name (VARCHAR)
- description (VARCHAR)
- price (DECIMAL)
- category (VARCHAR)
- user_id (INTEGER FK → users)
- created_at, updated_at (TIMESTAMP)

## 🛠️ Tech Stack

- Node.js + Express
- PostgreSQL
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- Joi (validation)
- Winston (logging)
- Swagger (API docs)
- Docker

## 📝 Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server (nodemon)
npm run migrate # Run database migrations
```

## 🔒 Security

- Password hashing with bcrypt
- JWT authentication
- Parameterized queries (SQL injection prevention)
- Input validation
- CORS enabled
- Environment variables for secrets

## 📄 License

MIT

---

**Made with ❤️ using SOLID principles and best practices**
