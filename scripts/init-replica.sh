#!/bin/bash

# Wait for MongoDB to be ready
until docker exec database_container mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
  echo "⏳ Waiting for MongoDB to be ready..."
  sleep 2
done

HOST_IP="10.0.0.103"  # Your actual host IP
# HOST_IP="database_container:27017"

echo "✅ MongoDB is up. Initiating replica set with host $HOST_IP..."

docker exec database_container mongosh --eval "rs.initiate({
  _id: 'rs0',
  members: [{ _id: 0, host: '${HOST_IP}:27017' }]
})" \
&& echo "✅ Replica set initiated." \
|| echo "⚠️ Replica set may already be initialized or failed."
