# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code and TypeScript config
COPY src/ ./src/
COPY tsconfig.json ./

# Build TypeScript code
RUN pnpm build

# Verify the output directory structure
RUN ls -la dist/

# Copy scripts directory (if needed)
COPY scripts/ ./scripts/

# Set up environment
COPY .env* ./

# Expose the port
EXPOSE 3001

# Compile both src and scripts
RUN pnpm build:all

# Start with the correct path
CMD ["node", "dist/server.js"]
