# ------------ STAGE 1: Build Stage ------------
    FROM node:22.14.0-slim AS builder

    WORKDIR /usr/src/app

    # Declare build arguments to receive secrets during build
    ARG MONGODB_URI
    ARG CLOUDINARY_NAME
    ARG CLOUDINARY_API_KEY
    ARG CLOUDINARY_API_SECRET_KEY
    ARG REDIS_URI
    ARG JWT_ACCESS_TOKEN_SECRET_KEY
    ARG JWT_REFRESH_TOKEN_SECRET_KEY
    ARG JWT_RECOVER_SESSION_TOKEN_SECRET_KEY
    ARG SMTP_HOST
    ARG SMTP_PORT
    ARG SMTP_USER
    ARG SMTP_PASS

    # Export build args as env vars for the build step (including tests)
    ENV MONGODB_URI=$MONGODB_URI
    ENV CLOUDINARY_NAME=$CLOUDINARY_NAME
    ENV CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY
    ENV CLOUDINARY_API_SECRET_KEY=$CLOUDINARY_API_SECRET_KEY
    ENV REDIS_URI=$REDIS_URI
    ENV JWT_ACCESS_TOKEN_SECRET_KEY=$JWT_ACCESS_TOKEN_SECRET_KEY
    ENV JWT_REFRESH_TOKEN_SECRET_KEY=$JWT_REFRESH_TOKEN_SECRET_KEY
    ENV JWT_RECOVER_SESSION_TOKEN_SECRET_KEY=$JWT_RECOVER_SESSION_TOKEN_SECRET_KEY
    ENV SMTP_HOST=$SMTP_HOST
    ENV SMTP_PORT=$SMTP_PORT
    ENV SMTP_USER=$SMTP_USER
    ENV SMTP_PASS=$SMTP_PASS
    
    # Install deps for build
    COPY package*.json ./
    RUN npm install
    
    # Copy full source code and build it
    COPY . .
    RUN npm run build
    
    
    # ------------ STAGE 2: Production Stage ------------
    FROM node:22.14.0-slim
    
    WORKDIR /usr/src/app
    
    # Copy only production dependencies
    COPY package*.json ./
    RUN npm install --omit=dev
    
    # Copy built code from builder
    COPY --from=builder /usr/src/app/dist ./dist
    
    # Copy any necessary runtime assets (optional)
    # COPY --from=builder /usr/src/app/public ./public
    
    # Expose the app port
    EXPOSE 3000
    
    # Define the startup command
    CMD ["node", "dist/server.js"]
    