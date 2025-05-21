const schema = `
  # Types
  type Category {
    id: Int!
    name: String!
  }

  enum QuestionDifficulty {
    easy
    medium
    hard
  }

  enum QuestionType {
    multiple
    boolean
  }

  type Question {
    id: ID!
    category: Int!
    difficulty: QuestionDifficulty!
    question: String!
    answers: [String!]!
  }

  type QuestionResult {
    questionId: ID!
    question: String!
    correct: Boolean!
    selectedAnswer: String!
    correctAnswer: String!
    allAnswers: [String!]!
  }

  type QuizResult {
    score: Int!
    totalQuestions: Int!
    percentage: Int!
    results: [QuestionResult!]!
  }

  # Inputs
  input QuizOptionsInput {
    category: Int
    difficulty: QuestionDifficulty
    amount: Int = 5
  }

  input QuizAnswerInput {
    questionId: ID!
    answer: String!
  }

  # Queries
  type Query {
    categories: [Category!]!
    category(id: Int!): Category
    quiz(options: QuizOptionsInput): [Question!]!
  }

  # Mutations
  type Mutation {
    submitQuiz(answers: [QuizAnswerInput!]!): QuizResult!
  }
`;

export default schema;
