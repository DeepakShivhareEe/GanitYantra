from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Allow React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_KEY"))
print("API KEY LOADED:", os.getenv("ANTHROPIC_KEY")[:10] if os.getenv("ANTHROPIC_KEY") else "NOT FOUND")

LEVEL_PROMPTS = {
    "class68": "Tum ek friendly math teacher ho. Class 6-8 ke liye simple Hinglish mein explain karo. Short sentences rakho.",
    "class910": "Tum CBSE expert teacher ho. Class 9-10 ke liye Hinglish mein explain karo. Common mistakes warn karo.",
    "class1112": "Tum JEE/NEET expert ho. Class 11-12 ke liye explain karo. Shortcuts aur traps batao.",
    "ug": "Tum university professor ho. Engineering students ke liye Hinglish mein explain karo. Theorem names batao.",
    "pg": "Tum PhD supervisor ho. Deep theory Hinglish mein explain karo. Research context do.",
}

class ExplainRequest(BaseModel):
    problem: str
    steps: list
    level: str
    topic: str

@app.post("/explain")
async def explain(req: ExplainRequest):
    system_prompt = LEVEL_PROMPTS.get(req.level, LEVEL_PROMPTS["class68"])
    steps_text = "\n".join([f"Step {i+1}: {s['latex']} — {s['explanation']}" 
                             for i, s in enumerate(req.steps)])
    
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        system=system_prompt,
        messages=[{
            "role": "user",
            "content": f"Problem: {req.problem}\nSteps:\n{steps_text}\n\nIn khaas steps ko Hinglish mein explain karo — 4-6 sentences. Key concept highlight karo. Common mistake warn karo."
        }]
    )
    
    return {"explanation": message.content[0].text}

@app.get("/health")
def health():
    return {"status": "ok"}