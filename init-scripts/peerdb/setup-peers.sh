#!/bin/sh

FLOW_API="http://peerdb-flow-api:8113"
MAX_RETRIES=30
RETRY_DELAY=5

echo "=== PeerDB Setup Script ==="

# Function to retry a command
retry_command() {
  cmd="$1"
  description="$2"
  retries=0

  while [ $retries -lt $MAX_RETRIES ]; do
    if eval "$cmd"; then
      return 0
    fi
    retries=$((retries + 1))
    echo "$description failed, retry $retries/$MAX_RETRIES in ${RETRY_DELAY}s..."
    sleep $RETRY_DELAY
  done

  echo "ERROR: $description failed after $MAX_RETRIES retries"
  return 1
}

# Wait for Flow API to be ready
echo "Waiting for PeerDB Flow API to be ready..."
retry_command "curl -sf '$FLOW_API/v1/version' > /dev/null 2>&1" "Flow API check"
echo "Flow API is ready!"

# Wait for catalog schema to be initialized
echo "Waiting for PeerDB catalog schema to be ready..."
sleep 15

# Create PostgreSQL peer
echo "Creating PostgreSQL source peer..."
PG_RESULT=$(curl -sf -X POST "$FLOW_API/v1/peers/create" \
  -H "Content-Type: application/json" \
  -d '{
    "peer": {
      "name": "postgres-source",
      "type": "POSTGRES",
      "postgres_config": {
        "host": "postgres",
        "port": 5432,
        "user": "postgres",
        "password": "postgres",
        "database": "postgres"
      }
    }
  }' 2>&1) || true
echo "PostgreSQL peer result: $PG_RESULT"

# Create ClickHouse peer
echo "Creating ClickHouse destination peer..."
CH_RESULT=$(curl -sf -X POST "$FLOW_API/v1/peers/create" \
  -H "Content-Type: application/json" \
  -d '{
    "peer": {
      "name": "clickhouse-dest",
      "type": "CLICKHOUSE",
      "clickhouse_config": {
        "host": "clickhouse",
        "port": 9000,
        "user": "default",
        "password": "clickhouse",
        "database": "retail",
        "disable_tls": true,
        "s3_path": "peerdb",
        "access_key_id": "peerdb",
        "secret_access_key": "peerdb123",
        "region": "us-east-1",
        "endpoint": "http://minio:9000"
      }
    }
  }' 2>&1) || true
echo "ClickHouse peer result: $CH_RESULT"

# Check if CDC flow already exists
echo "Checking for existing CDC flow..."
MIRRORS_RESPONSE=$(curl -sf "$FLOW_API/v1/mirrors/list" 2>&1) || MIRRORS_RESPONSE="{}"
echo "Mirrors response: $MIRRORS_RESPONSE"

if echo "$MIRRORS_RESPONSE" | grep -q '"name":"retail_cdc"'; then
  echo "CDC flow already exists, skipping..."
else
  echo "Creating CDC flow..."
  CDC_RESULT=$(curl -sf -X POST "$FLOW_API/v1/flows/cdc/create" \
    -H "Content-Type: application/json" \
    -d '{
      "connection_configs": {
        "flow_job_name": "retail_cdc",
        "source_name": "postgres-source",
        "destination_name": "clickhouse-dest",
        "table_mappings": [
          {
            "source_table_identifier": "public.customers",
            "destination_table_identifier": "customers"
          },
          {
            "source_table_identifier": "public.orders",
            "destination_table_identifier": "orders"
          }
        ],
        "do_initial_snapshot": true,
        "publication_name": "peerdb_pub_retail_cdc",
        "replication_slot_name": "peerdb_slot_retail_cdc",
        "snapshot_max_parallel_workers": 4,
        "snapshot_num_rows_per_partition": 500000,
        "soft_delete": true,
        "soft_delete_col_name": "_peerdb_is_deleted",
        "synced_at_col_name": "_peerdb_synced_at"
      }
    }' 2>&1) || true
  echo "CDC flow result: $CDC_RESULT"
fi

echo "=== PeerDB Setup Complete ==="
