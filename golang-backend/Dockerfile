# Stage 1: Build the Go application
FROM golang:1.23.4-alpine3.21 AS builder

# Set environment variables
ENV GO111MODULE=on \
    CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# Set the working directory
WORKDIR /app

# Copy go.mod and go.sum
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the application files
COPY . .

# Build the Go application
RUN go build -o ashleshajewells-backend

# Stage 2: Run the application
FROM alpine:latest

# Set the working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/ashleshajewells-backend .

# Copy configuration files
COPY --from=builder /app/config ./config

# Ensure the uploads folder exists and has the correct permissions
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

# Ensure the invoices folder exists and has the correct permissions
RUN mkdir -p /app/invoices && chmod 777 /app/invoices

# Expose the application port
EXPOSE 4000

# Command to run the application
CMD ["./ashleshajewells-backend"]