from app.db.clickhouse import clickhouse_connection
from app.schemas.analytics import (
    SummaryResponse,
    OrdersByMembershipResponse,
    MembershipData,
    OrdersOverTimeResponse,
    TimeSeriesDataPoint,
    TopProductsResponse,
    ProductData,
    BackorderRatesResponse,
    BackorderData,
)
from datetime import date, timedelta


class AnalyticsService:
    def get_summary(self) -> SummaryResponse:
        with clickhouse_connection() as client:
            # Total customers (FINAL forces deduplication for ReplacingMergeTree)
            result = client.query("SELECT count() FROM customers FINAL WHERE _peerdb_is_deleted = 0")
            total_customers = result.result_rows[0][0] if result.result_rows else 0

            # Order stats
            result = client.query("""
                SELECT
                    count() as total_orders,
                    sum(cost) as total_revenue,
                    avg(cost) as avg_order_value,
                    countIf(backordered) / count() as backorder_rate
                FROM orders FINAL
                WHERE _peerdb_is_deleted = 0
            """)

            if result.result_rows and result.result_rows[0]:
                row = result.result_rows[0]
                total_orders = row[0] or 0
                total_revenue = float(row[1] or 0)
                avg_order_value = float(row[2] or 0)
                backorder_rate = float(row[3] or 0)
            else:
                total_orders = 0
                total_revenue = 0.0
                avg_order_value = 0.0
                backorder_rate = 0.0

            return SummaryResponse(
                total_customers=total_customers,
                total_orders=total_orders,
                total_revenue=total_revenue,
                avg_order_value=avg_order_value,
                backorder_rate=backorder_rate,
            )

    def get_orders_by_membership(self) -> OrdersByMembershipResponse:
        with clickhouse_connection() as client:
            result = client.query("""
                SELECT
                    c.membership_level,
                    count() as order_count,
                    sum(o.cost) as total_revenue,
                    avg(o.cost) as avg_order_value
                FROM orders FINAL AS o
                INNER JOIN customers FINAL AS c ON o.customer_id = c.customer_id
                WHERE o._peerdb_is_deleted = 0 AND c._peerdb_is_deleted = 0
                GROUP BY c.membership_level
                ORDER BY total_revenue DESC
            """)

            data = [
                MembershipData(
                    membership_level=row[0],
                    order_count=row[1],
                    total_revenue=float(row[2]),
                    avg_order_value=float(row[3]),
                )
                for row in result.result_rows
            ]

            return OrdersByMembershipResponse(data=data)

    def get_orders_over_time(self, days: int = 30) -> OrdersOverTimeResponse:
        with clickhouse_connection() as client:
            start_date = date.today() - timedelta(days=days)
            result = client.query(f"""
                SELECT
                    toDate(create_ts) as order_date,
                    count() as order_count,
                    sum(cost) as total_revenue
                FROM orders FINAL
                WHERE _peerdb_is_deleted = 0 AND create_ts >= '{start_date}'
                GROUP BY order_date
                ORDER BY order_date
            """)

            data = [
                TimeSeriesDataPoint(
                    date=row[0],
                    order_count=row[1],
                    total_revenue=float(row[2]),
                )
                for row in result.result_rows
            ]

            return OrdersOverTimeResponse(data=data)

    def get_top_products(self, limit: int = 10) -> TopProductsResponse:
        with clickhouse_connection() as client:
            result = client.query(f"""
                SELECT
                    product,
                    count() as order_count,
                    sum(cost) as total_revenue,
                    avg(cost) as avg_price
                FROM orders FINAL
                WHERE _peerdb_is_deleted = 0
                GROUP BY product
                ORDER BY total_revenue DESC
                LIMIT {limit}
            """)

            data = [
                ProductData(
                    product=row[0],
                    order_count=row[1],
                    total_revenue=float(row[2]),
                    avg_price=float(row[3]),
                )
                for row in result.result_rows
            ]

            return TopProductsResponse(data=data)

    def get_backorder_rates(self, limit: int = 10) -> BackorderRatesResponse:
        with clickhouse_connection() as client:
            # Overall rate
            result = client.query("""
                SELECT countIf(backordered) / count() as overall_rate
                FROM orders FINAL
                WHERE _peerdb_is_deleted = 0
            """)
            overall_rate = float(result.result_rows[0][0]) if result.result_rows else 0.0

            # By product
            result = client.query(f"""
                SELECT
                    product,
                    count() as total_orders,
                    countIf(backordered) as backorder_count,
                    countIf(backordered) / count() as backorder_rate
                FROM orders FINAL
                WHERE _peerdb_is_deleted = 0
                GROUP BY product
                HAVING backorder_count > 0
                ORDER BY backorder_rate DESC
                LIMIT {limit}
            """)

            by_product = [
                BackorderData(
                    product=row[0],
                    total_orders=row[1],
                    backorder_count=row[2],
                    backorder_rate=float(row[3]),
                )
                for row in result.result_rows
            ]

            return BackorderRatesResponse(
                overall_rate=overall_rate,
                by_product=by_product,
            )


analytics_service = AnalyticsService()
