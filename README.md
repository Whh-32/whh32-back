# Node.js Authentication API with PostgreSQL & Prisma

Complete production-ready Node.js REST API with JWT authentication, PostgreSQL database, Prisma ORM, feature-based architecture, and SOLID principles.

## 🚀 Quick Start

### 1. Start PostgreSQL
```bash
docker-compose up -d postgres
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Generate Prisma Client
```bash
npm run prisma:generate
```

### 5. Run migrations
```bash
npm run prisma:migrate
```

### 6. Start the server
```bash
npm start
# or for development
npm run dev
```

### 7. Access the API
- API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api-docs
- Health Check: http://localhost:3000/health
- Prisma Studio: `npm run prisma:studio`

## 📁 Project Structure (Feature-Based Architecture)

```
├── src/
│   ├── common/                      # Shared modules
│   │   ├── config/
│   │   │   └── swagger.js          # API documentation config
│   │   ├── database/
│   │   │   └── prisma.client.js    # Prisma Client singleton
│   │   ├── errors/
│   │   │   ├── AppError.js         # Custom error class
│   │   │   └── ErrorHandler.js     # Global error handler
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js  # JWT verification
│   │   │   └── validate.middleware.js # Request validation
│   │   └── utils/
│   │       └── logger.js           # Winston logger
│   ├── features/                    # Feature-based modules
│   │   ├── auth/
│   │   │   ├── auth.controller.js  # Auth HTTP handlers
│   │   │   ├── auth.service.js     # Auth business logic
│   │   │   ├── auth.repository.js  # Auth data access (Prisma)
│   │   │   ├── auth.routes.js      # Auth endpoints
│   │   │   └── auth.validator.js   # Auth validation schemas
│   │   └── items/
│   │       ├── items.controller.js  # Items HTTP handlers
│   │       ├── items.service.js    # Items business logic
│   │       ├── items.repository.js # Items data access (Prisma)
│   │       ├── items.routes.js    # Items endpoints
│   │       └── items.validator.js  # Items validation schemas
│   └── server.js                    # App entry point
├── prisma/
│   ├── schema.prisma               # Prisma schema definition
│   ├── migrations/                 # Database migrations
│   └── seed.js                     # Database seed (optional)
├── prisma.config.ts                # Prisma configuration
├── .env                            # Environment variables
├── .gitignore
├── docker-compose.yml              # Docker configuration
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
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
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
GET /api/items?search=laptop     # Search
```

**Get My Items**
```bash
GET /api/items/my
```

**Get Item by ID**
```bash
GET /api/items/:id
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

# PostgreSQL (Prisma)
DATABASE_URL=postgresql://postgres:postgres@localhost:15432/authdb?schema=public
```

## 🐳 Docker Commands

```bash
# Start PostgreSQL only
docker-compose up -d postgres

# View logs
docker logs postgres
docker logs -f postgres  # Follow

# Stop services
docker-compose stop

# Remove everything (including data)
docker-compose down -v
```

## 🏗️ Architecture & SOLID Principles

### Feature-Based Architecture
- **Features**: Each feature (auth, items) is self-contained with its own controller, service, repository, routes, and validators
- **Common**: Shared utilities, middleware, errors, and configurations
- **Separation of Concerns**: Clear boundaries between layers

### SOLID Principles Applied

- **S**ingle Responsibility
  - Each class has one clear responsibility
  - Controllers handle HTTP, Services handle business logic, Repositories handle data access

- **O**pen/Closed
  - Extend functionality through inheritance and composition
  - Error handling is extensible via AppError class

- **L**iskov Substitution
  - Repository pattern allows swapping implementations
  - Services depend on repository abstractions

- **I**nterface Segregation
  - Small, focused interfaces
  - Each feature has its own validator, repository, service

- **D**ependency Inversion
  - High-level modules (services) depend on abstractions (repositories)
  - Prisma Client is injected via singleton pattern

## 📊 Database Schema (Prisma)

**User Model:**
```prisma
model User {
  id        Int       @id @default(autoincrement())
  username  String    @unique
  email     String    @unique
  password  String
  firstName String?
  lastName  String?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  lastLogin DateTime?
  items     Item[]
}
```

**Item Model:**
```prisma
model Item {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Decimal
  category    String?
  userId      Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id])
}
```

## 🛠️ Tech Stack

- **Runtime**: Node.js + Express
- **Database**: PostgreSQL
- **ORM**: Prisma 7
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs (password hashing)
- **Validation**: Joi
- **Logging**: Winston
- **Documentation**: Swagger/OpenAPI
- **Containerization**: Docker

## 📝 Scripts

```bash
npm start              # Start production server
npm run dev            # Start development server (nodemon)
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate      # Create and apply migrations
npm run prisma:migrate:deploy # Deploy migrations (production)
npm run prisma:studio       # Open Prisma Studio (database GUI)
npm run prisma:seed        # Seed database (if seed.js exists)
```

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT authentication with configurable expiration
- Input validation with Joi
- Parameterized queries via Prisma (SQL injection prevention)
- CORS enabled
- Environment variables for secrets
- Error handling without exposing sensitive information

## 🚀 Migration from Old Structure

The project has been refactored from a layer-based to a feature-based architecture:

**Before (Layer-based):**
```
src/
├── controllers/
├── services/
├── repositories/
└── routes/
```

**After (Feature-based):**
```
src/
├── features/
│   ├── auth/        # All auth-related code
│   └── items/       # All items-related code
└── common/          # Shared code
```

**Benefits:**
- Better code organization
- Easier to scale and add new features
- Clear feature boundaries
- Improved maintainability

## 📄 License

MIT

---

**Made with ❤️ using Prisma, Feature-Based Architecture, and SOLID Principles**
