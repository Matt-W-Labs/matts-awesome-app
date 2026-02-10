.PHONY: up down build logs clean init-db generate-data

# Start all services
up:
	docker-compose up -d

# Start all services with build
up-build:
	docker-compose up -d --build

# Stop all services
down:
	docker-compose down

# Stop all services and remove volumes
down-clean:
	docker-compose down -v

# Build all services
build:
	docker-compose build

# View logs for all services
logs:
	docker-compose logs -f

# View logs for specific service (usage: make logs-backend)
logs-%:
	docker-compose logs -f $*

# Clean up Docker resources
clean:
	docker-compose down -v --rmi local
	docker system prune -f

# Generate test data using ShadowTraffic (runs automatically on startup)
seed-data:
	docker-compose up shadowtraffic

# Initialize databases with schema
init-db:
	docker-compose exec postgres psql -U postgres -f /docker-entrypoint-initdb.d/01-init.sql
	docker-compose exec clickhouse clickhouse-client --queries-file /docker-entrypoint-initdb.d/01-init.sql

# Backend shell
backend-shell:
	docker-compose exec backend bash

# PostgreSQL shell
psql:
	docker-compose exec postgres psql -U postgres

# ClickHouse shell
clickhouse-cli:
	docker-compose exec clickhouse clickhouse-client

# Run backend tests
test-backend:
	docker-compose exec backend pytest

# Check health of all services
health:
	@echo "Checking backend health..."
	@curl -s http://localhost:8000/api/v1/health | jq . || echo "Backend not responding"
	@echo "\nChecking PostgreSQL..."
	@docker-compose exec postgres pg_isready -U postgres || echo "PostgreSQL not ready"
	@echo "\nChecking ClickHouse..."
	@docker-compose exec clickhouse clickhouse-client --query "SELECT 1" || echo "ClickHouse not ready"

# Development helpers
dev-backend:
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend:
	cd frontend && npm run dev

# PeerDB commands
peerdb-ui:
	@echo "Opening PeerDB UI at http://localhost:3000"
	@open http://localhost:3000 2>/dev/null || echo "Visit http://localhost:3000"

peerdb-logs:
	docker-compose logs -f peerdb-flow-worker peerdb-flow-api peerdb-ui

# Start core services only (without PeerDB)
up-core:
	docker-compose up -d postgres clickhouse backend frontend
