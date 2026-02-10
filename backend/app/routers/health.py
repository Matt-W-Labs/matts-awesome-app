from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.db.postgres import get_db
from app.db.clickhouse import get_clickhouse_client

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    health = {
        "status": "healthy",
        "postgres": "unknown",
        "clickhouse": "unknown",
    }

    # Check PostgreSQL
    try:
        db.execute(text("SELECT 1"))
        health["postgres"] = "healthy"
    except Exception as e:
        health["postgres"] = f"unhealthy: {str(e)}"
        health["status"] = "degraded"

    # Check ClickHouse
    try:
        client = get_clickhouse_client()
        client.command("SELECT 1")
        client.close()
        health["clickhouse"] = "healthy"
    except Exception as e:
        health["clickhouse"] = f"unhealthy: {str(e)}"
        health["status"] = "degraded"

    return health
