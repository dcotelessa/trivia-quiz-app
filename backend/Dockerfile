FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the application code
COPY . .

# Make sure the build command works - debug by listing files
RUN ls -la
RUN cat package.json

# Build the application
RUN pnpm build

# Check if the build was successful
RUN ls -la dist/

# Expose the port
EXPOSE 3001

# Start the application
CMD ["node", "dist/server.js"]
