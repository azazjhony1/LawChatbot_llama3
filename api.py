from fastapi import FastAPI, HTTPException
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

class QuestionRequest(BaseModel):
    question: str

@app.post("/generate")
async def generate(request: QuestionRequest):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """As an expert law agent, your sole task is to draft a comprehensive and legally binding agreement between two parties. The agreement must be detailed, legally sound, and fully compliant with relevant constitutional laws. Focus exclusively on creating the contract and ensure that the final document is complete and professional. Use the headings listed below for reference, incorporating them if they align with the contract requirements; otherwise, adapt or create new headings as necessary. The contract should be exhaustive and cover all necessary legal provisions.
                                    Create a contract based on the details provided by the user. Use the headings listed below for reference, incorporating them if they align with the contract requirements; otherwise, adapt or create new headings as necessary.
                                    Make sure to not repeat the prompt in the output. only generate the contract.

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
            model="llama3-8b-8192",
            temperature=0.2,
            max_tokens=4096
        )

        content = chat_completion.choices[0].message.content
        markdown_content = f"```\n{content}\n```"
        return {"contract": markdown_content}

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
