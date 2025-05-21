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

### Frontend (Web)

- React with TypeScript
- Redux with Redux Toolkit
- Component-based architecture

## Getting Started

### Prerequisites
- Docker and Docker Compose (for containerized deployment)
- Node.js v18+ and pnpm (for local development)

### Running with Docker

1. Clone the repository:
   ```
   git clone https://github.com/dcotelessa/trivia-quiz-app.git
   cd trivia-quiz-app
   ```

2. Start the application with Docker Compose:
   ```
   docker-compose up
   ```

   This will:
   - Start MongoDB container
   - Build and start the backend container
   - Run the database seeding process automatically on first startup (this takes time due to rate limiting)


3. Access the application:
- Backend API: http://localhost:3001
- Test the API: http://localhost:3001/api/categories

4. To stop the application:
```
docker-compose down
```

If we want to remove all seeded data:
```
docker-compose down -v
```

### Testing

This project prioritizes unit tests for local development to keep the testing process fast.

#### Unit Tests

Run the unit tests locally (fast, no database dependency):
```bash
pnpm test
```

#### Test with Coverage

Get code coverage for all unit tests:

```bash
pnpm test:coverage
```
### API Endpoints

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a category by ID

#### Quiz
- `GET /api/quiz?category=9&difficulty=easy&amount=5` - Get quiz questions
- `POST /api/quiz/score` - Score a quiz submission

## Credits
- Question data sourced from the Open Trivia Database (https://opentdb.com)
- Author: David Cotelessa
