import sqlite3
import os
import json

DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, 'vocal_mood.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Create an analysis table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analysis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT,
            filepath TEXT,
            primary_emotion TEXT,
            confidence_score REAL,
            transcript TEXT,
            emotion_timeline TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def save_analysis(filename, filepath, primary_emotion, confidence_score, transcript, emotion_timeline):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO analysis (filename, filepath, primary_emotion, confidence_score, transcript, emotion_timeline)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (filename, filepath, primary_emotion, confidence_score, transcript, json.dumps(emotion_timeline)))
    last_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return last_id

def get_analysis(analysis_id):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM analysis WHERE id = ?', (analysis_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return {
            "id": row[0],
            "filename": row[1],
            "filepath": row[2],
            "primary_emotion": row[3],
            "confidence_score": row[4],
            "transcript": row[5],
            "emotion_timeline": json.loads(row[6]),
            "timestamp": row[7]
        }
    return None

# Initialize database on module load
init_db()
