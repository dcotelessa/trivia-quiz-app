# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy source code and configs
COPY tsconfig*.json ./
COPY .env* ./
COPY src/ ./src/
COPY scripts/ ./scripts/

# Copy and make the entrypoint script executable
COPY docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

# Build TypeScript code
RUN pnpm build:all

# Expose the port
EXPOSE 3001

# Use our custom entrypoint
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/server.js"]
