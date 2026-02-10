import clickhouse_connect
from contextlib import contextmanager
from app.config import get_settings

settings = get_settings()


def get_clickhouse_client():
    return clickhouse_connect.get_client(
        host=settings.clickhouse_host,
        port=settings.clickhouse_port,
        username=settings.clickhouse_user,
        password=settings.clickhouse_password,
        database=settings.clickhouse_db,
    )


@contextmanager
def clickhouse_connection():
    client = get_clickhouse_client()
    try:
        yield client
    finally:
        client.close()
