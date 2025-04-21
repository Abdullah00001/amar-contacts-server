#!/bin/bash

# Wait for MongoDB to be ready
until docker exec database_container mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  echo "⏳ Waiting for MongoDB to be ready..."
  sleep 2
done

echo "✅ MongoDB is up. Initializing replica set..."

# Initialize replica set if not already
docker exec database_container mongosh --eval 'rs.initiate()' || echo "Replica set may already be initialized."

echo "✅ Replica set initiated (or already initialized)."
