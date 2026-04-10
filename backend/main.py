from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import uuid
import asyncio

# Local DB routines
from db_config import save_analysis, get_analysis

app = FastAPI(title="Vocal Mood Detector API")

# Allow CORS for React frontend (default Vite port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"status": "Backend is running! Ready to process audio."}

@app.post("/upload_audio")
def upload_audio(file: UploadFile = File(...)):
    if not file.filename.endswith(('.wav', '.mp3', '.m4a')):
        raise HTTPException(status_code=400, detail="Only audio files (.wav, .mp3, .m4a) are allowed.")
    
    # Generate unique filename to avoid collisions
    file_idx = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    safe_filename = f"{file_idx}{ext}"
    filepath = os.path.join(UPLOAD_DIR, safe_filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # -----------------------------
    # ML PIPELINE INTEGRATION
    # -----------------------------
    try:
        from model_fusion import fusion_engine
        
        # Run the multimodal fusion (Whisper -> BERT + CNN dummy model)
        result = fusion_engine(filepath)
    except ImportError as e:
        print(f"[Warning] ML Dependencies not fully installed ({e}). Using mock data.")
        result = {
            "primary_emotion": "Angular/Angry",
            "confidence": 0.92,
            "transcript": "Hardware inference skipped. This is a placeholder awaiting the full pip install.",
            "timeline": [
                {"time": 0, "emotion": "Neutral"},
                {"time": 3, "emotion": "Angry"},
                {"time": 6, "emotion": "Angry"}
            ]
        }
    
    dummy_emotion = result["primary_emotion"]
    dummy_confidence = result["confidence"]
    dummy_transcript = result["transcript"]
    dummy_timeline = result["timeline"]

    analysis_id = save_analysis(
        filename=file.filename,
        filepath=filepath,
        primary_emotion=dummy_emotion,
        confidence_score=dummy_confidence,
        transcript=dummy_transcript,
        emotion_timeline=dummy_timeline
    )
    
    return {"status": "Processed", "analysis_id": analysis_id, "file_saved_as": safe_filename}

@app.get("/analysis/{analysis_id}")
def get_audio_analysis(analysis_id: int):
    data = get_analysis(analysis_id)
    if not data:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
