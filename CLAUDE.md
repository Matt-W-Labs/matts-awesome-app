# Retail Analytics App

A full-stack retail analytics application with real-time data processing.

## Tech Stack

- **Backend**: FastAPI (Python 3.11+)
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Databases**: PostgreSQL 16 (transactional), ClickHouse 24.1 (analytics)
- **CDC**: PeerDB (PostgreSQL → ClickHouse replication)
- **Infrastructure**: Docker Compose

## Project Structure

```
├── backend/           # FastAPI application
│   └── app/
│       ├── routers/   # API endpoints
│       ├── models/    # SQLAlchemy models
│       ├── schemas/   # Pydantic schemas
│       ├── services/  # Business logic
│       └── db/        # Database connections
├── frontend/          # React application
│   └── src/
│       ├── components/
│       ├── pages/
│       └── api/
├── init-scripts/      # Database initialization
│   ├── postgres/
│   └── clickhouse/
├── logs/              # Container logs (gitignored)
└── shadowtraffic/     # Test data generation
```

## Quick Start

```bash
make up              # Start all services (auto-seeds 1000 records)
make down            # Stop all services
make logs            # View all logs
make health          # Check service health
```

**Note:** ShadowTraffic automatically seeds PostgreSQL with 500 customers and 500 orders on startup. Requires a valid license in `shadowtraffic/license.env`.

## Common Commands

```bash
# Database access
make psql            # PostgreSQL shell
make clickhouse-cli  # ClickHouse shell

# Development
make up-build        # Rebuild and start
make test-backend    # Run backend tests
make generate-data   # Generate test data with ShadowTraffic

# Cleanup
make down-clean      # Stop and remove volumes
```

## API

- Backend runs on http://localhost:8000
- API docs: http://localhost:8000/docs
- Frontend runs on http://localhost:5173

## Ports

| Service    | Port |
|------------|------|
| Frontend   | 5173 |
| Backend    | 8000 |
| PostgreSQL | 5432 |
| ClickHouse | 8123 (HTTP), 9000 (native) |
| PeerDB UI  | 3000 |
| PeerDB Server | 9900 |
| MinIO Console | 9001 |

## Environment Variables

Copy `.env.example` to `.env` for local configuration. Key variables:
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `CLICKHOUSE_USER`, `CLICKHOUSE_PASSWORD`, `CLICKHOUSE_DB`

## Conventions

- Backend follows FastAPI best practices with dependency injection
- Use Pydantic for all request/response validation
- ClickHouse is used for read-heavy analytics queries
- PostgreSQL handles transactional CRUD operations
- All API routes are prefixed with `/api/v1`

## CDC with PeerDB

PeerDB handles real-time replication from PostgreSQL to ClickHouse.

**Setup a CDC mirror:**
1. Open PeerDB UI: http://localhost:3000
2. Create a PostgreSQL source peer (host: `postgres`, port: `5432`)
3. Create a ClickHouse destination peer (host: `clickhouse`, port: `9000`)
4. Create a CDC mirror selecting tables to replicate

**PeerDB services:**
- `peerdb-server`: Core server handling SQL interface and migrations (port 9900)
- `peerdb-ui`: Web interface for managing mirrors
- `peerdb-flow-worker`: Handles data replication
- `peerdb-flow-api`: API for flow management
- `temporal`: Workflow orchestration
- `minio`: S3-compatible storage for staging
- `peerdb-setup`: Auto-creates PostgreSQL and ClickHouse peers on startup

## Debugging

Container logs are written to `./logs/`:
- `logs/postgres/postgresql-YYYY-MM-DD.log`
- `logs/clickhouse/clickhouse-server.log`
- `logs/clickhouse/clickhouse-server.err.log`

Use `docker compose logs -f <service>` for live logs.
