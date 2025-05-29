# Use the official Bun image for building and running
FROM oven/bun:1 AS build

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy the application files
COPY . .

# Build the Remix app
RUN bun run build

# Use the same image for production
FROM oven/bun:1

# Set the working directory
WORKDIR /app

# Copy files from the build stage
COPY --from=build /app /app

# Expose the port the app runs on
EXPOSE 3000

# Start the Remix app
CMD ["bun", "run", "start"]
