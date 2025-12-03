# syntax=docker/dockerfile:1

FROM node:lts-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the rest of the project
COPY . .

# Expose backend port
EXPOSE 3000

# Start server
CMD ["node", "index.js"]
