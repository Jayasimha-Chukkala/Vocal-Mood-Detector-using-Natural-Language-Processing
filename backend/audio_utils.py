import librosa
import numpy as np

def preprocess_audio(file_path):
    """
    Automated Audio Pipeline:
    1. Loads the audio.
    2. Performs VAD to strip long silences (Placeholder structural logic).
    3. Normalizes loudness.
    4. Segments into 3-second chunks.
    """
    print(f"[Acoustic Path] Loading {file_path}")
    
    # Load audio using librosa (forces sample rate 16000 for standard STT/CNN use)
    y, sr = librosa.load(file_path, sr=16000)
    
    # Loudness Normalization
    print("[Acoustic Path] Normalizing audio...")
    y_normalized = librosa.util.normalize(y)
    
    # Simple Voice Activity Detection (VAD) Concept using energy thresholding
    # (In a strict production env you use WebRTCVAD on raw PCM frames, but librosa RMS is great for our simplified pipeline)
    rms = librosa.feature.rms(y=y_normalized)[0]
    mean_rms = np.mean(rms)
    
    # Keep frames above 0.5 * mean_rms
    # This is a high-level representation of trimming silences
    y_trimmed, index = librosa.effects.trim(y_normalized, top_db=20)
    
    print(f"[Acoustic Path] Audio trimmed from {len(y)} to {len(y_trimmed)} samples.")
    
    # Segment into 3-second chunks for exact emotion timeline mapping
    chunk_samples = 3 * sr
    segments = []
    
    for i in range(0, len(y_trimmed), chunk_samples):
        segment = y_trimmed[i:i + chunk_samples]
        if len(segment) >= sr:  # Only keep segments longer than 1 sec to avoid noise artifacts
            # Extract mel spectrogram for each chunk
            melspec = librosa.feature.melspectrogram(y=segment, sr=sr, n_mels=128)
            melspec_db = librosa.power_to_db(melspec, ref=np.max)
            segments.append(melspec_db)
            
    print(f"[Acoustic Path] Generated {len(segments)} segments for ML processing.")
    
    return segments, y_trimmed, sr
