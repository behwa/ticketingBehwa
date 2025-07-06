# FROM node:alpine

# WORKDIR /app
# COPY package.json .
# RUN npm install
# COPY . .

# CMD ["npm","run","dev"]

# Step 1: Build the Next.js app
FROM node:alpine as builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve using next start
FROM node:alpine

WORKDIR /app
COPY --from=builder /app ./
RUN npm install --production

EXPOSE 3000
CMD ["npm", "start"]