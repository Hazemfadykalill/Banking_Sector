# Build Stage
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install dependencies deterministically
RUN npm ci

# Copy full application source code
COPY . .

# Execute Angular production build
RUN npm run build

# Production Runtime Stage
FROM nginx:1.27-alpine AS runtime

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production build artifacts from build stage to Nginx web root
COPY --from=build /app/dist/banking-portal/browser /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx web server in foreground
CMD ["nginx", "-g", "daemon off;"]
