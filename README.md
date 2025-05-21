# Trivia Quiz App

This is a fullstack Trivia Quiz app
## Features

- Select a trivia category and difficulty
- Answer random multiple-choice questions
- View results and score
- Secure API endpoints

## Application Architecture

This application follows a **Clean Architecture with Service Layer** design, which provides a good balance of separation of concerns without unnecessary complexity:

```
│    Routes   │────▶│   Services  │────▶│ Repositories │────▶│   Database  │

```

### Architecture Layers:

1. **Routes Layer**: API endpoints that handle HTTP requests and responses
2. **Services Layer**: Business logic that orchestrates the application functionality
3. **Repositories Layer**: Data access abstraction that handles database operations
4. **Models**: Shared data structures and types used across layers

This architecture provides several benefits:
- Clear separation of concerns
- Straightforward data flow that's easy to follow and debug
- Good testability with clear boundaries
- Appropriate level of abstraction for the application's complexity

## Tech Stack

### Backend
- Node.js with Fastify
- MongoDB - data storage
- TypeScript - type safety
- Docker

### Frontend (coming soon)
- React with TypeScript
- Redux with Redux Toolkit
- CSS

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (if running locally)
- pnpm (preferred package manager)

### Package Management

This project uses pnpm as the package manager. If you don't have pnpm installed, you can install it with:

```bash
npm install -g pnpm
```

### Running with Docker

1. Clone the repository:
   ```
   git clone <repository-url>
   cd trivia-quiz-app
   ```

2. Start the application with Docker Compose:
   ```
   docker-compose up
   ```

3. Seed the database:
   ```
   docker exec -it trivia-backend pnpm run seed
   ```

4. The backend API will be available at http://localhost:3001

### Local Development Setup

If you prefer to run the application locally:

1. Install dependencies:
   ```
   cd backend
   pnpm install
   ```

2. Set up environment variables:
   ```
   # Create a .env.local file for your local development
   cp .env.example .env.local
   
   # Edit the file to match your local environment
   # This file won't be committed to git
   ```

3. Start MongoDB (via Docker or locally)

4. Run the development server:
   ```
   pnpm run dev
   ```

5. Seed the database:
   ```
   pnpm run seed
   ```

### Testing

This project prioritizes unit tests for local development to keep the testing process fast.

#### Unit Tests (Default)

Run the unit tests (excludes integration tests that require a database):

```bash
pnpm test
```

#### Test with Coverage

Get code coverage for all unit tests:

```bash
pnpm test:coverage
```

#### Integration Tests

Set up a test database and run integration tests:

```bash
# Start a MongoDB container for testing
pnpm test:setup

# Run the integration tests
pnpm test:integration

# Clean up when finished
pnpm test:teardown
```

#### Testing Configuration

You can configure the test database connection by adding to your `.env.local`:

```
TEST_MONGODB_URI=mongodb://localhost:27017/trivia-test
```

#### All Tests

Run all tests (both unit and integration):

```bash
pnpm test:all
```

For more details on testing, see [TESTING.md](./TESTING.md).

### API Endpoints

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a category by ID

#### Quiz
- `GET /api/quiz?category=9&difficulty=easy&amount=5` - Get quiz questions
- `POST /api/quiz/score` - Score a quiz submission

## Project Structure

```
src/
├── config/         # Application configuration
├── models/         # Data structures and types
├── repositories/   # Data access layer
├── services/       # Business logic layer
├── routes/         # API endpoints
├── utils/          # Helper utilities
├── app.ts          # Application setup
└── server.ts       # Server entry point
```

## License
This project is for demonstration purposes only.

## Credits
- Question data sourced from the Open Trivia Database (https://opentdb.com)
- Author: David Cotelessa
