from datetime import datetime, timedelta
from io import BytesIO
import re
from uuid import uuid4

import pandas as pd
from fastapi import Depends, FastAPI, File, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import or_
from sqlalchemy.orm import Session

import models
from database import SessionLocal, engine


models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Clientes Zapatería API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://frontend-production-c2ef.up.railway.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

USERS = {
    "ivan": {"password": "Nicole@1", "role": "admin"},
    "claudia": {"password": "Nicole@1", "role": "admin"},
    "tienda": {"password": "tienda", "role": "user"},
}

TOKENS = {}
security = HTTPBearer()

class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    token: str
    username: str
    role: str


class ClienteCreate(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=255)
    fecha_nacimiento: str | None = None
    telefono: str = Field(..., min_length=1, max_length=50)
    email: EmailStr | None = None
    nacionalidad: str = "España"
    compra: str | None = None


class ClienteResponse(BaseModel):
    id: int
    nombre: str
    fecha_nacimiento: str | None
    telefono: str
    email: str
    nacionalidad: str
    compra: str | None
    created_at: datetime

    class Config:
        from_attributes = True


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def normalize_phone(phone: str) -> str:
    return re.sub(r"\D", "", phone or "").strip()


def check_duplicate(db: Session, email: str | None, telefono: str):
    normalized_phone = normalize_phone(telefono)
    clientes = db.query(models.Cliente).all()

    normalized_email = (email or "").strip().lower()

    for cliente in clientes:
        existing_email = (cliente.email or "").strip().lower()
        same_email = bool(normalized_email) and existing_email == normalized_email
        same_phone = normalize_phone(cliente.telefono) == normalized_phone
        if same_email or same_phone:
            return cliente
    return None


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials
    user = TOKENS.get(token)
    if not user:
        raise HTTPException(status_code=401, detail="Token inválido")
    return user


def require_admin(user=Depends(get_current_user)):
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Solo admin")
    return user


def parse_birth_to_age(date_str: str | None):
    if not date_str:
        return None
    try:
        birth = datetime.fromisoformat(date_str)
    except ValueError:
        try:
            birth = datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            return None
    today = datetime.utcnow()
    age = today.year - birth.year - ((today.month, today.day) < (birth.month, birth.day))
    if age < 0 or age > 120:
        return None
    return age


def age_bucket(age: int | None):
    if age is None:
        return "Sin fecha"
    if age < 18:
        return "<18"
    if age <= 24:
        return "18-24"
    if age <= 34:
        return "25-34"
    if age <= 44:
        return "35-44"
    if age <= 54:
        return "45-54"
    if age <= 64:
        return "55-64"
    return "65+"


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest):
    username = payload.username.strip().lower()
    user = USERS.get(username)
    if not user or user["password"] != payload.password:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    token = str(uuid4())
    TOKENS[token] = {"username": username, "role": user["role"]}
    return {"token": token, "username": username, "role": user["role"]}


