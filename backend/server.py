from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from enum import Enum
import numpy as np
import json
import re

# Load environment variables FIRST
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Import AI libraries after loading env
from emergentintegrations.llm.chat import LlmChat, UserMessage

# Content extraction
import trafilatura
from bs4 import BeautifulSoup

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# AI Configuration
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ==================== ENUMS ====================
class Platform(str, Enum):
    INSTAGRAM = "instagram"
    TIKTOK = "tiktok"
    YOUTUBE = "youtube"
    TWITTER = "twitter"
    PINTEREST = "pinterest"
    LINKEDIN = "linkedin"
    FACEBOOK = "facebook"
    OTHER = "other"

class ContentType(str, Enum):
    IMAGE = "image"
    VIDEO = "video"
    REEL = "reel"
    STORY = "story"
    POST = "post"
    TWEET = "tweet"
    PIN = "pin"
    ARTICLE = "article"
    OTHER = "other"

class AIProcessingStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

# ==================== MODELS ====================
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: str
    updated_at: str

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    session_id: str
    user_id: str
    session_token: str
    expires_at: str
    created_at: str

class Collection(BaseModel):
    model_config = ConfigDict(extra="ignore")
    collection_id: str
    user_id: str
    name: str
    description: Optional[str] = None
    color: str = "#2563EB"
    icon: str = "folder"
    content_count: int = 0
    is_default: bool = False
    created_at: str
    updated_at: str

# Enhanced SavedContent model with AI fields
class SavedContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    content_id: str
    user_id: str
    platform: Platform
    content_type: ContentType
    title: str
    description: Optional[str] = None
    url: str
    thumbnail_url: Optional[str] = None
    media_url: Optional[str] = None
    author_name: Optional[str] = None
    author_url: Optional[str] = None
    tags: List[str] = []
    collection_ids: List[str] = []
    is_favorite: bool = False
    notes: Optional[str] = None
    # AI-enhanced fields
    raw_text: Optional[str] = None
    summary: Optional[str] = None
    ai_tags: List[str] = []
    category: Optional[str] = None
    ai_status: AIProcessingStatus = AIProcessingStatus.PENDING
    has_embedding: bool = False
    created_at: str
    updated_at: str

# ==================== REQUEST/RESPONSE MODELS ====================
class CreateCollectionRequest(BaseModel):
    name: str
    description: Optional[str] = None
    color: str = "#2563EB"
    icon: str = "folder"

class UpdateCollectionRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None

class CreateContentRequest(BaseModel):
    platform: Platform
    content_type: ContentType
    title: str
    description: Optional[str] = None
    url: str
    thumbnail_url: Optional[str] = None
    media_url: Optional[str] = None
    author_name: Optional[str] = None
    author_url: Optional[str] = None
    tags: List[str] = []
    collection_ids: List[str] = []
    notes: Optional[str] = None

class UpdateContentRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    collection_ids: Optional[List[str]] = None
    is_favorite: Optional[bool] = None
    notes: Optional[str] = None

class UserStats(BaseModel):
    total_saves: int
    total_collections: int
    saves_by_platform: dict
    saves_by_type: dict
    recent_activity: int

# Semantic Search Request/Response
class SemanticSearchRequest(BaseModel):
    query: str
    limit: int = 10

class SearchResult(BaseModel):
    content_id: str
    title: str
    summary: Optional[str]
    category: Optional[str]
    tags: List[str]
    ai_tags: List[str]
    platform: str
    url: str
    thumbnail_url: Optional[str]
    similarity_score: float
    created_at: str

# ==================== AI SERVICE FUNCTIONS ====================

async def fetch_page_content(url: str) -> tuple[str, str]:
    """
    Fetch and extract readable content from a URL.
    Returns (title, raw_text)
    """
    try:
        async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client_http:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = await client_http.get(url, headers=headers)
            html_content = response.text
        
        # Use trafilatura for clean text extraction (removes nav, ads, etc.)
        extracted_text = trafilatura.extract(html_content, include_comments=False, include_tables=True)
        
        # Fallback to BeautifulSoup if trafilatura fails
        if not extracted_text:
            soup = BeautifulSoup(html_content, 'lxml')
            # Remove script, style, nav elements
            for element in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
                element.decompose()
            extracted_text = soup.get_text(separator=' ', strip=True)
        
        # Extract title
        soup = BeautifulSoup(html_content, 'lxml')
        title_tag = soup.find('title')
        title = title_tag.get_text(strip=True) if title_tag else ""
        
        # Truncate text to avoid token limits (keep first 8000 chars)
        if extracted_text and len(extracted_text) > 8000:
            extracted_text = extracted_text[:8000] + "..."
        
        return title, extracted_text or ""
    except Exception as e:
        logger.error(f"Error fetching content from {url}: {e}")
        return "", ""

