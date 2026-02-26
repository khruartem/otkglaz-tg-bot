# Dockerfile for TypeScript Telegram Bot

# Use Node.js LTS version as a base image
FROM node:16

# Create a working directory
WORKDIR /usr/src/app

# Install dependencies first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Build the TypeScript files
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the bot
CMD [ "node", "dist/index.js" ]