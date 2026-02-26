# database.py
import sqlite3

DB_NAME = "nutrilens.db"

def get_connection():
    return sqlite3.connect(DB_NAME)

def create_user_table():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        age INTEGER,
        gender TEXT,
        health_issues TEXT,
        primary_goal TEXT
    )
    """)

    conn.commit()
    conn.close()
