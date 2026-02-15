# SOLID Principles Implementation

This document explains how SOLID principles are implemented in this project.

## Overview

SOLID is an acronym for five design principles intended to make software designs more understandable, flexible, and maintainable.

---

## 1. Single Responsibility Principle (SRP)

> "A class should have one, and only one, reason to change."

### Implementation:

#### ✅ **Controllers** - Handle HTTP requests/responses only
```javascript
// AuthController.js
class AuthController {
  // Only handles HTTP layer - delegates business logic to service
  register = async (req, res, next) => {
    const result = await this.authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  };
}
```

#### ✅ **Services** - Handle business logic only
```javascript
// AuthService.js
class AuthService {
  // Only handles authentication business logic
  async register(userData) {
    // Validate, hash password, create user, generate token
  }
}
```

#### ✅ **Repositories** - Handle data access only
```javascript
// UserRepository.js
class UserRepository extends BaseRepository {
  // Only handles database queries for users
  async findByUsername(username) {
    return this.findByField('username', username);
  }
}
```

#### ✅ **Middleware** - Each middleware has one responsibility
- `auth.js` - Verify JWT tokens
- `validate.js` - Validate request data
- `errorHandler.js` - Handle errors

---

## 2. Open/Closed Principle (OCP)

> "Software entities should be open for extension, but closed for modification."

### Implementation:

#### ✅ **BaseRepository** - Open for extension, closed for modification

```javascript
// BaseRepository.js - Closed for modification
class BaseRepository {
  async findAll() { /* implementation */ }
  async findById(id) { /* implementation */ }
  async create(data) { /* implementation */ }
  // ... other common methods
}

// UserRepository.js - Open for extension
class UserRepository extends BaseRepository {
  // Extends without modifying BaseRepository
  async findByUsername(username) {
    return this.findByField('username', username);
  }
  
  async usernameExists(username) {
    // User-specific functionality
  }
}

// ItemRepository.js - Open for extension
class ItemRepository extends BaseRepository {
  // Extends without modifying BaseRepository
  async findByUserId(userId) {
    // Item-specific functionality
  }
  
  async findByCategory(category) {
    // Item-specific functionality
  }
}
```

**Benefits:**
- Adding new repositories doesn't require changing BaseRepository
- New features added through inheritance, not modification
- Existing code remains stable and tested

---

## 3. Liskov Substitution Principle (LSP)

> "Derived classes must be substitutable for their base classes."

### Implementation:

#### ✅ **Repository Substitution**

```javascript
// Any repository can be used where BaseRepository is expected
function processRepository(repository) {
  // Works with UserRepository, ItemRepository, or any other repository
  const items = await repository.findAll();
  const item = await repository.findById(1);
  // ... operations work with any derived repository
}

// All these work interchangeably
processRepository(new UserRepository());
processRepository(new ItemRepository());
processRepository(new BaseRepository('AnyTable'));
```

#### ✅ **Method Override maintains behavior**

```javascript
// BaseRepository
class BaseRepository {
  async create(data) {
    // Returns created record
    return result.recordset[0];
  }
}

// UserRepository overrides but maintains contract
class UserRepository extends BaseRepository {
  async create(userData) {
    const user = await super.create(userData);
    delete user.password; // Additional behavior
    return user; // Still returns created record
  }
}
```

---

## 4. Interface Segregation Principle (ISP)

> "Clients should not be forced to depend upon interfaces they don't use."

### Implementation:

#### ✅ **Small, Focused Middleware**

Instead of one large middleware:
```javascript
// ❌ Bad - Fat interface
function megaMiddleware(req, res, next) {
  // Validates
  // Authenticates
  // Logs
  // Transforms data
  // ... many responsibilities
}
```

We use small, focused middleware:
```javascript
// ✅ Good - Interface segregation
app.use(validate(schema));      // Only validation
app.use(authMiddleware);        // Only authentication
app.use(loggingMiddleware);     // Only logging
```

#### ✅ **Focused Validation Schemas**

```javascript
// validators/schemas.js - Separate schemas for different use cases
const registerSchema = Joi.object({ /* register fields */ });
const loginSchema = Joi.object({ /* login fields */ });
const createItemSchema = Joi.object({ /* item creation fields */ });
const updateItemSchema = Joi.object({ /* item update fields */ });

// Routes use only what they need
router.post('/register', validate(registerSchema), ...);
router.post('/login', validate(loginSchema), ...);
router.post('/items', validate(createItemSchema), ...);
```

