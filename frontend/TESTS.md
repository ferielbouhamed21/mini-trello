# Frontend Tests

This directory contains comprehensive tests for the Mini Trello frontend application.

## Test Structure

```
frontend/
├── lib/__tests__/
│   └── api.test.ts           # API client tests (14 tests)
├── app/boards/__tests__/
│   └── page.test.tsx          # Board integration tests (8 tests)
├── jest.config.js             # Jest configuration
└── jest.setup.js              # Test setup file
```

## Test Coverage

### API Client Tests (`lib/__tests__/api.test.ts`)

Tests for all API operations including:

**Boards API (4 tests)**

- ✅ Fetch all boards
- ✅ Fetch single board by ID
- ✅ Create new board
- ✅ Delete board

**Lists API (4 tests)**

- ✅ Fetch lists by board ID
- ✅ Create new list
- ✅ Update list
- ✅ Delete list

**Cards API (5 tests)**

- ✅ Fetch cards by list ID
- ✅ Create new card
- ✅ Update card
- ✅ Move card to different list
- ✅ Delete card

**Error Handling (1 test)**

- ✅ Handle API errors correctly

### Board Integration Tests (`app/boards/__tests__/page.test.tsx`)

Integration tests for board operations:

**Board Operations (5 tests)**

- ✅ Fetch all boards successfully
- ✅ Create board with title and description
- ✅ Delete board by ID
- ✅ Handle empty boards list
- ✅ Create board without description

**Error Scenarios (3 tests)**

- ✅ Handle fetch boards error
- ✅ Handle create board error
- ✅ Handle delete board error

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Results

```
Test Suites: 2 passed, 2 total
Tests:       22 passed, 22 total
Snapshots:   0 total
Time:        ~1s
```

## Testing Technologies

- **Jest**: JavaScript testing framework
- **@testing-library/react**: React testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers
- **@testing-library/user-event**: User interaction simulation

## Test Patterns

### API Tests

- Mock `fetch` globally
- Test all CRUD operations
- Verify correct API endpoints are called
- Verify request payloads
- Test error handling

### Integration Tests

- Mock API module
- Test business logic
- Test error scenarios
- Verify data flow

## Notes

- All tests use mocked API calls (no actual HTTP requests)
- Tests are isolated and can run in any order
- Server component testing is simplified to focus on logic rather than rendering
- Coverage includes all critical user paths
