FROM node:20-alpine AS build

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Create the necessary public directory structure
RUN mkdir -p public

# Create index.html
RUN echo '<!DOCTYPE html>\
<html lang="en">\
  <head>\
    <meta charset="utf-8" />\
    <meta name="viewport" content="width=device-width, initial-scale=1" />\
    <meta name="theme-color" content="#000000" />\
    <meta name="description" content="Trivia Quiz Application" />\
    <title>Trivia Quiz</title>\
  </head>\
  <body>\
    <noscript>You need to enable JavaScript to run this app.</noscript>\
    <div id="root"></div>\
  </body>\
</html>' > public/index.html

# Create manifest.json
RUN echo '{\
  "short_name": "Trivia Quiz",\
  "name": "Trivia Quiz Application",\
  "icons": [],\
  "start_url": ".",\
  "display": "standalone",\
  "theme_color": "#000000",\
  "background_color": "#ffffff"\
}' > public/manifest.json

# Create robots.txt
RUN echo 'User-agent: *\nDisallow:' > public/robots.txt

# Copy package files
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Build for production
RUN pnpm build

# Production environment
FROM nginx:1.23-alpine

# Copy built assets from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
