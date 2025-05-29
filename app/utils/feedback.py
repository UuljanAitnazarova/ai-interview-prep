import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_feedback(transcript: str) -> dict:
    prompt = (
        "You are an expert interview coach. Analyze the following answer from a candidate:\n\n"
        f"{transcript}\n\n"
        "Please give feedback in a helpful, professional, and constructive tone. Focus on these five areas:\n"
        "- Clarity: Is the message easy to understand?\n"
        "- Structure: Is the response well-organized?\n"
        "- Tone: Does the tone sound confident and appropriate?\n"
        "- Language: Is the vocabulary professional and accurate?\n"
        "- Suggestions: What specific improvements could make the answer stronger?\n\n"
        "Respond as a JSON object using these exact keys: Clarity, Structure, Tone, Language, Suggested improvements."
    )
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )

    feedback_text = completion.choices[0].message.content
    return feedback_text  # We'll parse it if needed
