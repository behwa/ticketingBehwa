# FROM node:alpine

# WORKDIR /app
# COPY package.json .
# RUN npm install
# COPY . .

# CMD ["npm", "run", "start"]

# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy remaining source code
COPY . .

# Build the Next.js app
RUN npm run build

EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "run", "start"]