import httpx
import time
import os
from dotenv import load_dotenv

load_dotenv()

# Load API key from environment
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
print(ASSEMBLYAI_API_KEY)
if not ASSEMBLYAI_API_KEY:
    raise EnvironmentError("Missing ASSEMBLYAI_API_KEY in environment variables")

# Headers used for transcription requests
HEADERS = {
    "authorization": ASSEMBLYAI_API_KEY,
    "content-type": "application/json"
}

# Endpoints
UPLOAD_ENDPOINT = "https://api.assemblyai.com/v2/upload"
TRANSCRIPT_ENDPOINT = "https://api.assemblyai.com/v2/transcript"


def upload_file(filepath: str) -> str:
    with open(filepath, 'rb') as f:
        response = httpx.post(
            UPLOAD_ENDPOINT,
            headers={"authorization": ASSEMBLYAI_API_KEY},
            content=f  # use `content=` not `files=`
        )
    response.raise_for_status()
    return response.json()['upload_url']


def transcribe_audio(upload_url: str) -> str:
    # Step 1: Request transcription
    response = httpx.post(
        TRANSCRIPT_ENDPOINT,
        json={"audio_url": upload_url},
        headers=HEADERS
    )
    response.raise_for_status()
    transcript_id = response.json()['id']

    # Step 2: Poll for completion
    while True:
        polling_response = httpx.get(f"{TRANSCRIPT_ENDPOINT}/{transcript_id}", headers=HEADERS)
        polling_response.raise_for_status()
        status = polling_response.json()['status']

        if status == 'completed':
            return polling_response.json()['text']
        elif status == 'error':
            raise RuntimeError("Transcription failed:", polling_response.json())

        time.sleep(3)  # Wait before polling again
