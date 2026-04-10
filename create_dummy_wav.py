import wave
import struct
import math
import os

filepath = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_sample.wav")

# Generate a 1-second sine wave at 440 Hz
sample_rate = 16000
duration = 1.0
frequency = 440.0
num_samples = int(sample_rate * duration)

with wave.open(filepath, 'w') as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)
    
    for i in range(num_samples):
        value = int(32767.0 * math.sin(2.0 * math.pi * frequency * i / sample_rate))
        data = struct.pack('<h', value)
        wav_file.writeframesraw(data)

print(f"Created dummy audio for testing: {filepath}")
