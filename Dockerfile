# Stage 1: Build the React application
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the app for production (Vite outputs to /dist)
RUN npm run build

# Stage 2: Serve the static files using Nginx
FROM nginx:alpine

# Copy the built assets to the default Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 to the host network
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