#### ✅ **Service Methods**

```javascript
// AuthService - Only auth-related methods
class AuthService {
  register() {}
  login() {}
  getUserProfile() {}
  // No item-related or unrelated methods
}

// ItemService - Only item-related methods
class ItemService {
  createItem() {}
  updateItem() {}
  deleteItem() {}
  // No auth-related or unrelated methods
}
```

---

## 5. Dependency Inversion Principle (DIP)

> "High-level modules should not depend on low-level modules. Both should depend on abstractions."

### Implementation:

#### ✅ **Controllers depend on Services (abstractions), not implementations**

```javascript
// AuthController depends on AuthService interface
class AuthController {
  constructor() {
    // Depends on abstraction (service layer)
    this.authService = new AuthService();
  }
  
  register = async (req, res) => {
    // Controller doesn't know about repositories or database
    const result = await this.authService.register(req.body);
    res.json(result);
  };
}
```

#### ✅ **Services depend on Repositories (abstractions), not database**

```javascript
// AuthService depends on UserRepository interface
class AuthService {
  constructor() {
    // Depends on abstraction (repository layer)
    this.userRepository = new UserRepository();
  }
  
  async register(userData) {
    // Service doesn't know about SQL Server or mssql library
    const user = await this.userRepository.create(userData);
    return user;
  }
}
```

#### ✅ **Repositories depend on Database abstraction**

```javascript
// UserRepository depends on database module
class UserRepository {
  async findByUsername(username) {
    // Doesn't create database connection directly
    // Uses abstracted database module
    const pool = await database.getPool();
    return pool.request().query(/* ... */);
  }
}
```

### Dependency Flow (High to Low):

```
Controller (High-level)
    ↓ depends on
Service (Mid-level)
    ↓ depends on
Repository (Mid-level)
    ↓ depends on
Database Module (Low-level)
    ↓ depends on
SQL Server (Low-level)
```

**Benefits:**
- Easy to test (can mock services/repositories)
- Easy to swap implementations (e.g., change database)
- Decoupled modules
- Clear separation of concerns

---

## Additional Design Patterns Used

### 1. **Repository Pattern**
- Abstracts data access layer
- Provides clean API for data operations
- Makes testing easier (can mock repositories)

### 2. **Service Layer Pattern**
- Encapsulates business logic
- Separates business rules from HTTP layer
- Promotes code reuse

### 3. **Singleton Pattern**
- Database connection pool (single instance)
- Logger instance (single instance)

### 4. **Middleware Pattern**
- Request/response processing pipeline
- Modular and composable

---

## Benefits of This Architecture

### ✅ **Testability**
Each layer can be tested independently:
```javascript
// Test controller with mocked service
const mockService = { register: jest.fn() };
const controller = new AuthController(mockService);

// Test service with mocked repository
const mockRepo = { create: jest.fn() };
const service = new AuthService(mockRepo);
```

### ✅ **Maintainability**
- Changes isolated to specific layers
- Easy to locate and fix bugs
- Clear code organization

### ✅ **Scalability**
- Easy to add new features
- Can extract services to microservices later
- Database can be changed with minimal impact

### ✅ **Reusability**
- BaseRepository reused by all entities
- Services can be reused across controllers
- Middleware reused across routes

---

## Code Quality Checklist

When adding new features, ensure:

- [ ] Each class has single responsibility
- [ ] New functionality added through extension, not modification
- [ ] Derived classes can substitute base classes
- [ ] Interfaces are small and focused
- [ ] Dependencies point toward abstractions
- [ ] No circular dependencies
- [ ] Proper error handling
- [ ] Comprehensive logging
- [ ] Input validation
- [ ] Documentation updated

---

## Conclusion

This project demonstrates enterprise-level Node.js architecture following SOLID principles. The result is:

- **Clean Code** - Easy to read and understand
- **Maintainable** - Changes don't break existing functionality
- **Testable** - Each component can be tested in isolation
- **Scalable** - New features added with minimal impact
- **Professional** - Industry best practices applied

This architecture serves as a solid foundation for building production-ready applications.
