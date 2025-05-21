# Trivia Quiz App

This is a fullstack Trivia Quiz app
## Features

- Select a trivia category and difficulty
- Answer random multiple-choice questions
- View results and score
- Secure API endpoints

## Application Architecture

This application follows a **Clean Architecture with Service Layer** design, which provides a good balance of separation of concerns without unnecessary complexity:

### Backend Architecture:
│    Routes   │────▶│   Services  │────▶│ Repositories │────▶│   Database  │

- **Routes Layer**: API endpoints that handle HTTP requests and responses
- **Services Layer**: Business logic that orchestrates the application functionality
- **Repositories Layer**: Data access abstraction that handles database operations
- **Models**: Shared data structures and types used across layers

### Frontend Architecture:
│    Pages    │────▶│  Components │────▶│ Redux Store │────▶│     API     │

- **Pages**: Top-level components that represent route destinations
- **Components**: Reusable UI components
- **Redux Store**: State management using Redux Toolkit
- **API Services**: Handles communication with the backend

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
- React Testing Library for unit tests

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

   If you update code, you may want to rebuild Docker images:
   ```
   docker-compose up --build
   ```

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

### GraphQL Endpoint

The application also provides a GraphQL API at `/graphql` with the following operations:

**Queries:**
- `categories` - Get all categories
- `category(id: Int!)` - Get a category by ID
- `quiz(options: QuizOptionsInput)` - Get quiz questions

**Mutations:**
- `submitQuiz(answers: [QuizAnswerInput!]!)` - Submit and score a quiz

A GraphQL interface is available at `/graphql` when running in development mode.

Example GraphQL query:
```graphql
query {
  categories {
    id
    name
  }
  
  quiz(options: { category: 9, difficulty: MEDIUM, amount: 5 }) {
    id
    question
    answers
  }
}
```
This GraphQL implementation provides an alternative way to interact with our Trivia Quiz API, offering the flexibility and efficiency benefits of GraphQL while maintaining the existing REST API for backward compatibility.

The implementation follows best practices:
1. Strong type definitions using GraphQL schema language
2. Integration with existing services for reuse of business logic
3. Apollo Client setup for the frontend with custom hooks
4. Clear documentation in the README


## Credits
- Question data sourced from the Open Trivia Database (https://opentdb.com)
- Author: David Cotelessa
