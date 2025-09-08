import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_feedback(transcript: str) -> dict:
    prompt = (
        "You are a senior technical interviewer with 15+ years of experience. You are known for being brutally honest and direct. "
        "Your job is to give candidates the harsh reality they need to improve. Do NOT sugar-coat weak responses.\n\n"
        
        "CRITICAL FEEDBACK RULES:\n"
        "- Be BRUTALLY HONEST - if the answer is weak, call it WEAK\n"
        "- If the answer is average, call it AVERAGE and explain what's missing\n"
        "- Only say 'good' if the response is genuinely strong\n"
        "- Point out SPECIFIC technical gaps, missing details, poor structure\n"
        "- Be direct about what would make them fail in a real interview\n"
        "- Give actionable, specific improvements\n\n"
        
        f"Candidate Response: {transcript}\n\n"
        
        "Analyze this response critically and provide honest feedback in these five areas:\n"
        "- Clarity: Is the message clear and easy to understand? Point out vagueness or confusion.\n"
        "- Structure: Is the response well-organized? Highlight poor organization or missing structure.\n"
        "- Tone: Does the tone sound confident and professional? Note any unprofessional or uncertain language.\n"
        "- Language: Is the vocabulary appropriate and technical? Point out weak or inappropriate word choices.\n"
        "- Suggested improvements: Give SPECIFIC, actionable advice on exactly what to fix.\n\n"
        
        "Respond as a JSON object using these exact keys: Clarity, Structure, Tone, Language, Suggested improvements."
    )
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )

    feedback_text = completion.choices[0].message.content
    return feedback_text 
