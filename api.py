from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
from dotenv import load_dotenv, set_key
from groq import Groq
from httpx import Client, create_ssl_context
from pyngrok import ngrok, conf

# Load existing environment variables
load_dotenv()

# Adjust SSL settings if necessary
ssl_context = create_ssl_context(verify=False)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY"),
    http_client=Client(verify=False)
)

app = FastAPI()

# Add CORS middleware
origins = [
    "http://localhost",
    "http://localhost:3000",  # If your frontend runs on port 3000
    # Add other origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str
    
class SummaryRequest(BaseModel):
    contract: str
    
class RegenerateRequest(BaseModel):
    text: str
    prompt: str
    
class ShorterRequest(BaseModel):
    text: str
    prompt: str
    
class LongerRequest(BaseModel):
    text: str
    prompt: str

@app.post("/generate")
async def generate(request: QuestionRequest):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """As an expert law agent, your sole task is to draft a comprehensive and legally binding agreement between two parties. The agreement must be detailed, legally sound, and fully compliant with relevant constitutional laws. Focus exclusively on creating the contract and ensure that the final document is complete and professional. Use the headings listed below for reference, incorporating them if they align with the contract requirements; otherwise, adapt or create new headings as necessary. The contract should be exhaustive and cover all necessary legal provisions.
                                    Create a contract based on the details provided by the user. Use the headings listed below for reference, incorporating them if they align with the contract requirements; otherwise, adapt or create new headings as necessary.
                                    Make sure to not repeat the prompt in the output. only generate the contract. Make sure the output looks like a professional contract document with bold headings etc.

                                    Important Headings:
                                    Products, Quantity, Price
                                    Pricing
                                     Title and Risk of Loss
                                    Locations of Supply
                                    Affiliates
                                    Quality
                                    Agreement Period
                                    Payment Terms
                                    Technical Support
                                    Safety, Health & Environment
                                    Audit
                                    Supply Security
                                    Collaboration Planning and Supply Assurance, Forecast
                                    Change Control
                                    Credit
                                    Set-Off and Recovery
                                    Economic Conditions and Trends Clause
                                    Failure in Performance
                                    Change in Circumstances
                                    Warranty Dispute Resolution
                                    US Law and Regulation
                                    Data Privacy
                                    Use Acknowledgement
                                    Termination
                                    Terms and Conditions
                                    Governing Law
                                    Binding Effect
                                    Entire Agreement
                                    Order of Precedence"""
                },
                {
                    "role": "user",
                    "content": request.question,
                }
            ],
            model="llama3-70b-8192",
            temperature=0.2,
            max_tokens=4096
        )

        return chat_completion.choices[0].message.content

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
@app.post("/summarize")
async def summarize(request: SummaryRequest):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """You are a highly skilled language model specialized in legal document analysis. Your task is to read through provided law contracts and create a comprehensive abstract summary for each. The summary should be clear, concise, and descriptive, capturing the key terms, conditions, parties involved, obligations, and any significant clauses. Ensure that the summary is written in plain language suitable for readers without legal expertise, but retains all critical details necessary for understanding the contract's essence."""
                },
                {
                    "role": "user",
                    "content": request.contract,
                }
            ],
            model="llama3-70b-8192",
            temperature=0.2,
            max_tokens=4096
        )

        return chat_completion.choices[0].message.content

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/regenerate")
async def regenerate(request: RegenerateRequest):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """Please regenerate the following highlighted text to improve clarity, precision, and professionalism while maintaining the original intent and legal validity. Ensure that the revised text aligns with standard legal practices and terminology. Make necessary adjustments to enhance readability and coherence, and correct any grammatical or syntactical errors. Donot say anything like here is the revised text or anything. Just give the output that the user expects."""
                },
                {
                    "role": "user",
                    "content": request.text if request.prompt == "" else request.text + request.prompt,
                }
            ],
            model="llama3-70b-8192",
            temperature=0.2,
            max_tokens=4096
        )

        return chat_completion.choices[0].message.content

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/shorten")
async def shorten(request: ShorterRequest):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """Shorten the highlighted text. Dont say anything like "here is the revised version" or any such thing. just provide shortened text to the user."""
                },
                {
                    "role": "user",
                    "content": request.text if request.prompt == "" else request.text + request.prompt,
                }
            ],
            model="llama3-70b-8192",
            temperature=0.2,
            max_tokens=4096
        )

        return chat_completion.choices[0].message.content

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
@app.post("/longer")
async def longer(request: LongerRequest):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """Elongate the highlighted text which means add more details into it and make it more detailed. Dont say anything like "here is the revised version" or any such thing. just provide shortened text to the user."""
                },
                {
                    "role": "user",
                    "content": request.text if request.prompt == "" else request.text + request.prompt,
                }
            ],
            model="llama3-70b-8192",
            temperature=0.2,
            max_tokens=4096
        )

        return chat_completion.choices[0].message.content

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Set your Ngrok authtoken
    conf.get_default().auth_token = os.getenv("NGROK_AUTH_TOKEN")

    # Start ngrok tunnel
    http_tunnel = ngrok.connect(8080)
    print(f"Ngrok tunnel created at: {http_tunnel.public_url}")

    # Update .env file
    env_path = '.env'
    set_key(env_path, "REACT_APP_API_URL", http_tunnel.public_url)
    print(f"Updated REACT_APP_API_URL in {env_path}")

    uvicorn.run(
        "api:app",  # Ensure this matches your filename and app instance
        host="0.0.0.0",  # Change to 0.0.0.0 to accept connections from ngrok
        port=8080,
        reload=True
    )
