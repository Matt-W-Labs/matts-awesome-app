-- ClickHouse initialization script
-- Schema matches PostgreSQL/ShadowTraffic types with PeerDB CDC metadata columns

CREATE DATABASE IF NOT EXISTS retail;

-- Customers table (mirrors PostgreSQL structure with PeerDB metadata)
CREATE TABLE IF NOT EXISTS retail.customers
(
    customer_id String,
    name String,
    birthday String,
    direct_subscription Bool,
    membership_level String,
    shipping_address String,
    activation_date String,
    created_at DateTime64(6),
    updated_at DateTime64(6),
    -- PeerDB CDC metadata columns
    _peerdb_synced_at DateTime64(9) DEFAULT now64(),
    _peerdb_is_deleted UInt8,
    _peerdb_version UInt64
)
ENGINE = ReplacingMergeTree(_peerdb_version)
ORDER BY customer_id;

-- Orders table (mirrors PostgreSQL structure with PeerDB metadata)
CREATE TABLE IF NOT EXISTS retail.orders
(
    order_id String,
    customer_id String,
    product String,
    backordered Bool,
    cost Float64,
    description String,
    create_ts String,
    credit_card_number String,
    discount_percent Float64,
    created_at DateTime64(6),
    updated_at DateTime64(6),
    -- PeerDB CDC metadata columns
    _peerdb_synced_at DateTime64(9) DEFAULT now64(),
    _peerdb_is_deleted UInt8,
    _peerdb_version UInt64
)
ENGINE = ReplacingMergeTree(_peerdb_version)
ORDER BY (customer_id, order_id);

-- Materialized view for daily order summary (excludes soft-deleted records)
CREATE MATERIALIZED VIEW IF NOT EXISTS retail.orders_daily_mv
ENGINE = SummingMergeTree()
ORDER BY order_date
AS SELECT
    toDate(parseDateTimeBestEffortOrZero(create_ts)) AS order_date,
    count() AS order_count,
    sum(cost) AS total_revenue,
    avg(cost) AS avg_order_value,
    sum(if(backordered, 1, 0)) AS backorder_count
FROM retail.orders
WHERE _peerdb_is_deleted = 0
GROUP BY order_date;

-- Materialized view for product analytics (excludes soft-deleted records)
CREATE MATERIALIZED VIEW IF NOT EXISTS retail.products_mv
ENGINE = SummingMergeTree()
ORDER BY product
AS SELECT
    product,
    count() AS order_count,
    sum(cost) AS total_revenue,
    avg(cost) AS avg_price,
    sum(if(backordered, 1, 0)) AS backorder_count
FROM retail.orders
WHERE _peerdb_is_deleted = 0
GROUP BY product;
