# Docker Commands Quick Reference

## Starting Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d keycloak

# Start with logs visible
docker-compose up
```

## Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ This deletes all data)
docker-compose down -v
```

## Viewing Logs

```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs -f keycloak
docker-compose logs -f keycloak-db
```

## Service Status

```bash
# Check running services
docker-compose ps

# Check all containers
docker ps -a
```

## Database Access

### Keycloak Database
```bash
# Connect to Keycloak DB
docker exec -it oglasnik-keycloak-db psql -U keycloak -d keycloak

# Backup Keycloak DB
docker exec oglasnik-keycloak-db pg_dump -U keycloak keycloak > keycloak_backup.sql

# Restore Keycloak DB
docker exec -i oglasnik-keycloak-db psql -U keycloak -d keycloak < keycloak_backup.sql
```

### Application Database
```bash
# Connect to App DB
docker exec -it oglasnik-app-db psql -U oglasnik_user -d oglasnik

# Backup App DB
docker exec oglasnik-app-db pg_dump -U oglasnik_user oglasnik > app_backup.sql

# Restore App DB
docker exec -i oglasnik-app-db psql -U oglasnik_user -d oglasnik < app_backup.sql
```

## Troubleshooting

### Reset Everything
```bash
docker-compose down -v
docker system prune -a
docker-compose up -d
```

### View Container Details
```bash
docker inspect oglasnik-keycloak
docker stats oglasnik-keycloak
```

### Access Container Shell
```bash
docker exec -it oglasnik-keycloak bash
```

### Check Network
```bash
docker network ls
docker network inspect oglasnik-network
```

## Health Checks

```bash
# Check Keycloak health
curl http://localhost:8080/health

# Check database connection
docker exec oglasnik-keycloak-db pg_isready -U keycloak
docker exec oglasnik-app-db pg_isready -U oglasnik_user
```