async def summarize_and_analyze_content(text: str, title: str = "") -> dict:
    """
    Use AI to summarize content, extract tags, and categorize.
    Returns dict with summary, tags, category
    """
    if not text or not EMERGENT_LLM_KEY:
        return {"summary": None, "tags": [], "category": None}
    
    try:
        # Combine title and text for context
        combined_text = f"Title: {title}\n\nContent:\n{text[:4000]}"  # Limit for prompt
        
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"analyze_{uuid.uuid4().hex[:8]}",
            system_message="""You are an intelligent content assistant.
Analyze the content and return ONLY valid JSON with this exact structure:
{
  "summary": "3 concise bullet points summarizing the key information",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "one word category like fitness, finance, cooking, tech, fashion, travel, music, art, news, education, entertainment, lifestyle, business, health, sports, gaming, science"
}
Return ONLY the JSON, no additional text."""
        ).with_model("openai", "gpt-4o-mini")
        
        user_message = UserMessage(text=f"Analyze this content:\n\n{combined_text}")
        response = await chat.send_message(user_message)
        
        # Parse JSON response
        # Clean response - remove markdown code blocks if present
        cleaned_response = response.strip()
        if cleaned_response.startswith("```"):
            cleaned_response = re.sub(r'^```(?:json)?\n?', '', cleaned_response)
            cleaned_response = re.sub(r'\n?```$', '', cleaned_response)
        
        result = json.loads(cleaned_response)
        return {
            "summary": result.get("summary", ""),
            "tags": result.get("tags", [])[:5],  # Limit to 5 tags
            "category": result.get("category", "other").lower()
        }
    except json.JSONDecodeError as e:
        logger.error(f"JSON parse error in AI response: {e}")
        return {"summary": None, "tags": [], "category": None}
    except Exception as e:
        logger.error(f"Error in AI analysis: {e}")
        return {"summary": None, "tags": [], "category": None}

