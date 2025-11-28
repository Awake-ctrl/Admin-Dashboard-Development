from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import schemas, crud
from database import get_db

router = APIRouter(prefix="/api/features", tags=["features"])

@router.get("/", response_model=List[schemas.Feature])
def read_features(
    skip: int = 0, 
    limit: int = 100, 
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve all features with optional filtering.
    """
    features = crud.get_features(db, skip=skip, limit=limit, is_active=is_active)
    return features

@router.get("/{feature_id}", response_model=schemas.Feature)
def read_feature(feature_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific feature by ID.
    """
    db_feature = crud.get_feature(db, feature_id=feature_id)
    if db_feature is None:
        raise HTTPException(status_code=404, detail="Feature not found")
    return db_feature

@router.post("/", response_model=schemas.Feature, status_code=status.HTTP_201_CREATED)
def create_feature(feature: schemas.FeatureCreate, db: Session = Depends(get_db)):
    """
    Create a new feature.
    """
    try:
        return crud.create_feature(db=db, feature=feature)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{feature_id}", response_model=schemas.Feature)
def update_feature(feature_id: int, feature: schemas.FeatureUpdate, db: Session = Depends(get_db)):
    """
    Update an existing feature.
    """
    db_feature = crud.update_feature(db=db, feature_id=feature_id, feature=feature)
    if db_feature is None:
        raise HTTPException(status_code=404, detail="Feature not found")
    return db_feature

@router.delete("/{feature_id}")
def delete_feature(feature_id: int, db: Session = Depends(get_db)):
    """
    Delete a feature.
    """
    db_feature = crud.delete_feature(db=db, feature_id=feature_id)
    if db_feature is None:
        raise HTTPException(status_code=404, detail="Feature not found")
    return {"message": "Feature deleted successfully"}