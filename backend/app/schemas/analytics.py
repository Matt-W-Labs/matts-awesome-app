from pydantic import BaseModel
from datetime import date
from typing import Optional


class SummaryResponse(BaseModel):
    total_customers: int
    total_orders: int
    total_revenue: float
    avg_order_value: float
    backorder_rate: float


class MembershipData(BaseModel):
    membership_level: str
    order_count: int
    total_revenue: float
    avg_order_value: float


class OrdersByMembershipResponse(BaseModel):
    data: list[MembershipData]


class TimeSeriesDataPoint(BaseModel):
    date: date
    order_count: int
    total_revenue: float


class OrdersOverTimeResponse(BaseModel):
    data: list[TimeSeriesDataPoint]


class ProductData(BaseModel):
    product: str
    order_count: int
    total_revenue: float
    avg_price: float


class TopProductsResponse(BaseModel):
    data: list[ProductData]


class BackorderData(BaseModel):
    product: str
    total_orders: int
    backorder_count: int
    backorder_rate: float


class BackorderRatesResponse(BaseModel):
    overall_rate: float
    by_product: list[BackorderData]
