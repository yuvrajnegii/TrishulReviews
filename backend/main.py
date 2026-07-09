import os
from fastapi import FastAPI, HTTPException, Header, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, EmailStr
import psycopg2
import psycopg2.extras
import json
import bcrypt
import jwt
import datetime
from dotenv import load_dotenv
from groq import Groq
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import httpx
from fastapi.responses import RedirectResponse

load_dotenv()

app = FastAPI()

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── CONFIG ─────────────────────────────────────────────────────────────────
# All secrets are read from environment variables (see .env.example).
# Copy .env.example to .env and fill in your real values — .env is gitignored.
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

JWT_SECRET = os.getenv("JWT_SECRET", "guestlens-dev-secret-change-me")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_HOURS = 24 * 7  # tokens are valid for 7 days

GOOGLE_CLIENT_ID     = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI  = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/auth/google/callback")
FRONTEND_URL         = os.getenv("FRONTEND_URL", "http://localhost:5173")

DB_CONFIG = {
    "host":     os.getenv("DB_HOST", "localhost"),
    "port":     int(os.getenv("DB_PORT", "5432")),
    "database": os.getenv("DB_NAME", "guestlens"),
    "user":     os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", ""),
}

client = Groq(api_key=GROQ_API_KEY)

# ── DB Helper ──────────────────────────────────────────────────────────────
def get_db():
    return psycopg2.connect(**DB_CONFIG)

# ── Groq Helper ─────────────────────────────────────────────────────────────
def call_groq(system_prompt, user_prompt):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_prompt},
        ]
    )
    return response.choices[0].message.content

# ── Auth Helpers ───────────────────────────────────────────────────────────
def hash_password(plain_password: str) -> str:
    return bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), password_hash.encode("utf-8"))


