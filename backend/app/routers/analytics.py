from fastapi import APIRouter, Query

from app.services.analytics_service import analytics_service
from app.schemas.analytics import (
    SummaryResponse,
    OrdersByMembershipResponse,
    OrdersOverTimeResponse,
    TopProductsResponse,
    BackorderRatesResponse,
)

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary", response_model=SummaryResponse)
def get_summary():
    return analytics_service.get_summary()


@router.get("/orders-by-membership", response_model=OrdersByMembershipResponse)
def get_orders_by_membership():
    return analytics_service.get_orders_by_membership()


@router.get("/orders-over-time", response_model=OrdersOverTimeResponse)
def get_orders_over_time(days: int = Query(30, ge=1, le=365)):
    return analytics_service.get_orders_over_time(days=days)


@router.get("/top-products", response_model=TopProductsResponse)
def get_top_products(limit: int = Query(10, ge=1, le=100)):
    return analytics_service.get_top_products(limit=limit)


@router.get("/backorder-rates", response_model=BackorderRatesResponse)
def get_backorder_rates(limit: int = Query(10, ge=1, le=100)):
    return analytics_service.get_backorder_rates(limit=limit)
