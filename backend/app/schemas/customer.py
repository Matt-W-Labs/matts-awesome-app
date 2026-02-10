from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class CustomerBase(BaseModel):
    name: Optional[str] = None
    birthday: Optional[str] = None
    direct_subscription: bool = False
    membership_level: str = Field(default="free")
    shipping_address: Optional[str] = None


class CustomerCreate(CustomerBase):
    customer_id: str


class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    birthday: Optional[str] = None
    direct_subscription: Optional[bool] = None
    membership_level: Optional[str] = None
    shipping_address: Optional[str] = None


class CustomerResponse(CustomerBase):
    customer_id: str
    activation_date: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
