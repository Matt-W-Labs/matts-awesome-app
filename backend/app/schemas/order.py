from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class OrderBase(BaseModel):
    customer_id: Optional[str] = None
    product: Optional[str] = None
    backordered: bool = False
    cost: Optional[float] = None
    description: Optional[str] = None
    discount_percent: Optional[float] = Field(default=0)


class OrderCreate(OrderBase):
    order_id: str


class OrderUpdate(BaseModel):
    product: Optional[str] = None
    backordered: Optional[bool] = None
    cost: Optional[float] = None
    description: Optional[str] = None
    discount_percent: Optional[float] = None


class OrderResponse(OrderBase):
    order_id: str
    create_ts: Optional[str] = None
    credit_card_number: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
