# Migration Guide: From Layer-Based to Feature-Based Architecture with Prisma

This document outlines the changes made to refactor the project from a layer-based architecture to a feature-based architecture using Prisma ORM.

## 🎯 What Changed

### 1. Database Layer
- **Before**: Raw PostgreSQL queries using `pg` library
- **After**: Prisma ORM with type-safe queries

### 2. Project Structure
- **Before**: Layer-based (controllers, services, repositories, routes)
- **After**: Feature-based (each feature is self-contained)

### 3. Architecture Improvements
- Applied SOLID principles more strictly
- Better separation of concerns
- Improved error handling with custom AppError class
- Centralized middleware in `common/` directory

## 📁 File Structure Changes

### Old Structure (Still exists but not used)
```
src/
├── config/
│   ├── database.js          # OLD: PostgreSQL pool
│   └── swagger.js          # MOVED to common/config/
├── controllers/            # OLD: Layer-based
├── services/               # OLD: Layer-based
├── repositories/           # OLD: Layer-based
├── routes/                 # OLD: Layer-based
├── middleware/             # OLD: Moved to common/
├── validators/             # OLD: Moved to features/
└── utils/                  # OLD: Moved to common/
```

### New Structure (Active)
```
src/
├── common/                 # NEW: Shared modules
│   ├── config/
│   ├── database/
│   │   └── prisma.client.js  # NEW: Prisma singleton
│   ├── errors/
│   │   ├── AppError.js        # NEW: Custom error class
│   │   └── ErrorHandler.js    # IMPROVED: Better error handling
│   ├── middleware/
│   │   ├── auth.middleware.js # IMPROVED: Uses AppError
│   │   └── validate.middleware.js # IMPROVED: Uses AppError
│   └── utils/
│       └── logger.js          # MOVED from src/utils/
├── features/               # NEW: Feature-based modules
│   ├── auth/
│   │   ├── auth.controller.js
│   │   ├── auth.service.js
│   │   ├── auth.repository.js # NEW: Uses Prisma
│   │   ├── auth.routes.js
│   │   └── auth.validator.js
│   └── items/
│       ├── items.controller.js
│       ├── items.service.js
│       ├── items.repository.js # NEW: Uses Prisma
│       ├── items.routes.js
│       └── items.validator.js
└── server.js               # UPDATED: Uses new structure
```

## 🔄 Migration Steps

### Step 1: Environment Setup
1. Copy `.env.example` to `.env` (if not exists)
2. Update `DATABASE_URL` in `.env`:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:15432/authdb?schema=public
   ```

### Step 2: Generate Prisma Client
```bash
npm run prisma:generate
```

### Step 3: Run Migrations
If you have existing data, you can:
- Option A: Use existing database (Prisma will sync)
- Option B: Create fresh migrations:
  ```bash
  npm run prisma:migrate
  ```

### Step 4: Start the Server
```bash
npm start
# or
npm run dev
```

## 🔧 Key Changes in Code

### Repository Pattern
**Before:**
```javascript
// Using raw SQL
const query = 'SELECT * FROM users WHERE username = $1';
const result = await database.query(query, [username]);
```

**After:**
```javascript
// Using Prisma
return await this.prisma.user.findUnique({
  where: { username }
});
```

### Error Handling
**Before:**
```javascript
if (error.message.includes('already exists')) {
  return res.status(400).json({ ... });
}
```

**After:**
```javascript
// In Service
throw new AppError('Username already exists', 400);

// In Controller
// Errors automatically handled by ErrorHandler middleware
```

### Dependency Injection
**Before:**
```javascript
class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }
}
```

**After:**
```javascript
// Same pattern, but repository uses Prisma
class AuthService {
  constructor() {
    this.authRepository = new AuthRepository(); // Uses Prisma
  }
}
```

## 📊 Database Schema

The Prisma schema (`prisma/schema.prisma`) matches your existing database structure:
- `User` model with all existing fields
- `Item` model with all existing fields
- Proper relationships and indexes

## 🚀 Benefits

1. **Type Safety**: Prisma provides type-safe database queries
2. **Better Organization**: Feature-based structure is easier to scale
3. **SOLID Principles**: Better adherence to SOLID principles
4. **Error Handling**: Centralized, consistent error handling
5. **Maintainability**: Clear separation of concerns
6. **Developer Experience**: Prisma Studio for database management

## 🗑️ Cleanup (Optional)

You can remove old files if you want:
- `src/config/database.js` (replaced by Prisma)
- `src/repositories/BaseRepository.js` (replaced by Prisma)
- `src/database/migrations/*.sql` (replaced by Prisma migrations)
- `src/middleware/` (moved to `common/middleware/`)
- `src/validators/` (moved to `features/*/`)

**Note**: These files are kept for reference. You can delete them once you're confident the new structure works.

## 📝 Next Steps

1. Test all endpoints to ensure everything works
2. Run Prisma Studio to explore your database: `npm run prisma:studio`
3. Consider adding more features using the same pattern
4. Add unit tests for services and repositories
5. Set up CI/CD with Prisma migrations

## ❓ Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running: `docker-compose up -d postgres`
- Check `DATABASE_URL` in `.env` matches your database
- Verify port 15432 is accessible

### Prisma Client Not Found
- Run `npm run prisma:generate` after installing dependencies
- Ensure `@prisma/client` is in `node_modules`

### Migration Issues
- If you have existing data, Prisma will detect schema differences
- Use `prisma migrate dev` to create migrations
- Use `prisma migrate deploy` for production

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Migrate Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Feature-Based Architecture](https://www.freecodecamp.org/news/organizing-large-react-applications/)

---

**Migration completed successfully! 🎉**
