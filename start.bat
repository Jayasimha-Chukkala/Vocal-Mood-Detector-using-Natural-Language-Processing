@echo off
echo ==============================================
echo   Starting Multimodal Vocal Mood Detector...
echo ==============================================

:: Start the Python FastAPI backend in a new window
echo [1/2] Booting FastAPI Backend AI Engine...
start cmd /k "title Vocal Mood API && cd backend && python -m uvicorn main:app --reload --port 8000"

:: Start the React UI in a new window
echo [2/2] Booting React Deep Space Interface...
start cmd /k "title Vocal Mood UI && cd frontend && npm run dev"

echo.
echo All microservices are online!
echo You can test the app at: http://localhost:5173/
echo.
pause
