# Dockerfile
# Use official Node.js LTS image
FROM node:20-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package.json and lockfile
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies with pnpm
RUN pnpm install --frozen-lockfile

# Copy all files
COPY . .

# Build Next.js app
RUN pnpm build

# Production image
FROM node:20-alpine AS runner

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

ENV NODE_ENV=production

# Copy only necessary files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/node_modules ./node_modules

# Expose port 3000
EXPOSE 3000

# Start the Next.js app
CMD ["pnpm", "start"]
