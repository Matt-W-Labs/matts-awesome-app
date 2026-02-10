from sqlalchemy import Column, String, Boolean, DateTime, Text
from datetime import datetime

from app.db.postgres import Base


class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(Text, primary_key=True)
    name = Column(Text, nullable=True)
    birthday = Column(Text, nullable=True)
    direct_subscription = Column(Boolean, default=False)
    membership_level = Column(Text, default="free")
    shipping_address = Column(Text, nullable=True)
    activation_date = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
