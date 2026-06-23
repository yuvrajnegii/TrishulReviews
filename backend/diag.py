"""
Quick diagnostic — run this on YOUR machine (where Postgres/Groq are reachable)
to figure out exactly which layer is failing: imports, Groq, or Postgres.
"""
import sys

print("1. Python:", sys.version)

try:
    from groq import Groq
    print("2. groq import: OK")
except Exception as e:
    print("2. groq import: FAILED ->", e)
    sys.exit(1)

GROQ_API_KEY = "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"
try:
    client = Groq(api_key=GROQ_API_KEY)
    r = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": "Say hello in one word."}]
    )
    print("3. Groq call: OK ->", r.choices[0].message.content)
except Exception as e:
    print("3. Groq call: FAILED ->", type(e).__name__, "-", str(e))

try:
    import psycopg2
    conn = psycopg2.connect(host="localhost", port=5432, database="guestlens", user="postgres", password="yuvraj")
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM reviews")
    print("4. Postgres connection + table: OK, row count =", cur.fetchone()[0])
    conn.close()
except Exception as e:
    print("4. Postgres: FAILED ->", type(e).__name__, "-", str(e))
