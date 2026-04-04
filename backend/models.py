"""
SQLite database models and helpers.
"""
import sqlite3
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "calls.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.executescript("""
        CREATE TABLE IF NOT EXISTS calls (
            id          TEXT PRIMARY KEY,
            agent       TEXT DEFAULT 'Agent',
            customer    TEXT DEFAULT 'Customer',
            language    TEXT DEFAULT 'Unknown',
            duration    TEXT DEFAULT '0:00',
            date        TEXT,
            status      TEXT DEFAULT 'review',
            sop_score   INTEGER DEFAULT 0,
            greeting    INTEGER DEFAULT 0,
            id_verify   INTEGER DEFAULT 0,
            compliance  INTEGER DEFAULT 0,
            transcript  TEXT DEFAULT '',
            summary     TEXT DEFAULT '',
            payment_type TEXT DEFAULT 'Unknown',
            rejection_reason TEXT DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS payment_stats (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            call_id     TEXT,
            emi         INTEGER DEFAULT 0,
            full_pay    INTEGER DEFAULT 0,
            partial     INTEGER DEFAULT 0,
            down_pay    INTEGER DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS vectors (
            call_id     TEXT PRIMARY KEY,
            embedding   BLOB
        );
        CREATE TABLE IF NOT EXISTS vectors (
            call_id     TEXT PRIMARY KEY,
            embedding   BLOB
        );
    """)
    conn.commit()
    conn.close()


def insert_call(data: dict):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT OR REPLACE INTO calls
        (id, agent, customer, language, duration, date, status,
         sop_score, greeting, id_verify, compliance, transcript, summary,
         payment_type, rejection_reason)
        VALUES
        (:id, :agent, :customer, :language, :duration, :date, :status,
         :sop_score, :greeting, :id_verify, :compliance, :transcript, :summary,
         :payment_type, :rejection_reason)
    """, data)
    conn.commit()
    conn.close()


def get_all_calls():
    conn = get_db()
    rows = conn.execute("SELECT * FROM calls ORDER BY date DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_stats():
    conn = get_db()
    total = conn.execute("SELECT COUNT(*) as c FROM calls").fetchone()["c"]
    compliant = conn.execute("SELECT COUNT(*) as c FROM calls WHERE status='compliant'").fetchone()["c"]
    flagged = conn.execute("SELECT COUNT(*) as c FROM calls WHERE status='flagged'").fetchone()["c"]
    avg_sop = conn.execute("SELECT AVG(sop_score) as a FROM calls").fetchone()["a"] or 0
    lang_rows = conn.execute(
        "SELECT language, COUNT(*) as c FROM calls GROUP BY language"
    ).fetchall()
    conn.close()

    return {
        "total_calls": total,
        "compliant_calls": compliant,
        "flagged_calls": flagged,
        "sop_compliance_pct": round(avg_sop, 1),
        "languages": {r["language"]: r["c"] for r in lang_rows},
    }


def get_payment_aggregates():
    conn = get_db()
    rows = conn.execute("""
        SELECT payment_type, COUNT(*) as cnt
        FROM calls
        GROUP BY payment_type
    """).fetchall()
    conn.close()
    mapping = {"EMI": 0, "FULL_PAYMENT": 0, "PARTIAL_PAYMENT": 0, "DOWN_PAYMENT": 0, "NONE": 0}
    for r in rows:
        # Match case-insensitively or exactly as per stored enums
        p_type = r["payment_type"]
        if p_type in mapping:
            mapping[p_type] = r["cnt"]
        else:
            mapping["NONE"] += r["cnt"]
    return mapping

def insert_vector(call_id: str, embedding_blob: bytes):
    conn = get_db()
    conn.execute("INSERT OR REPLACE INTO vectors (call_id, embedding) VALUES (?, ?)", (call_id, embedding_blob))
    conn.commit()
    conn.close()

def get_all_vectors():
    conn = get_db()
    rows = conn.execute("SELECT call_id, embedding FROM vectors").fetchall()
    conn.close()
    return [(r["call_id"], r["embedding"]) for r in rows]

def get_call_by_id(call_id: str):
    conn = get_db()
    row = conn.execute("SELECT * FROM calls WHERE id = ?", (call_id,)).fetchone()
    conn.close()
    return dict(row) if row else None
