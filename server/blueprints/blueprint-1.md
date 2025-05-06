# Blueprint 1: Document CRUD (Layered Architecture, TDD)

## 1. File Structure (Layered)

```
src/
  domains/
    document.entity.ts
    __tests__/
      document.entity.spec.ts
  dtos/
    document.dto.ts
    __tests__/
      document.dto.spec.ts
  repositories/
    document.repository.ts
    __tests__/
      document.repository.spec.ts
  services/
    document.service.ts
    __tests__/
      document.service.spec.ts
  controllers/
    document.controller.ts
    __tests__/
      document.controller.spec.ts
```

## 2. Layers & Responsibilities

- **Domain**: Document interface/entity.
- **DTO**: Zod-validated DTOs for create/update/response.
- **Repository**: Prisma-based data access.
- **Service**: Business logic, validation, orchestration.
- **Controller**: HTTP endpoints, request/response mapping.
- **Tests**: TDD for each layer.

## 3. CRUD Operations

- Create Document
- Get Document by ID
- List Documents
- Update Document
- Delete Document

## 4. TDD Steps

1. Write failing tests for each operation/layer.
2. Implement code to pass tests.
3. Refactor, keeping tests green.

## 5. Validation Dtos
1. Use Zod for validation.
2. Define a decorator for Zod validation.
3. Apply the decorator to controller methods.

## 6. Global Error Handling
1. Create a global error handler middleware.
2. Handle common errors (validation, not found, etc.).
3. Log errors for debugging (use winston).
4. Return appropriate HTTP status codes and messages.
5. Use a consistent error response format.
