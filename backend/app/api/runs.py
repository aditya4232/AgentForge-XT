from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db import get_db
from app.models.models import Run
from app.schemas.schemas import RunResponse

router = APIRouter()

@router.get("/{id}", response_model=RunResponse)
async def get_run(id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Run).where(Run.id == id))
    run = result.scalar_one_or_none()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run
