FROM node:20-slim as build

WORKDIR /app

# Install OpenSSL (needed for Prisma)
RUN apt-get update -y && apt-get install -y openssl

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production stage with minimal dependencies
FROM node:20-slim

WORKDIR /app

# Install OpenSSL (needed for Prisma)
RUN apt-get update -y && apt-get install -y openssl

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy prisma schema (needed for migrations)
COPY prisma ./prisma/

# Copy build artifacts from build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Expose the port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main.js"]