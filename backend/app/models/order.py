from sqlalchemy import Column, String, Boolean, Float, DateTime, Text
from datetime import datetime

from app.db.postgres import Base


class Order(Base):
    __tablename__ = "orders"

    order_id = Column(Text, primary_key=True)
    customer_id = Column(Text, nullable=True)
    product = Column(Text, nullable=True)
    backordered = Column(Boolean, default=False)
    cost = Column(Float, nullable=True)
    description = Column(Text, nullable=True)
    create_ts = Column(Text, nullable=True)
    credit_card_number = Column(Text, nullable=True)
    discount_percent = Column(Float, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
