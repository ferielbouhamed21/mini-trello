FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Expose the application port
EXPOSE 3001

# Set environment variable
ENV PORT=3001

# Start the application
CMD ["yarn", "start"]