@app.get("/clientes", response_model=list[ClienteResponse])
def obtener_clientes(
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(models.Cliente).order_by(models.Cliente.created_at.desc()).all()


@app.post("/clientes", response_model=ClienteResponse)
def crear_cliente(
    cliente: ClienteCreate,
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = check_duplicate(db, cliente.email, cliente.telefono)
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Ya existe un cliente registrado con ese email o teléfono.",
        )

    nuevo = models.Cliente(
        nombre=cliente.nombre.strip(),
        fecha_nacimiento=cliente.fecha_nacimiento,
        telefono=cliente.telefono.strip(),
        email=(cliente.email or "").strip().lower() or None,
        nacionalidad=cliente.nacionalidad.strip() or "España",
        compra=(cliente.compra or "").strip() or None,
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.get("/clientes/buscar", response_model=list[ClienteResponse])
def buscar_clientes(
    q: str = "",
    user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = q.strip()
    if not q:
        return db.query(models.Cliente).order_by(models.Cliente.created_at.desc()).all()

    return (
        db.query(models.Cliente)
        .filter(
            or_(
                models.Cliente.nombre.ilike(f"%{q}%"),
                models.Cliente.email.ilike(f"%{q}%"),
                models.Cliente.telefono.ilike(f"%{q}%"),
            )
        )
        .order_by(models.Cliente.created_at.desc())
        .all()
    )


@app.get("/estadisticas")
def estadisticas(
    user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    clientes = db.query(models.Cliente).all()
    now = datetime.utcnow()
    last_month_start = now - timedelta(days=29)
    last_year_start = now.replace(day=1) - timedelta(days=364)

    nationality_distribution = {}
    age_distribution = {}
    daily_last_month = {}
    monthly_last_year = {}
    weekday_counts = {}
    hour_counts = {}

    weekdays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

    for i in range(30):
        d = (last_month_start + timedelta(days=i)).date()
        daily_last_month[d.isoformat()] = 0

    cursor = datetime(now.year, now.month, 1)
    month_keys = []
    for _ in range(12):
        key = f"{cursor.year}-{cursor.month:02d}"
        month_keys.append(key)
        monthly_last_year[key] = 0
        if cursor.month == 1:
            cursor = cursor.replace(year=cursor.year - 1, month=12)
        else:
            cursor = cursor.replace(month=cursor.month - 1)
    month_keys = sorted(month_keys)

    for hour in range(24):
        hour_counts[f"{hour:02d}:00"] = 0
    for day in weekdays:
        weekday_counts[day] = 0

    for cliente in clientes:
        created = cliente.created_at
        nationality = (cliente.nacionalidad or "Sin dato").strip()
        nationality_distribution[nationality] = nationality_distribution.get(nationality, 0) + 1

        age = parse_birth_to_age(cliente.fecha_nacimiento)
        bucket = age_bucket(age)
        age_distribution[bucket] = age_distribution.get(bucket, 0) + 1

        if created.date() >= last_month_start.date():
            key = created.date().isoformat()
            daily_last_month[key] = daily_last_month.get(key, 0) + 1

        month_key = f"{created.year}-{created.month:02d}"
        if month_key in monthly_last_year:
            monthly_last_year[month_key] += 1

        weekday_name = weekdays[created.weekday()]
        weekday_counts[weekday_name] += 1
        hour_counts[f"{created.hour:02d}:00"] += 1

    max_day = max(weekday_counts.items(), key=lambda x: x[1]) if weekday_counts else ("—", 0)
    min_day = min(weekday_counts.items(), key=lambda x: x[1]) if weekday_counts else ("—", 0)
    max_hour = max(hour_counts.items(), key=lambda x: x[1]) if hour_counts else ("—", 0)
    min_hour = min(hour_counts.items(), key=lambda x: x[1]) if hour_counts else ("—", 0)

    return {
        "total_clientes": len(clientes),
        "nationality_distribution": nationality_distribution,
        "age_distribution": age_distribution,
        "daily_last_month": daily_last_month,
        "monthly_last_year": {key: monthly_last_year[key] for key in month_keys},
        "weekday_counts": weekday_counts,
        "hour_counts": hour_counts,
        "top_day": {"label": max_day[0], "value": max_day[1]},
        "bottom_day": {"label": min_day[0], "value": min_day[1]},
        "top_hour": {"label": max_hour[0], "value": max_hour[1]},
        "bottom_hour": {"label": min_hour[0], "value": min_hour[1]},
    }


@app.get("/exportar-excel")
def exportar_excel(
    user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    clientes = db.query(models.Cliente).order_by(models.Cliente.created_at.desc()).all()
    rows = [
        {
            "id": c.id,
            "nombre": c.nombre,
            "fecha_nacimiento": c.fecha_nacimiento,
            "telefono": c.telefono,
            "email": c.email,
            "nacionalidad": c.nacionalidad,
            "compra": c.compra,
            "created_at": c.created_at.isoformat(),
        }
        for c in clientes
    ]

    df = pd.DataFrame(rows)
    output = BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="clientes")

    output.seek(0)
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=clientes.xlsx"},
    )


@app.post("/importar-excel")
async def importar_excel(
    file: UploadFile = File(...),
    user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    if not file.filename.lower().endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="El archivo debe ser .xlsx")

    contents = await file.read()
    df = pd.read_excel(BytesIO(contents))

    required_columns = {
        "nombre",
        "fecha_nacimiento",
        "telefono",
        "email",
        "nacionalidad",
        "compra",
    }
    missing = required_columns - set(df.columns)
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Faltan columnas en el Excel: {', '.join(sorted(missing))}",
        )

    inserted = 0
    skipped = 0

    for _, row in df.iterrows():
        nombre = str(row.get("nombre", "")).strip()
        telefono = str(row.get("telefono", "")).strip()
        email = str(row.get("email", "")).strip().lower()

        if not nombre or not telefono or not email:
            skipped += 1
            continue

        existing = check_duplicate(db, email, telefono)
        if existing:
            skipped += 1
            continue

        nuevo = models.Cliente(
            nombre=nombre,
            fecha_nacimiento=str(row.get("fecha_nacimiento", "")).strip() or None,
            telefono=telefono,
            email=email,
            nacionalidad=str(row.get("nacionalidad", "España")).strip() or "España",
            compra=str(row.get("compra", "")).strip() or None,
        )
        db.add(nuevo)
        inserted += 1

    db.commit()

    return {
        "message": "Importación completada",
        "insertados": inserted,
        "omitidos": skipped,
    }
    
@app.delete("/admin/reset-clientes")
def reset_clientes(
    user=Depends(require_admin),
    db: Session = Depends(get_db),
):
    db.query(models.Cliente).delete()
    db.commit()
    return {"message": "Todos los clientes han sido eliminados"}
