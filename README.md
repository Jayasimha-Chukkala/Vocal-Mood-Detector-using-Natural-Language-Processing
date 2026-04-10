# Multimodal Vocal Mood Detector

A full-stack AI application that detects human emotion by simultaneously analyzing both the **acoustic properties** (Pitch/Intensity) and **linguistic context** (Speech-to-Text transcript sentiment) of an audio file. Mismatches heavily influence the detected emotion while everything is visualized real-time through a 3D interface.

---

## 🛠️ Tech Stack & Technologies Used

**Frontend Interface (Deep Space UI)**
- **React.js (Vite)**: Lightning-fast frontend tooling.
- **Tailwind CSS**: For glassmorphism UI and responsive styling.
- **Framer Motion**: For fluid layout and stagger animations.
- **Three.js (@react-three/fiber & drei)**: For rendering the interactive, 3D `MoodSphere` responding to emotion states.

**Backend AI Engine**
- **FastAPI**: Asynchronous, high-performance API routing.
- **SQLite3**: Lightweight local database for saving analysis history.
- **Librosa**: Powerful acoustic analysis used for calculating signal Intensity (RMS) and fundamental Frequencies (Pitch).
- **Hugging Face Transformers**:
  - `openai/whisper-tiny` for accurate Speech-to-Text transcription.
  - `distilbert-base-uncased-finetuned` for Natural Language Processing & text sentiment analysis.
- **PyTorch**: Deep learning backend executing the Transformer models.

---

## 📂 Folder Structure

```text
Vocal Project/
├── backend/                  # AI Machine Learning API 
│   ├── uploads/              # Transiently stores uploaded audio files
│   ├── db_config.py          # SQLite Initialization & Queries
│   ├── main.py               # FastAPI Endpoints and CORS setup
│   ├── model_fusion.py       # Core logic connecting Librosa and Transformers
│   ├── requirements.txt      # Python backend dependencies
│   └── vocal_mood.db         # Auto-generated database file 
├── frontend/                 # Interactive React UI
│   ├── src/
│   │   ├── animations/       # Three.js Components (MoodSphere.jsx)
│   │   ├── components/       # UI Logic (UploadZone, ResultsStagger)
│   │   ├── App.jsx           # Main View Controller
│   │   └── index.css         # Tailwind tokens & custom scrollbars
│   ├── package.json          # Node.js dependencies
│   ├── tailwind.config.js    # Custom Space themes & colors
│   └── vite.config.js        # Bundler configuration
├── start.bat                 # 1-Click Startup Script (Windows)
└── README.md                 # Project Documentation
```

---

## 🚀 How It Runs & Internal Architecture

When a `.wav`, `.mp3`, or `.m4a` audio file is uploaded via the frontend, the backend triggers a pipeline known as **Late Fusion Strategy**:

1. **Acoustic Path (Librosa):** Processes the raw audio wave to discover the fundamental frequency (`librosa.piptrack`) and energy intensity (`librosa.feature.rms`). It gauges arousal levels (e.g., Loud Energy + High Pitch = Angry/Happy threshold). 
2. **Linguistic Path (Whisper + DistilBERT):** Whisper transcribes the spoken words into a text string, which DistilBERT then evaluates for Positive/Negative contextual sentiment. 
3. **Fusion Engine:** Combines both scores to output an incredibly accurate unified classification (`Happy`, `Sad`, `Angry`, or `Neutral`) along with a confidence percentage.
4. **UI Response:** The Frontend receives the JSON payload over a REST API and dynamically morphs the 3D Sphere's velocity, scale, and color based on the emotion.

---

## 💻 Commands to Run

There are two primary ways to run this project:

### Option 1: The Automated Way (Windows Only)
In the root directory, simply execute the startup batch script. This will boot both the backend and frontend microservices in separate terminal windows.
```bash
.\start.bat
```

### Option 2: The Manual Way (Cross Platform)
If you prefer fine-grained control, you will need two terminal windows:

**Terminal 1 (Backend - API & AI Models)**
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```
*(The backend runs on `http://localhost:8000`)*

**Terminal 2 (Frontend - UI)**
```bash
cd frontend
npm run dev
```
*(The frontend runs on `http://localhost:5173`)*

---

## ⚙️ Initial Setup & Requirements
*If you are cloning this repository for the first time, you must install the dependencies.*

**Backend Requirements:**
```bash
cd backend
pip install -r requirements.txt
pip install tf-keras  # Required backwards compatibility for DistilBERT
```
*Note: The first time you upload audio, the background engine will download the Whisper and BERT models locally (approx 400MB).*

**Frontend Requirements:**
```bash
cd frontend
npm install
```
