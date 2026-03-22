# database.py
import sqlite3

DB_NAME = "nutrilens.db"

def get_connection():
    conn = sqlite3.connect(DB_NAME, check_same_thread=False)
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def create_user_table():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS user_profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT,
        age INTEGER,
        gender TEXT,
        health_issues TEXT,
        primary_goal TEXT
    )
    """)
    
    try:
        cursor.execute("ALTER TABLE user_profile ADD COLUMN user_id INTEGER")
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE user_profile ADD COLUMN height REAL")
    except sqlite3.OperationalError:
        pass

    try:
        cursor.execute("ALTER TABLE user_profile ADD COLUMN weight REAL")
    except sqlite3.OperationalError:
        pass

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        mobile TEXT,
        email TEXT UNIQUE,
        password TEXT
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS meal_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        time TEXT,
        meal_type TEXT,
        ingredients TEXT,
        nutrients TEXT,
        health_analysis TEXT,
        recommendations TEXT,
        ai_message TEXT
    )
    """)

    conn.commit()
    conn.close()
