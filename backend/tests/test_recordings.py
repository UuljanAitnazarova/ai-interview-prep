import pytest
import os
from unittest.mock import patch, MagicMock
from fastapi import UploadFile
from app.models.models import Recording, Question
from datetime import datetime, timezone

@pytest.fixture(autouse=True)
def mock_env_vars():
    with patch.dict(os.environ, {"ASSEMBLYAI_API_KEY": "test_api_key"}):
        yield

@pytest.fixture
def test_question(db):
    question = Question(text="Test question", category="technical")
    db.add(question)
    db.commit()
    db.refresh(question)
    return question

def test_get_recordings_empty(client):
    response = client.get("/recordings/")
    assert response.status_code == 200
    assert response.json() == []

@patch('httpx.post')
@patch('httpx.get')
def test_create_recording(mock_get, mock_post, client, db, test_question, tmp_path):
    question_id = test_question.id
    

    mock_upload_response = MagicMock()
    mock_upload_response.json.return_value = {"upload_url": "https://example.com/upload"}
    mock_upload_response.raise_for_status = MagicMock()
    
    mock_transcript_response = MagicMock()
    mock_transcript_response.json.return_value = {"id": "test_transcript_id"}
    mock_transcript_response.raise_for_status = MagicMock()
    
    mock_polling_response = MagicMock()
    mock_polling_response.json.return_value = {
        "status": "completed",
        "text": "Test transcript"
    }
    mock_polling_response.raise_for_status = MagicMock()
    
    mock_post.side_effect = [mock_upload_response, mock_transcript_response]
    mock_get.return_value = mock_polling_response

    audio_content = b"fake audio content"
    audio_file = tmp_path / "test_audio.wav"
    audio_file.write_bytes(audio_content)
    
    files = {
        'file': ('test_audio.wav', open(audio_file, 'rb'), 'audio/wav')
    }
    data = {
        'question_id': question_id  
    }
    
    response = client.post("/recordings/", files=files, data=data)
    assert response.status_code == 200
    data = response.json()
    assert data["question_id"] == question_id
    assert "recording_url" in data
    assert data["transcript"] == "Test transcript"
    assert "feedback_json" in data
    assert "created_at" in data
    assert "updated_at" in data

def test_get_recordings_with_data(client, db, test_question):
    question_id = test_question.id
    
    recording = Recording(
        question_id=question_id,
        recording_url="test_url.wav",
        transcript="Test transcript",
        feedback_json={"score": 8.5},
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )
    db.add(recording)
    db.commit()
    db.refresh(recording)
    
    response = client.get("/recordings/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["question_id"] == question_id
    assert data[0]["recording_url"] == recording.recording_url
    assert data[0]["transcript"] == recording.transcript
    assert data[0]["feedback_json"] == recording.feedback_json 