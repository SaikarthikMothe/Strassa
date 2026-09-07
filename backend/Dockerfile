# Use Node 20 LTS Alpine for a lightweight, secure container
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package manifests first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the backend source code
COPY . .

# Default port
ENV PORT=3000
EXPOSE 3000

# Healthcheck for AWS App Runner / ECS / Docker
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]