def create_token(user_id: int, email: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=JWT_EXPIRY_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def get_current_user(authorization: str = Header(default=None)):
    """Reads the 'Authorization: Bearer <token>' header and returns the user payload.
    Raises 401 if the token is missing, invalid, or expired."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired, please log in again")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ── Custom Exceptions ──────────────────────────────────────────────────────
class DatabaseError(Exception):
    """Raised when a database operation fails unexpectedly."""
    def __init__(self, message: str = "A database error occurred"):
        self.message = message


class NotFoundError(Exception):
    """Raised when a requested resource does not exist."""
    def __init__(self, message: str = "Resource not found"):
        self.message = message


# ── Centralized Exception Handlers ────────────────────────────────────────
# These replace scattered try/except blocks in each route: any route can
# simply `raise NotFoundError(...)` / `raise DatabaseError(...)` and the
# response shape stays consistent across the whole API.

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"error": "Validation failed", "details": exc.errors()},
    )


@app.exception_handler(NotFoundError)
async def not_found_exception_handler(request: Request, exc: NotFoundError):
    return JSONResponse(status_code=404, content={"error": exc.message})


@app.exception_handler(DatabaseError)
async def database_exception_handler(request: Request, exc: DatabaseError):
    return JSONResponse(status_code=500, content={"error": exc.message})


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(status_code=exc.status_code, content={"error": exc.detail})


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"error": "Internal server error"})


# ── Schemas ────────────────────────────────────────────────────────────────
class ClassifyRequest(BaseModel):
    reviews: list[str]


class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UpdateReviewRequest(BaseModel):
    sentiment: str | None = None
    theme: str | None = None
    response: str | None = None

# ── Routes ─────────────────────────────────────────────────────────────────

@app.post("/signup", status_code=201)
@limiter.limit("5/minute")
def signup(request: Request, body: SignupRequest):
    name = body.name.strip()
    email = body.email.lower().strip()
    password = body.password

    if len(name) < 2:
        raise HTTPException(status_code=400, detail="Please enter your full name")
    if len(password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    try:
        conn = get_db()
        cur = conn.cursor()

        cur.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            raise HTTPException(status_code=409, detail="An account with this email already exists")

        password_hash = hash_password(password)
        cur.execute(
            "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s) RETURNING id",
            (name, email, password_hash),
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()

        token = create_token(user_id, email)
        return {"token": token, "user": {"id": user_id, "name": name, "email": email}}

    except HTTPException:
        raise
    except psycopg2.Error:
        raise DatabaseError("Could not create account due to a database error")


@app.post("/login")
@limiter.limit("5/minute")
def login(request: Request, body: LoginRequest):
    email = body.email.lower().strip()
    password = body.password

    try:
        conn = get_db()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("SELECT id, name, email, password_hash FROM users WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.close()
        conn.close()

        if not user or not verify_password(password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_token(user["id"], user["email"])
        return {"token": token, "user": {"id": user["id"], "name": user["name"], "email": user["email"]}}

    except HTTPException:
        raise
    except psycopg2.Error:
        raise DatabaseError("Could not log in due to a database error")


@app.get("/me")
def me(current_user: dict = Depends(get_current_user)):
    return current_user


@app.post("/classify", status_code=201)
def classify(body: ClassifyRequest):
    reviews = body.reviews
    if not reviews:
        raise HTTPException(status_code=400, detail="No reviews provided")

    numbered = "\n".join(f"{i+1}. {r}" for i, r in enumerate(reviews))

    system_prompt = """You are an expert hospitality review analyst for Trishul Eco-Homestays in Uttarakhand, India.
Classify each numbered guest review and return ONLY a valid JSON array with no markdown, no explanation, no preamble.
Each element must have exactly these keys:
- "sentiment": one of "positive", "neutral", "negative"
- "theme": the single most relevant tag from: food, host, location, cleanliness, value, experience
- "response": a warm, professional one-line management response (max 18 words)"""

    user_prompt = f"Classify these {len(reviews)} reviews:\n{numbered}\n\nReturn only the JSON array."

    try:
        raw = call_groq(system_prompt, user_prompt)
    except Exception:
        raise HTTPException(status_code=502, detail="The AI classification service is unavailable")

    clean = raw.replace("```json", "").replace("```", "").strip()
    try:
        result = json.loads(clean)
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="The AI service returned an unexpected response")

    try:
        conn = get_db()
        cur = conn.cursor()
        for i, review_text in enumerate(reviews):
            item = result[i] if i < len(result) else {
                "sentiment": "neutral",
                "theme":     "experience",
                "response":  "Thank you for your feedback."
            }
            cur.execute(
                """INSERT INTO reviews (review_text, sentiment, theme, response)
                   VALUES (%s, %s, %s, %s)""",
                (review_text, item["sentiment"], item["theme"], item["response"])
            )
        conn.commit()
        cur.close()
        conn.close()
    except psycopg2.Error:
        raise DatabaseError("Could not save classified reviews to the database")

    return {"classifications": result}


@app.get("/history")
def history():
    try:
        conn = get_db()
        cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("""
            SELECT id, review_text, sentiment, theme, response,
                   TO_CHAR(created_at, 'DD Mon YYYY, HH24:MI') AS created_at
            FROM reviews
            ORDER BY created_at DESC
            LIMIT 100
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return {"history": [dict(r) for r in rows]}
    except psycopg2.Error:
        raise DatabaseError("Could not fetch review history")


@app.get("/history/search")
def search_history(sentiment: str | None = None, theme: str | None = None, q: str | None = None):
    """Filter reviews by sentiment, theme, and/or a keyword in the review text.
    All parameters are optional and combine with AND. Example:
    /history/search?sentiment=negative&theme=cleanliness&q=mattress"""
    conditions = []
    params = []

    if sentiment:
        conditions.append("sentiment = %s")
        params.append(sentiment)
    if theme:
        conditions.append("theme = %s")
        params.append(theme)
    if q:
        conditions.append("review_text ILIKE %s")
        params.append(f"%{q}%")

    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""

    try:
        conn = get_db()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"""
            SELECT id, review_text, sentiment, theme, response,
                   TO_CHAR(created_at, 'DD Mon YYYY, HH24:MI') AS created_at
            FROM reviews
            {where_clause}
            ORDER BY created_at DESC
            LIMIT 100
        """, params)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return {"history": [dict(r) for r in rows], "count": len(rows)}
    except psycopg2.Error:
        raise DatabaseError("Could not search review history")


