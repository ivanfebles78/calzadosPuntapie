from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String

from database import Base


class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=False)
    fecha_nacimiento = Column(String(50), nullable=True)
    telefono = Column(String(50), nullable=False, index=True)
    email = Column(String(255), nullable=False, index=True)
    nacionalidad = Column(String(100), nullable=False, default="España")
    compra = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
