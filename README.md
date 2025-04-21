### In Development

We will use **Docker Compose** and a **MongoDB Replica Set** for session support.  
This is necessary because the default MongoDB container does not come with session support enabled.

So, when running the project in development, use the following commands:

```bash
docker compose up -d
./init-replica.sh
```