@app.get("/history/{review_id}")
def get_review(review_id: int):
    try:
        conn = get_db()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("""
            SELECT id, review_text, sentiment, theme, response,
                   TO_CHAR(created_at, 'DD Mon YYYY, HH24:MI') AS created_at
            FROM reviews
            WHERE id = %s
        """, (review_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()
    except psycopg2.Error:
        raise DatabaseError("Could not fetch the review")

    if not row:
        raise NotFoundError(f"No review found with id {review_id}")
    return dict(row)


@app.patch("/history/{review_id}")
def update_review(review_id: int, body: UpdateReviewRequest):
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    set_clause = ", ".join(f"{field} = %s" for field in updates)
    params = list(updates.values()) + [review_id]

    try:
        conn = get_db()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"""UPDATE reviews SET {set_clause} WHERE id = %s
                RETURNING id, review_text, sentiment, theme, response,
                          TO_CHAR(created_at, 'DD Mon YYYY, HH24:MI') AS created_at""",
            params,
        )
        updated = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
    except psycopg2.Error:
        raise DatabaseError("Could not update the review")

    if not updated:
        raise NotFoundError(f"No review found with id {review_id}")
    return dict(updated)


@app.delete("/history/{review_id}", status_code=200)
def delete_review(review_id: int):
    try:
        conn = get_db()
        cur  = conn.cursor()
        cur.execute("DELETE FROM reviews WHERE id = %s RETURNING id", (review_id,))
        deleted = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
    except psycopg2.Error:
        raise DatabaseError("Could not delete the review")

    if not deleted:
        raise NotFoundError(f"No review found with id {review_id}")
    return {"deleted": review_id}


@app.get("/auth/google")
def google_login():
    """Redirect the user to Google's OAuth consent screen."""
    params = {
        "client_id":     GOOGLE_CLIENT_ID,
        "redirect_uri":  GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope":         "openid email profile",
        "access_type":   "offline",
    }
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{query}")


@app.get("/auth/google/callback")
async def google_callback(code: str):
    """Google redirects here after the user consents.
    Exchange the code for tokens, fetch the user's profile,
    create or find the user in the DB, and redirect to the frontend with a JWT."""

    # 1. Exchange code for access token
    async with httpx.AsyncClient() as client:
        token_res = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code":          code,
                "client_id":     GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri":  GOOGLE_REDIRECT_URI,
                "grant_type":    "authorization_code",
            },
        )
        token_data = token_res.json()

    access_token = token_data.get("access_token")
    if not access_token:
        raise HTTPException(status_code=400, detail="Failed to get access token from Google")

    # 2. Fetch user profile from Google
    async with httpx.AsyncClient() as client:
        profile_res = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        profile = profile_res.json()

    email = profile.get("email", "").lower().strip()
    name  = profile.get("name", email.split("@")[0])

    if not email:
        raise HTTPException(status_code=400, detail="Could not retrieve email from Google")

    # 3. Find or create the user in the database
    try:
        conn = get_db()
        cur  = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        cur.execute("SELECT id, name, email FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

        if not user:
            cur.execute(
                "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s) RETURNING id, name, email",
                (name, email, "oauth_google"),
            )
            user = cur.fetchone()
            conn.commit()

        cur.close()
        conn.close()
    except psycopg2.Error:
        raise DatabaseError("Could not complete Google login due to a database error")

    # 4. Create a JWT and redirect to the frontend
    token = create_token(user["id"], user["email"])
    return RedirectResponse(
        f"{FRONTEND_URL}/oauth/callback?token={token}&name={user['name']}&email={user['email']}&id={user['id']}"
    )


@app.get("/health")
def health():
    return {"status": "ok", "message": "GuestLens backend is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
