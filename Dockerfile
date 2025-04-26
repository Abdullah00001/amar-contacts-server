# ------------ STAGE 1: Build Stage ------------
    FROM node:22.14.0-slim AS builder

    WORKDIR /usr/src/app
    
    # Copy only package files first for better Docker cache
    COPY package*.json ./
    
    RUN npm install
    
    # Copy source code
    COPY . .
    
    # Build the app (like compiling TypeScript to JavaScript)
    RUN npm run build
    
    
    
    # ------------ STAGE 2: Production Stage ------------
    FROM node:22.14.0-slim
    
    WORKDIR /usr/src/app
    
    # Only copy needed files (final output only)
    COPY package*.json ./
    RUN npm install --omit=dev  # Only production deps
    COPY .env .env

    COPY --from=builder /usr/src/app/dist ./dist
    
    # If you have any static files (public folder), copy them too
    # COPY --from=builder /usr/src/app/public ./public
    
    EXPOSE 3000
    
    CMD ["node", "dist/server.js"]
    