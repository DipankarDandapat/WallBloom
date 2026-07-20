"""
WallBloom - AI Wallpaper Generator Backend
FastAPI application - NO AUTHENTICATION (open access)
"""

import os
import logging
from contextlib import asynccontextmanager
from datetime import datetime
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PIL import Image
from pydantic import BaseModel

from pattern_engine import (
    generate_pattern, blend_patterns, export_to_bytes, PRESET_PALETTES, PatternType
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("✓ WallBloom Backend Started")
    yield
    logger.info("✓ WallBloom Backend Shutdown")

# Initialize FastAPI app
app = FastAPI(
    title="WallBloom API",
    description="AI-powered wallpaper generator backend",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class GenerateWallpaperRequest(BaseModel):
    pattern_type: str
    palette_index: int
    seed: int
    inverted: bool = False

class WallpaperResponse(BaseModel):
    id: int = 1
    pattern_type: str
    palette_index: int
    seed: int
    inverted: bool
    created_at: str

# ============================================================================
# Health Check
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "WallBloom Backend"
    }

# ============================================================================
# Pattern Routes
# ============================================================================

@app.get("/api/patterns")
async def list_patterns():
    """List available patterns"""
    return {
        "patterns": [
            {
                "type": p.value,
                "name": p.value.capitalize(),
                "description": f"A {p.value} pattern"
            }
            for p in PatternType
        ]
    }

# ============================================================================
# Palette Routes
# ============================================================================

@app.get("/api/palettes")
async def list_palettes():
    """List all color palettes"""
    return [
        {
            "id": i,
            "name": p["name"],
            "colors": p["colors"],
            "description": f"Palette: {p['name']}",
            "is_preset": True,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        for i, p in enumerate(PRESET_PALETTES)
    ]

# ============================================================================
# Wallpaper Generation Routes
# ============================================================================

@app.post("/api/wallpapers/generate")
async def generate_wallpaper(request: GenerateWallpaperRequest):
    """
    Generate a wallpaper
    
    Args:
        request: Wallpaper generation request
    
    Returns:
        Wallpaper metadata
    """
    try:
        logger.info(f"Generating wallpaper: {request.pattern_type}, palette: {request.palette_index}, seed: {request.seed}")
        
        # Create wallpaper record (in-memory, no database)
        wallpaper = {
            "id": request.seed % 10000,
            "pattern_type": request.pattern_type,
            "palette_index": request.palette_index,
            "seed": request.seed,
            "inverted": request.inverted,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        logger.info(f"✓ Wallpaper created: {wallpaper['id']}")
        return wallpaper
    
    except Exception as e:
        logger.error(f"Error generating wallpaper: {e}")
        return {"error": str(e)}, 500

# ============================================================================
# Image Preview Routes
# ============================================================================

@app.get("/api/wallpapers/preview")
async def get_wallpaper_preview(
    pattern_type: str = Query("hills"),
    palette_index: int = Query(0),
    seed: int = Query(12345),
    inverted: bool = Query(False),
    width: int = Query(800),
    height: int = Query(600),
    pattern_type_2: str = Query(None),
    blend_ratio: float = Query(0.5)
):
    try:
        logger.info(f"Generating preview: {pattern_type}, palette: {palette_index}, seed: {seed}")

        # Always render at full base resolution so preview matches download exactly
        aspect = width / height
        base_w, base_h = (3840, 2160) if aspect > 1 else (1290, 2796)

        if pattern_type_2:
            image = blend_patterns(
                width=base_w, height=base_h,
                pattern_type_1=pattern_type, pattern_type_2=pattern_type_2,
                palette_index=palette_index, seed=seed,
                inverted=inverted, blend_ratio=blend_ratio
            )
        else:
            image = generate_pattern(
                width=base_w, height=base_h,
                pattern_type=pattern_type,
                palette_index=palette_index,
                seed=seed, inverted=inverted
            )

        image = image.resize((width, height), Image.LANCZOS)
        image_bytes = export_to_bytes(image)
        
        return StreamingResponse(
            iter([image_bytes]),
            media_type="image/png",
            headers={"Content-Disposition": "inline; filename=preview.png"}
        )
    except Exception as e:
        logger.error(f"Error generating preview: {e}")
        return {"error": str(e)}, 500

# ============================================================================
# Image Download Routes
# ============================================================================

@app.get("/api/wallpapers/download/desktop")
async def download_desktop_wallpaper(
    pattern_type: str = Query("hills"),
    palette_index: int = Query(0),
    seed: int = Query(12345),
    inverted: bool = Query(False),
    pattern_type_2: str = Query(None),
    blend_ratio: float = Query(0.5)
):
    try:
        logger.info(f"Downloading desktop: {pattern_type}, palette: {palette_index}, seed: {seed}")
        
        if pattern_type_2:
            image = blend_patterns(
                width=3840, height=2160,
                pattern_type_1=pattern_type, pattern_type_2=pattern_type_2,
                palette_index=palette_index, seed=seed,
                inverted=inverted, blend_ratio=blend_ratio
            )
        else:
            image = generate_pattern(
                width=3840, height=2160,
                pattern_type=pattern_type,
                palette_index=palette_index,
                seed=seed, inverted=inverted
            )
        
        image_bytes = export_to_bytes(image)
        filename = f"wallbloom_desktop_{seed}.png"
        
        return StreamingResponse(
            iter([image_bytes]),
            media_type="image/png",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        logger.error(f"Error downloading desktop: {e}")
        return {"error": str(e)}, 500

@app.get("/api/wallpapers/download/mobile")
async def download_mobile_wallpaper(
    pattern_type: str = Query("hills"),
    palette_index: int = Query(0),
    seed: int = Query(12345),
    inverted: bool = Query(False),
    pattern_type_2: str = Query(None),
    blend_ratio: float = Query(0.5)
):
    try:
        logger.info(f"Downloading mobile: {pattern_type}, palette: {palette_index}, seed: {seed}")
        
        if pattern_type_2:
            image = blend_patterns(
                width=1290, height=2796,
                pattern_type_1=pattern_type, pattern_type_2=pattern_type_2,
                palette_index=palette_index, seed=seed,
                inverted=inverted, blend_ratio=blend_ratio
            )
        else:
            image = generate_pattern(
                width=1290, height=2796,
                pattern_type=pattern_type,
                palette_index=palette_index,
                seed=seed, inverted=inverted
            )
        
        image_bytes = export_to_bytes(image)
        filename = f"wallbloom_mobile_{seed}.png"
        
        return StreamingResponse(
            iter([image_bytes]),
            media_type="image/png",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        logger.error(f"Error downloading mobile: {e}")
        return {"error": str(e)}, 500

# ============================================================================
# Root Endpoint
# ============================================================================

@app.get("/")
async def root():
    """Root endpoint with API info"""
    return {
        "name": "WallBloom API",
        "version": "1.0.0",
        "description": "AI-powered wallpaper generator backend",
        "docs": "/docs",
        "health": "/health",
        "patterns": "/api/patterns",
        "palettes": "/api/palettes"
    }

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