async def generate_embedding(text: str) -> List[float]:
    """
    Generate embedding vector for semantic search using OpenAI.
    Returns list of floats representing the embedding vector.
    """
    if not text or not EMERGENT_LLM_KEY:
        return []
    
    try:
        # Use httpx to call OpenAI embeddings API directly
        async with httpx.AsyncClient(timeout=30.0) as client_http:
            response = await client_http.post(
                "https://api.openai.com/v1/embeddings",
                headers={
                    "Authorization": f"Bearer {EMERGENT_LLM_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "text-embedding-3-small",
                    "input": text[:8000]  # Truncate to avoid token limits
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return data["data"][0]["embedding"]
            else:
                logger.error(f"Embedding API error: {response.status_code} - {response.text}")
                return []
    except Exception as e:
        logger.error(f"Error generating embedding: {e}")
        return []

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    """Calculate cosine similarity between two vectors."""
    if not vec1 or not vec2:
        return 0.0
    
    a = np.array(vec1)
    b = np.array(vec2)
    
    dot_product = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    
    if norm_a == 0 or norm_b == 0:
        return 0.0
    
    return float(dot_product / (norm_a * norm_b))

async def process_content_ai(content_id: str, user_id: str):
    """
    Background task to process content with AI.
    1. Fetch page content
    2. Summarize and analyze
    3. Generate embedding
    4. Store results
    """
    try:
        # Get content
        content = await db.saved_content.find_one(
            {"content_id": content_id, "user_id": user_id},
            {"_id": 0}
        )
        
        if not content:
            logger.error(f"Content not found: {content_id}")
            return
        
        # Update status to processing
        await db.saved_content.update_one(
            {"content_id": content_id},
            {"$set": {"ai_status": AIProcessingStatus.PROCESSING.value}}
        )
        
        url = content.get("url", "")
        title = content.get("title", "")
        
        # Step 1: Fetch page content
        fetched_title, raw_text = await fetch_page_content(url)
        if fetched_title and not title:
            title = fetched_title
        
        # Use existing description as fallback
        if not raw_text:
            raw_text = content.get("description", "") or content.get("notes", "") or title
        
        # Step 2: AI Analysis (summarize, tags, category)
        ai_result = await summarize_and_analyze_content(raw_text, title)
        
        # Step 3: Generate embedding
        # Combine title + summary + raw_text for embedding
        embedding_text = f"{title} {ai_result.get('summary', '')} {raw_text[:2000]}"
        embedding_vector = await generate_embedding(embedding_text)
        
        # Step 4: Store results
        update_data = {
            "raw_text": raw_text[:5000] if raw_text else None,  # Truncate for storage
            "summary": ai_result.get("summary"),
            "ai_tags": ai_result.get("tags", []),
            "category": ai_result.get("category"),
            "ai_status": AIProcessingStatus.COMPLETED.value,
            "has_embedding": len(embedding_vector) > 0,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        if title and not content.get("title"):
            update_data["title"] = title
        
        await db.saved_content.update_one(
            {"content_id": content_id},
            {"$set": update_data}
        )
        
        # Store embedding separately (large data)
        if embedding_vector:
            await db.embeddings.update_one(
                {"content_id": content_id},
                {"$set": {
                    "content_id": content_id,
                    "user_id": user_id,
                    "vector": embedding_vector,
                    "updated_at": datetime.now(timezone.utc).isoformat()
                }},
                upsert=True
            )
        
        logger.info(f"AI processing completed for content: {content_id}")
        
    except Exception as e:
        logger.error(f"Error in AI processing for {content_id}: {e}")
        await db.saved_content.update_one(
            {"content_id": content_id},
            {"$set": {
                "ai_status": AIProcessingStatus.FAILED.value,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }}
        )

# ==================== AUTH HELPERS ====================
EMERGENT_AUTH_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"

async def get_current_user(request: Request) -> User:
    """Get current user from session token in cookie or Authorization header"""
    session_token = request.cookies.get("session_token")
    
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session_doc = await db.user_sessions.find_one(
        {"session_token": session_token},
        {"_id": 0}
    )
    
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    user_doc = await db.users.find_one(
        {"user_id": session_doc["user_id"]},
        {"_id": 0}
    )
    
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user_doc)

# ==================== AUTH ROUTES ====================
@api_router.post("/auth/session")
async def create_session(request: Request, response: Response):
    """Exchange session_id for session_token"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    
    async with httpx.AsyncClient() as client_http:
        auth_response = await client_http.get(
            EMERGENT_AUTH_URL,
            headers={"X-Session-ID": session_id}
        )
    
    if auth_response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session_id")
    
    auth_data = auth_response.json()
    email = auth_data["email"]
    name = auth_data["name"]
    picture = auth_data.get("picture")
    session_token = auth_data["session_token"]
    
    now = datetime.now(timezone.utc)
    
    existing_user = await db.users.find_one({"email": email}, {"_id": 0})
    
    if existing_user:
        user_id = existing_user["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {
                "name": name,
                "picture": picture,
                "updated_at": now.isoformat()
            }}
        )
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        user_doc = {
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        }
        await db.users.insert_one(user_doc)
        
        default_collection = {
            "collection_id": f"col_{uuid.uuid4().hex[:12]}",
            "user_id": user_id,
            "name": "Favoris",
            "description": "Vos contenus favoris",
            "color": "#E1306C",
            "icon": "heart",
            "content_count": 0,
            "is_default": True,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat()
        }
        await db.collections.insert_one(default_collection)
    
    expires_at = now + timedelta(days=7)
    session_doc = {
        "session_id": f"sess_{uuid.uuid4().hex[:12]}",
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": now.isoformat()
    }
    await db.user_sessions.insert_one(session_doc)
    
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        # `lax` works for first-party cookies (same domain for frontend + API).
        # Safari and Firefox block `samesite=none` cookies after a cross-site
        # top-level navigation (e.g. returning from auth.emergentagent.com),
        # which caused the "Network Error / auth failed" message on Safari.
        # `lax` is still sent on top-level GET navigations and on same-origin
        # XHR, which is exactly what we need here.
        samesite="lax",
        path="/",
        max_age=7 * 24 * 60 * 60
    )
    
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    
    return {"user": user_doc, "message": "Session created"}

@api_router.get("/auth/me", response_model=User)
async def get_me(user: User = Depends(get_current_user)):
    return user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out"}

# ==================== COLLECTION ROUTES ====================
@api_router.get("/collections", response_model=List[Collection])
async def get_collections(user: User = Depends(get_current_user)):
    collections = await db.collections.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(1000)
    return collections

@api_router.post("/collections", response_model=Collection)
async def create_collection(
    data: CreateCollectionRequest,
    user: User = Depends(get_current_user)
):
    now = datetime.now(timezone.utc)
    collection = {
        "collection_id": f"col_{uuid.uuid4().hex[:12]}",
        "user_id": user.user_id,
        "name": data.name,
        "description": data.description,
        "color": data.color,
        "icon": data.icon,
        "content_count": 0,
        "is_default": False,
        "created_at": now.isoformat(),
        "updated_at": now.isoformat()
    }
    await db.collections.insert_one(collection)
    return Collection(**{k: v for k, v in collection.items() if k != "_id"})

@api_router.get("/collections/{collection_id}", response_model=Collection)
async def get_collection(
    collection_id: str,
    user: User = Depends(get_current_user)
):
    collection = await db.collections.find_one(
        {"collection_id": collection_id, "user_id": user.user_id},
        {"_id": 0}
    )
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    return Collection(**collection)

@api_router.put("/collections/{collection_id}", response_model=Collection)
async def update_collection(
    collection_id: str,
    data: UpdateCollectionRequest,
    user: User = Depends(get_current_user)
):
    collection = await db.collections.find_one(
        {"collection_id": collection_id, "user_id": user.user_id},
        {"_id": 0}
    )
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.collections.update_one(
        {"collection_id": collection_id},
        {"$set": update_data}
    )
    
    updated = await db.collections.find_one({"collection_id": collection_id}, {"_id": 0})
    return Collection(**updated)

@api_router.delete("/collections/{collection_id}")
async def delete_collection(
    collection_id: str,
    user: User = Depends(get_current_user)
):
    collection = await db.collections.find_one(
        {"collection_id": collection_id, "user_id": user.user_id},
        {"_id": 0}
    )
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    
    if collection.get("is_default"):
        raise HTTPException(status_code=403, detail="Cannot delete default collection")
    
    await db.saved_content.update_many(
        {"user_id": user.user_id, "collection_ids": collection_id},
        {"$pull": {"collection_ids": collection_id}}
    )
    
    await db.collections.delete_one({"collection_id": collection_id})
    
    return {"message": "Collection deleted"}

# ==================== CONTENT ROUTES ====================
@api_router.get("/content")
async def get_content(
    platform: Optional[Platform] = None,
    content_type: Optional[ContentType] = None,
    collection_id: Optional[str] = None,
    search: Optional[str] = None,
    category: Optional[str] = None,
    is_favorite: Optional[bool] = None,
    skip: int = 0,
    limit: int = 50,
    user: User = Depends(get_current_user)
):
    """Get saved content with filters"""
    query = {"user_id": user.user_id}
    
    if platform:
        query["platform"] = platform.value
    if content_type:
        query["content_type"] = content_type.value
    if collection_id:
        query["collection_ids"] = collection_id
    if category:
        query["category"] = category
    if is_favorite is not None:
        query["is_favorite"] = is_favorite
    if search:
        # Search in title, description, tags, ai_tags, summary
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
            {"tags": {"$regex": search, "$options": "i"}},
            {"ai_tags": {"$regex": search, "$options": "i"}},
            {"summary": {"$regex": search, "$options": "i"}},
            {"author_name": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}}
        ]
    
    content = await db.saved_content.find(
        query,
        {"_id": 0, "raw_text": 0}  # Exclude large raw_text from list
    ).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    
    return content

@api_router.post("/content")
async def create_content(
    data: CreateContentRequest,
    background_tasks: BackgroundTasks,
    user: User = Depends(get_current_user)
):
    """Save new content and trigger AI processing in background"""
    now = datetime.now(timezone.utc)
    content_id = f"cnt_{uuid.uuid4().hex[:12]}"
    
    content = {
        "content_id": content_id,
        "user_id": user.user_id,
        "platform": data.platform.value,
        "content_type": data.content_type.value,
        "title": data.title,
        "description": data.description,
        "url": data.url,
        "thumbnail_url": data.thumbnail_url,
        "media_url": data.media_url,
        "author_name": data.author_name,
        "author_url": data.author_url,
        "tags": data.tags,
        "collection_ids": data.collection_ids,
        "is_favorite": False,
        "notes": data.notes,
        # AI fields - initialized
        "raw_text": None,
        "summary": None,
        "ai_tags": [],
        "category": None,
        "ai_status": AIProcessingStatus.PENDING.value,
        "has_embedding": False,
        "created_at": now.isoformat(),
        "updated_at": now.isoformat()
    }
    await db.saved_content.insert_one(content)
    
    # Update collection counts
    for col_id in data.collection_ids:
        await db.collections.update_one(
            {"collection_id": col_id, "user_id": user.user_id},
            {"$inc": {"content_count": 1}}
        )
    
    # Trigger AI processing in background (non-blocking)
    background_tasks.add_task(process_content_ai, content_id, user.user_id)
    
    # Return content without raw_text
    response_content = {k: v for k, v in content.items() if k not in ["_id", "raw_text"]}
    return response_content

@api_router.get("/content/{content_id}")
async def get_content_by_id(
    content_id: str,
    user: User = Depends(get_current_user)
):
    content = await db.saved_content.find_one(
        {"content_id": content_id, "user_id": user.user_id},
        {"_id": 0}
    )
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return content

@api_router.put("/content/{content_id}")
async def update_content(
    content_id: str,
    data: UpdateContentRequest,
    user: User = Depends(get_current_user)
):
    content = await db.saved_content.find_one(
        {"content_id": content_id, "user_id": user.user_id},
        {"_id": 0}
    )
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    old_collection_ids = set(content.get("collection_ids", []))
    
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.saved_content.update_one(
        {"content_id": content_id},
        {"$set": update_data}
    )
    
    if "collection_ids" in update_data:
        new_collection_ids = set(update_data["collection_ids"])
        removed = old_collection_ids - new_collection_ids
        added = new_collection_ids - old_collection_ids
        
        for col_id in removed:
            await db.collections.update_one(
                {"collection_id": col_id},
                {"$inc": {"content_count": -1}}
            )
        for col_id in added:
            await db.collections.update_one(
                {"collection_id": col_id},
                {"$inc": {"content_count": 1}}
            )
    
    updated = await db.saved_content.find_one(
        {"content_id": content_id},
        {"_id": 0, "raw_text": 0}
    )
    return updated

@api_router.delete("/content/{content_id}")
async def delete_content(
    content_id: str,
    user: User = Depends(get_current_user)
):
    content = await db.saved_content.find_one(
        {"content_id": content_id, "user_id": user.user_id},
        {"_id": 0}
    )
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    for col_id in content.get("collection_ids", []):
        await db.collections.update_one(
            {"collection_id": col_id},
            {"$inc": {"content_count": -1}}
        )
    
    await db.saved_content.delete_one({"content_id": content_id})
    # Also delete embedding
    await db.embeddings.delete_one({"content_id": content_id})
    
    return {"message": "Content deleted"}

@api_router.post("/content/{content_id}/favorite")
async def toggle_favorite(
    content_id: str,
    user: User = Depends(get_current_user)
):
    content = await db.saved_content.find_one(
        {"content_id": content_id, "user_id": user.user_id},
        {"_id": 0}
    )
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    new_favorite = not content.get("is_favorite", False)
    
    await db.saved_content.update_one(
        {"content_id": content_id},
        {"$set": {
            "is_favorite": new_favorite,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    return {"is_favorite": new_favorite}

@api_router.post("/content/{content_id}/reprocess")
async def reprocess_content(
    content_id: str,
    background_tasks: BackgroundTasks,
    user: User = Depends(get_current_user)
):
    """Manually trigger AI reprocessing for a content item"""
    content = await db.saved_content.find_one(
        {"content_id": content_id, "user_id": user.user_id},
        {"_id": 0}
    )
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    
    # Reset AI status
    await db.saved_content.update_one(
        {"content_id": content_id},
        {"$set": {"ai_status": AIProcessingStatus.PENDING.value}}
    )
    
    background_tasks.add_task(process_content_ai, content_id, user.user_id)
    
    return {"message": "AI processing triggered", "content_id": content_id}

# ==================== SEMANTIC SEARCH ROUTE ====================
@api_router.post("/search", response_model=List[SearchResult])
async def semantic_search(
    data: SemanticSearchRequest,
    user: User = Depends(get_current_user)
):
    """
    Semantic search using natural language query.
    Converts query to embedding and finds similar content.
    """
    query = data.query.strip()
    limit = min(data.limit, 50)  # Max 50 results
    
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    # Generate embedding for query
    query_embedding = await generate_embedding(query)
    
    if not query_embedding:
        # Fallback to text search if embedding fails
        logger.warning("Embedding generation failed, falling back to text search")
        content_list = await db.saved_content.find(
            {
                "user_id": user.user_id,
                "$or": [
                    {"title": {"$regex": query, "$options": "i"}},
                    {"summary": {"$regex": query, "$options": "i"}},
                    {"ai_tags": {"$regex": query, "$options": "i"}},
                    {"category": {"$regex": query, "$options": "i"}},
                    {"tags": {"$regex": query, "$options": "i"}}
                ]
            },
            {"_id": 0, "raw_text": 0}
        ).limit(limit).to_list(limit)
        
        return [
            SearchResult(
                content_id=c["content_id"],
                title=c.get("title", ""),
                summary=c.get("summary"),
                category=c.get("category"),
                tags=c.get("tags", []),
                ai_tags=c.get("ai_tags", []),
                platform=c.get("platform", "other"),
                url=c.get("url", ""),
                thumbnail_url=c.get("thumbnail_url"),
                similarity_score=0.5,  # Default score for text match
                created_at=c.get("created_at", "")
            )
            for c in content_list
        ]
    
    # Get all embeddings for user
    embeddings = await db.embeddings.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).to_list(10000)
    
    if not embeddings:
        # No embeddings yet, return empty or fallback
        return []
    
    # Calculate similarities
    results = []
    for emb in embeddings:
        similarity = cosine_similarity(query_embedding, emb.get("vector", []))
        results.append({
            "content_id": emb["content_id"],
            "similarity": similarity
        })
    
    # Sort by similarity (descending) and take top results
    results.sort(key=lambda x: x["similarity"], reverse=True)
    top_results = results[:limit]
    
    # Fetch content details for top results
    search_results = []
    for r in top_results:
        if r["similarity"] < 0.3:  # Skip very low similarity
            continue
            
        content = await db.saved_content.find_one(
            {"content_id": r["content_id"], "user_id": user.user_id},
            {"_id": 0, "raw_text": 0}
        )
        
        if content:
            search_results.append(SearchResult(
                content_id=content["content_id"],
                title=content.get("title", ""),
                summary=content.get("summary"),
                category=content.get("category"),
                tags=content.get("tags", []),
                ai_tags=content.get("ai_tags", []),
                platform=content.get("platform", "other"),
                url=content.get("url", ""),
                thumbnail_url=content.get("thumbnail_url"),
                similarity_score=round(r["similarity"], 4),
                created_at=content.get("created_at", "")
            ))
    
    return search_results

# ==================== USER STATS & EXPORT ROUTES ====================
@api_router.get("/user/stats", response_model=UserStats)
async def get_user_stats(user: User = Depends(get_current_user)):
    total_saves = await db.saved_content.count_documents({"user_id": user.user_id})
    total_collections = await db.collections.count_documents({"user_id": user.user_id})
    
    pipeline_platform = [
        {"$match": {"user_id": user.user_id}},
        {"$group": {"_id": "$platform", "count": {"$sum": 1}}}
    ]
    platform_results = await db.saved_content.aggregate(pipeline_platform).to_list(100)
    saves_by_platform = {r["_id"]: r["count"] for r in platform_results}
    
    pipeline_type = [
        {"$match": {"user_id": user.user_id}},
        {"$group": {"_id": "$content_type", "count": {"$sum": 1}}}
    ]
    type_results = await db.saved_content.aggregate(pipeline_type).to_list(100)
    saves_by_type = {r["_id"]: r["count"] for r in type_results}
    
    week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    recent_activity = await db.saved_content.count_documents({
        "user_id": user.user_id,
        "created_at": {"$gte": week_ago}
    })
    
    return UserStats(
        total_saves=total_saves,
        total_collections=total_collections,
        saves_by_platform=saves_by_platform,
        saves_by_type=saves_by_type,
        recent_activity=recent_activity
    )

@api_router.get("/user/export")
async def export_user_data(user: User = Depends(get_current_user)):
    """Export all user data as JSON"""
    # Get all content
    content = await db.saved_content.find(
        {"user_id": user.user_id},
        {"_id": 0, "raw_text": 0}  # Exclude large fields
    ).to_list(10000)
    
    # Get all collections
    collections = await db.collections.find(
        {"user_id": user.user_id},
        {"_id": 0}
    ).to_list(1000)
    
    # Get user info
    user_doc = await db.users.find_one(
        {"user_id": user.user_id},
        {"_id": 0}
    )
    
    export_data = {
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "user": user_doc,
        "collections": collections,
        "content": content,
        "total_items": len(content)
    }
    
    return export_data

# ==================== CATEGORIES ROUTE ====================
@api_router.get("/content/memories/on-this-day")
async def get_on_this_day(user: User = Depends(get_current_user)):
    """Return saved content from the same calendar day in past months/years.

    Groups results by relative period: 1 month, 3 months, 6 months, 1 year, 2 years, 3+ years.
    Each bucket contains the matching items (today's day + month, but in a past period).
    """
    today = datetime.now(timezone.utc)

    # Build date windows: same calendar day (DD) within month windows that fall on
    # 1mo, 3mo, 6mo, 1y, 2y, 3y, 4y, 5y ago. Use a +/- 1 day tolerance to handle
    # month-end edge cases.
    def shift(months: int):
        # Compute target year/month
        total = (today.year * 12 + (today.month - 1)) - months
        y, m = divmod(total, 12)
        return y, m + 1

    buckets_def = [
        {"key": "1_month", "label_fr": "Il y a 1 mois", "label_en": "1 month ago", "months": 1},
        {"key": "3_months", "label_fr": "Il y a 3 mois", "label_en": "3 months ago", "months": 3},
        {"key": "6_months", "label_fr": "Il y a 6 mois", "label_en": "6 months ago", "months": 6},
        {"key": "1_year", "label_fr": "Il y a 1 an", "label_en": "1 year ago", "months": 12},
        {"key": "2_years", "label_fr": "Il y a 2 ans", "label_en": "2 years ago", "months": 24},
        {"key": "3_years", "label_fr": "Il y a 3 ans", "label_en": "3 years ago", "months": 36},
        {"key": "5_years", "label_fr": "Il y a 5 ans", "label_en": "5 years ago", "months": 60},
    ]

    buckets = []
    for b in buckets_def:
        try:
            y, m = shift(b["months"])
            target = today.replace(year=y, month=m)
        except ValueError:
            # Day doesn't exist in target month (e.g. Feb 30) -> use last valid day
            from calendar import monthrange
            y, m = shift(b["months"])
            last_day = monthrange(y, m)[1]
            day = min(today.day, last_day)
            target = today.replace(year=y, month=m, day=day)

        # +/- 1 day tolerance
        start = (target - timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
        end = (target + timedelta(days=1)).replace(hour=23, minute=59, second=59, microsecond=999999)

        items = await db.saved_content.find(
            {
                "user_id": user.user_id,
                "created_at": {"$gte": start.isoformat(), "$lte": end.isoformat()},
            },
            {"_id": 0, "raw_text": 0},
        ).sort("created_at", -1).to_list(50)

        if items:
            buckets.append({
                "key": b["key"],
                "label_fr": b["label_fr"],
                "label_en": b["label_en"],
                "months_ago": b["months"],
                "target_date": target.date().isoformat(),
                "count": len(items),
                "items": items,
            })

    return {
        "today": today.date().isoformat(),
        "buckets": buckets,
        "total_memories": sum(b["count"] for b in buckets),
    }


@api_router.get("/categories")
async def get_categories(user: User = Depends(get_current_user)):
    """Get all unique categories for user's content"""
    pipeline = [
        {"$match": {"user_id": user.user_id, "category": {"$ne": None}}},
        {"$group": {"_id": "$category", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    results = await db.saved_content.aggregate(pipeline).to_list(100)
    return [{"category": r["_id"], "count": r["count"]} for r in results]

# ==================== HEALTH CHECK ====================
@api_router.get("/")
async def root():
    return {"message": "SaveStack AI API is running", "version": "2.0.0", "ai_enabled": bool(EMERGENT_LLM_KEY)}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "ai_enabled": bool(EMERGENT_LLM_KEY)}

# Include router and middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    # CORS spec forbids `*` with credentials. Use a regex so Starlette echoes
    # the request origin in `Access-Control-Allow-Origin`, which is required
    # for the browser to accept Set-Cookie on cross-origin auth requests.
    allow_origin_regex=".*",
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
