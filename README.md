# XBorg Tech Challenge

## Submission Requirements

- Unit Tests
- Integration Tests
- E2E Testing
- Testing Performance benchmarks
- Clearly document strategies via effective testing and in the Submission Documentation section of the ReadMe

Implementation should be submitted via a public GitHub repository, or a private repository with collaborator access granted to the provided emails.

## Architecture

- Language - Typescript
- Monorepo - Turborepo
- Client - NextJs
- Api - NestJs
- DB - SQLite

## Apps and Packages

- `client`: [Next.js](https://nextjs.org/) app
- `api`: [Nestjs](https://nestjs.com) app
- `tsconfig`: Typescript configuration used throughout the monorepo

## Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Husky](https://typicode.github.io/husky/) for Git hooks

## Steps to run app

#### Install Metamask [link](https://chromewebstore.google.com/detail/nkbihfbeogaeaoehlefnkodbefgpgknn?utm_source=item-share-cb)

#### Run commands in order

```bash
# Enter all commands from the project root

# Start the infrastructure (Requires Docker)
$ yarn start:local:infra

# Install dependencies
$ yarn install

 # Build the app including the lib
$ yarn build

# Migrate the DB
$ cd apps/api && yarn migrate:local

 # Run the application stack in dev
 $ yarn dev
```

## Additional Commands

```bash
# Run tests in all apps
$ yarn test

# Run linter in all apps
$ yarn lint

# Format code in all apps
$ yarn format

```

## Submission Documentation...

### Unit Tests Added (API)

#### 1. PrismaService Unit Tests

- **Location:** `apps/api/src/prisma/__tests__/prisma.service.spec.ts`
- **What it tests:**
  - The PrismaService initializes with the correct database URL from configuration.
  - The `onModuleInit` method calls the database connection logic.
  - The `enableShutdownHooks` method registers a shutdown hook and closes the app properly.
- **Why:** Ensures the database service is robust, initializes correctly, and cleans up resources as expected.

#### 2. envConfig Utility Unit Tests

- **Location:** `apps/api/src/config/env/tests/env-config.spec.ts`
- **What it tests:**
  - Returns the correct configuration object when `NODE_ENV` is set to `local`.
  - Returns the correct configuration object when `NODE_ENV` is set to `production`.
  - Defaults to production configuration if `NODE_ENV` is not set.
- **Why:** Ensures the application loads the correct environment settings, which is critical for both development and production reliability.

### How to Run Only These Tests (For Dummies)

1. **Open your terminal.**
2. **Navigate to the API app directory:**
   ```bash
   cd apps/api
   ```
3. **Run the specific test files:**
   ```bash
   yarn test src/prisma/__tests__/prisma.service.spec.ts src/config/env/tests/env-config.spec.ts
   ```
   - This command will ONLY run the tests we created together for `PrismaService` and `envConfig`.
   - You should see output indicating that these tests have passed (or failed, if there is an issue).

**Tip:** You can always run all tests in the API by simply running `yarn test` from the `apps/api` directory.

---

If you have any issues or see errors, double-check the file paths and make sure you are in the correct directory (`apps/api`).

### Integration Test Added (Gateway <-> API)

#### User Integration Test
- **Location:** `apps/gateway/test/user.integration-spec.ts`
- **What it tests:**
  - The full flow of user signup, login, and profile fetch through the Gateway, ensuring correct integration with the API and database.
  - **Note:** SIWE (Sign-In With Ethereum) verification is mocked in the test environment, so all SIWE message/signature checks always succeed. This allows the integration flow to be tested without requiring real Ethereum signatures or wallets.
  - **Unique Data:** Each test run generates a unique `userName` and `address` to avoid database conflicts and ensure repeatable, isolated tests.
- **Why:** Confirms that the Gateway and API work together as expected for real user scenarios, not just in isolation.

### How to Run This Integration Test (For Dummies)

1. **Open your terminal.**
2. **Navigate to the Gateway app directory:**
   ```bash
   cd apps/gateway
   ```
3. **Run the integration test file:**
   ```bash
   yarn test test/user.integration-spec.ts
   ```
   - This command will ONLY run the integration test for user flows between the Gateway and API.
   - You should see output indicating that these tests have passed (or failed, if there is an issue).

**Tip:** You can always run all tests in the Gateway by simply running `yarn test` from the `apps/gateway` directory.

---
If you have any issues or see errors, double-check the file path and make sure you are in the correct directory (`apps/gateway`).
